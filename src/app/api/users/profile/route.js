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
    const user = await prisma.user.update({
      where: session.user.email ? { email: session.user.email } : { id: session.user.id },
      data: {
        name: body.name ?? undefined,
        username: body.username ?? undefined,
        bio: body.bio ?? undefined,
        age: body.age ? parseInt(body.age, 10) || null : undefined,
        location: body.location ?? undefined,
        interests: Array.isArray(body.interests) ? body.interests : [],
        profileComplete: true,
      },
      select: {
        id: true, email: true, username: true, name: true, bio: true, age: true, 
        location: true, avatar: true, interests: true, reputation: true
      }
    })
    return NextResponse.json(user)
  } catch (err) {
    console.error('Error updating user profile:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


