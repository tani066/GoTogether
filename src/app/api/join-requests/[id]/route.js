import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/join-requests/[id] - Update a join request (accept/reject)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!joinRequest) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 });
    }

    // Check if the current user is the event creator
    if (joinRequest.event.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorized to update this request' }, { status: 403 });
    }

    // Update the join request status
    const updatedRequest = await prisma.joinRequest.update({
      where: { id },
      data: { status }
    });

    // Delete the original join request notification
    await prisma.notification.deleteMany({
      where: {
        requestId: id,
        type: 'JOIN_REQUEST'
      }
    });

    // Create notification for the user who requested to join
    const notificationType = status === 'APPROVED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED';
    const notificationTitle = status === 'APPROVED' ? 'Request Approved' : 'Request Rejected';
    const notificationMessage = status === 'APPROVED' 
      ? `Your request to join "${joinRequest.event.title}" has been approved!` 
      : `Your request to join "${joinRequest.event.title}" has been rejected.`;

    await prisma.notification.create({
      data: {
        userId: joinRequest.userId,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        eventId: joinRequest.eventId,
        requestId: joinRequest.id
      }
    });

    // If approved, add user to event attendees
    if (status === 'APPROVED') {
      // Check if user is already an attendee
      const existingAttendance = await prisma.eventAttendance.findUnique({
        where: {
          userId_eventId: {
            userId: joinRequest.userId,
            eventId: joinRequest.eventId
          }
        }
      });

      if (!existingAttendance) {
        await prisma.eventAttendance.create({
          data: {
            userId: joinRequest.userId,
            eventId: joinRequest.eventId,
            attended: false
          }
        });
        
        // Update event capacity count in notification data
        const eventWithAttendances = await prisma.event.findUnique({
          where: { id: joinRequest.eventId },
          include: { attendances: true }
        });
        
        if (eventWithAttendances && typeof eventWithAttendances.capacity === 'number') {
          const spotsLeft = eventWithAttendances.capacity - eventWithAttendances.attendances.length;
          
          // Find the notification related to this join request
          const notification = await prisma.notification.findFirst({
            where: { requestId: joinRequest.id }
          });
          
          if (notification) {
            // Add capacity info to notification
            await prisma.notification.update({
              where: { id: notification.id },
              data: {
                data: JSON.stringify({
                  spotsLeft: spotsLeft,
                  totalCapacity: eventWithAttendances.capacity
                })
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      joinRequest: updatedRequest 
    });
  } catch (error) {
    console.error('Error updating join request:', error);
    return NextResponse.json({ error: 'Failed to update join request' }, { status: 500 });
  }
}

// DELETE /api/join-requests/[id] - Delete a join request
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id },
      include: { event: true }
    });

    if (!joinRequest) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 });
    }

    // Check if the current user is the event creator or the requester
    if (joinRequest.event.creatorId !== session.user.id && joinRequest.userId !== session.user.id) {
      return NextResponse.json({ error: 'You are not authorized to delete this request' }, { status: 403 });
    }

    // Delete the join request
    await prisma.joinRequest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting join request:', error);
    return NextResponse.json({ error: 'Failed to delete join request' }, { status: 500 });
  }
}