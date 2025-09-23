import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req, { params }) {
  try {
    const groups = await prisma.group.findMany({
      where: { members: { some: { userId: params.id, status: 'APPROVED' } } },
      include: {
        event: { select: { id: true, title: true, date: true, location: true, category: true } },
        _count: { select: { members: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ groups })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


