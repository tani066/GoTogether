import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    const where = search
      ? { OR: [{ username: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, username: true, name: true, avatar: true, reputation: true, location: true, interests: true },
        skip,
        take: limit,
        orderBy: { reputation: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


