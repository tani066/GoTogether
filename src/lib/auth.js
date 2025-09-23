import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

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
          // Call the backend login API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Invalid credentials');
          }

          // Return the user object
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.avatar,
            username: data.user.username,
            reputation: data.user.reputation
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For credentials provider, we already verified in the authorize function
      if (account?.provider === 'credentials') {
        return true;
      }
      
      // For Google provider
      if (account?.provider === 'google') {
        try {
          // Create or update user via internal API (use absolute URL in server callback)
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          const response = await fetch(`${baseUrl}/api/auth/oauth-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
            }),
          });

          if (!response.ok) {
            console.error('Failed to create/update user:', await response.text());
            // Do not block sign-in – continue to create a session
          }
        } catch (error) {
          console.error('Error during sign in:', error);
          // Do not block sign-in – continue to create a session
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.sub;
        session.user.username = token.username;
        session.user.reputation = token.reputation;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.username = user.email?.split('@')[0] || 'user';
        token.reputation = 0;
      }
      return token;
    },
  },
  // Remove custom pages configuration to use default NextAuth pages
  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/auth/error',
  // },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
