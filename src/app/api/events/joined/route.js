import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/events/joined - Get events the user has been accepted to join
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all events where the user has an approved attendance
    const joinedEvents = await prisma.event.findMany({
      where: {
        attendances: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        attendances: true,
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json({ events: joinedEvents });
  } catch (error) {
    console.error('Error fetching joined events:', error);
    return NextResponse.json({ error: 'Failed to fetch joined events' }, { status: 500 });
  }
}