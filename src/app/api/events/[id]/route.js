import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event details' }, { status: 500 });
  }
}

// Update an event
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const unwrappedParams = await params;
    const { id } = unwrappedParams;
    const data = await request.json();
    
    // Verify the event exists and belongs to the user
    const event = await prisma.event.findUnique({
      where: { id },
      select: { creatorId: true },
    });
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    if (event.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorized to edit this event' }, { status: 403 });
    }
    
    // Format date to ISO string for Prisma
    const formattedDate = data.date ? new Date(data.date).toISOString() : null;
    
    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: formattedDate,
        time: data.time,
        location: data.location,
        capacity: data.maxParticipants, // Using capacity field from schema instead of maxParticipants
        category: data.category,
      },
    });
    
    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete an event
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const unwrappedParams = await params;
    const { id } = unwrappedParams;
    
    // Verify the event exists and belongs to the user
    const event = await prisma.event.findUnique({
      where: { id },
      select: { creatorId: true },
    });
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    if (event.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorized to delete this event' }, { status: 403 });
    }
    
    // Delete related join requests
    await prisma.joinRequest.deleteMany({
      where: { eventId: id },
    });
    
    // Delete related notifications
    await prisma.notification.deleteMany({
      where: { eventId: id },
    });
    
    // Delete the event
    await prisma.event.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}