import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/events - Get all events (or only those created by the current user when ?creator=true)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const creatorOnly = searchParams.get('creator') === 'true';

    const where = creatorOnly ? { creatorId: session.user.id } : undefined;

    const events = await prisma.event.findMany({
      where,
      include: {
        attendances: true,
        groups: true,
      },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
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
    const requiredFields = ['title', 'description', 'date', 'location', 'category'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    // Create event in the database
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time || null,
        location: data.location,
        category: data.category,
        price: data.price ? parseFloat(data.price) : null,
        capacity: data.capacity ? parseInt(data.capacity, 10) : null,
        imageUrl: data.imageUrl || null,
        externalUrl: data.externalUrl || null,
        creatorId: session.user.id,
      },
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}