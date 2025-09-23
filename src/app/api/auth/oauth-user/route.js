import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, name, image, provider, providerId } = body
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        avatar: image,
        provider,
        providerId,
      },
      create: {
        email,
        username: email.split('@')[0],
        name,
        avatar: image,
        provider,
        providerId,
        interests: [],
        reputation: 0,
      }
    })

    return NextResponse.json({
      message: 'User created/updated successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        reputation: user.reputation,
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


