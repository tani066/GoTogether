import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { creatorId: params.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.event.count({ where: { creatorId: params.id } })
    ])

    return NextResponse.json({ events, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


