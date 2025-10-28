import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: session.user.email ? { email: session.user.email } : { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        age: true,
        location: true,
        avatar: true,
        interests: true,
        reputation: true,
        profileComplete: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const body = await req.json();

    const where = session.user.email ? { email: session.user.email } : { id: session.user.id };

    // Upsert to avoid 500 for new users not yet in local DB
    const user = await prisma.user.upsert({
      where,
      update: {
        name: body.name ?? undefined,
        username: body.username ?? undefined,
        bio: body.bio ?? undefined,
        age: body.age ? parseInt(body.age, 10) || null : undefined,
        location: body.location ?? undefined,
        interests: Array.isArray(body.interests) ? body.interests : [],
        profileComplete: true,
      },
      create: {
        email: session.user.email,
        username: body.username || (session.user.email ? session.user.email.split('@')[0] : `user_${Date.now()}`),
        name: body.name || session.user.name || '',
        bio: body.bio || '',
        age: body.age ? parseInt(body.age, 10) || null : null,
        location: body.location || '',
        interests: Array.isArray(body.interests) ? body.interests : [],
        profileComplete: true,
        reputation: 0,
      },
      select: {
        id: true, email: true, username: true, name: true, bio: true, age: true,
        location: true, avatar: true, interests: true, reputation: true
      }
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error('Error updating user profile:', err);
    // Handle unique constraint violations gracefully
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}


