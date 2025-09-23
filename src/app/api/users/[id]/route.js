import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true, username: true, name: true, bio: true, age: true,
        location: true, avatar: true, interests: true, reputation: true, createdAt: true
      }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


