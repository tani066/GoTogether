import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/events - Get all events
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Sample events data (replace with actual database query when ready)
    const events = [
      {
        id: '1',
        title: 'Weekend Hiking Trip',
        description: 'Join us for a weekend hiking trip to the mountains. All experience levels welcome!',
        date: '2023-08-15T09:00:00Z',
        location: 'Mountain Trail Park',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        attendees: 12,
        organizer: {
          id: '101',
          name: 'John Doe',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        category: 'Outdoor'
      },
      {
        id: '2',
        title: 'Tech Meetup: AI and the Future',
        description: 'A discussion about the latest developments in AI and what the future holds.',
        date: '2023-08-20T18:30:00Z',
        location: 'Downtown Conference Center',
        imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        attendees: 45,
        organizer: {
          id: '102',
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        category: 'Technology'
      },
      {
        id: '3',
        title: 'Community Cleanup Day',
        description: 'Help us clean up the local park and make our community a better place!',
        date: '2023-08-25T10:00:00Z',
        location: 'Central Park',
        imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        attendees: 20,
        organizer: {
          id: '103',
          name: 'Michael Brown',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        category: 'Community'
      },
      {
        id: '4',
        title: 'Yoga in the Park',
        description: 'Join our outdoor yoga session for all skill levels. Bring your own mat!',
        date: '2023-08-18T08:00:00Z',
        location: 'Riverside Park',
        imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        attendees: 15,
        organizer: {
          id: '104',
          name: 'Emily Chen',
          avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
        },
        category: 'Fitness'
      }
    ];

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // For now, just return the created event with a mock ID
    // In a real implementation, you would save to the database
    return NextResponse.json({
      event: {
        id: Date.now().toString(),
        ...data,
        organizer: {
          id: session.user.id,
          name: session.user.name,
          avatar: session.user.image
        },
        attendees: 1,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}