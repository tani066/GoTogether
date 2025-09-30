import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Fetch event to verify it exists
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Fetch participants (users who have approved attendance)
    const participants = await prisma.eventAttendance.findMany({
      where: {
        eventId: id,
        status: 'APPROVED'
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            location: true,
            bio: true,
            interests: true
          }
        }
      }
    });

    // Format the response
    const formattedParticipants = participants.map(attendance => attendance.user);

    return NextResponse.json({ participants: formattedParticipants });
  } catch (error) {
    console.error('Error fetching event participants:', error);
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
  }
}