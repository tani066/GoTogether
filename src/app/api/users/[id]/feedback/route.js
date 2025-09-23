import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req, { params }) {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { receiverId: params.id },
      include: {
        sender: { select: { id: true, username: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const avgRating = feedback.length > 0
      ? Math.round((feedback.reduce((s, f) => s + f.rating, 0) / feedback.length) * 10) / 10
      : 0

    return NextResponse.json({ feedback, averageRating: avgRating, totalReviews: feedback.length })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


