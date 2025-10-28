import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Invalid credentials');

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.avatar,
            username: data.user.username,
            reputation: data.user.reputation,
            profileComplete: data.user.profileComplete, // ✅ include if API sends it
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true;

      if (account?.provider === 'google') {
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          await fetch(`${baseUrl}/api/auth/oauth-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
            }),
          });
        } catch (error) {
          console.error('Error during sign in:', error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (!session?.user?.email) return session;

      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.username = dbUser.username;
          session.user.reputation = dbUser.reputation;
          session.user.profileComplete = dbUser.profileComplete;
        }
      } catch (err) {
        console.error('Prisma session lookup failed:', err);
        // Gracefully proceed without DB-enriched fields
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username || user.email?.split('@')[0] || 'user';
        token.reputation = user.reputation || 0;
        token.profileComplete = user.profileComplete ?? false; // ✅ keep in JWT
      }
      return token;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
