import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import {prisma} from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    // Verify the event exists
    const event = await prisma.event.findUnique({
      where: { id },
      select: { creatorId: true }
    });
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    // Only allow the event creator to view requests
    if (event.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Fetch all join requests for this event
    const requests = await prisma.joinRequest.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING first, then APPROVED, then REJECTED
        { createdAt: 'desc' } // Newest first within each status group
      ]
    });
    
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching event requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}