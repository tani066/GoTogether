import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
        age: body.age ?? undefined,
        location: body.location ?? undefined,
        interests: Array.isArray(body.interests) ? body.interests : [],
      },
      select: {
        id: true, email: true, username: true, name: true, avatar: true, reputation: true
      }
    })
    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


