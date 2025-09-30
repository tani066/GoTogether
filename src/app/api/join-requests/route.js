import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/join-requests - Create a new join request
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, message } = await request.json();
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { creator: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user already has a request for this event
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'You have already requested to join this event' }, { status: 400 });
    }

    // Create join request
    const joinRequest = await prisma.joinRequest.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
        message: message || '',
        status: 'PENDING'
      }
    });

    // Create notification for event creator
    await prisma.notification.create({
      data: {
        userId: event.creatorId,
        type: 'JOIN_REQUEST',
        title: 'New Join Request',
        message: `${session.user.name || 'A user'} wants to join your event "${event.title}"`,
        eventId: eventId,
        requestId: joinRequest.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      joinRequest 
    });
  } catch (error) {
    console.error('Error creating join request:', error);
    return NextResponse.json({ error: 'Failed to create join request' }, { status: 500 });
  }
}

// GET /api/join-requests - Get all join requests for the current user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');

    let whereClause = {};
    
    // If eventId is provided, filter by event
    if (eventId) {
      whereClause.eventId = eventId;
    }
    
    // If status is provided, filter by status
    if (status) {
      whereClause.status = status;
    }

    // Get join requests for events created by the user
    const createdEventsRequests = await prisma.joinRequest.findMany({
      where: {
        event: {
          creatorId: session.user.id
        },
        ...whereClause
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            username: true
          }
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get join requests made by the user
    const userRequests = await prisma.joinRequest.findMany({
      where: {
        userId: session.user.id,
        ...whereClause
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            imageUrl: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      createdEventsRequests,
      userRequests
    });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json({ error: 'Failed to fetch join requests' }, { status: 500 });
  }
}