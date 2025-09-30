'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Check } from 'lucide-react';
import DashboardNavbar from '@/layouts/DashboardNavbar';

export default function GroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joined');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch created events
  const fetchCreatedEvents = async () => {
    try {
      const response = await fetch('/api/events?creator=true');
      if (response.ok) {
        const data = await response.json();
        setCreatedEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching created events:', error);
    }
  };

  // Fetch joined events
  const fetchJoinedEvents = async () => {
    try {
      const response = await fetch('/api/events/joined');
      if (response.ok) {
        const data = await response.json();
        setJoinedEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching joined events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch event participants
  const fetchEventParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const response = await fetch(`/api/events/${eventId}/participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || []);
      }
    } catch (error) {
      console.error('Error fetching event participants:', error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCreatedEvents();
      fetchJoinedEvents();
    }
  }, [status]);

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    fetchEventParticipants(event.id);
  };

  // Handle view profile
  const handleViewProfile = (userId) => {
    if (userId) {
      router.push(`/profile/${userId}`);
    } else {
      console.error("User ID is undefined");
    }
  };

  // Handle back to events
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setParticipants([]);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardNavbar />
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Groups</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar />
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Groups</h1>
        
        {!selectedEvent ? (
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
              <button 
                className={`px-6 py-3 font-medium text-base ${activeTab === 'joined' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('joined')}
              >
                Events You&apos;ve Joined
              </button>
              <button 
                className={`px-6 py-3 font-medium text-base ${activeTab === 'created' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('created')}
              >
                Events You&apos;ve Created
              </button>
            </div>
            
            {activeTab === 'joined' && (
              <div className="space-y-6">
                {joinedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {joinedEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onSelect={handleEventSelect}
                        isJoined={true}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-xl font-medium mb-2">You haven&apos;t joined any events yet</h3>
                    <p className="text-gray-500 mb-6">Discover and join events to connect with others</p>
                    <button 
                      onClick={() => router.push('/events')}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Find Events
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'created' && (
              <div className="space-y-6">
                {createdEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onSelect={handleEventSelect}
                        isCreator={true}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-xl font-medium mb-2">You haven&apos;t created any events yet</h3>
                    <p className="text-gray-500 mb-6">Create your first event to connect with others</p>
                    <button 
                      onClick={() => router.push('/events')}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Create Event
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={handleBackToEvents} 
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to Events
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4" />
                    <span>
                      {selectedEvent.attendances?.length || 0} / {selectedEvent.capacity} participants
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-6">{selectedEvent.description}</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Participants</h2>
              {loadingParticipants ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : participants.length > 0 ? (
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                            {participant.avatar ? (
                              <img src={participant.avatar} alt={participant.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-indigo-600 font-medium">{participant.name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{participant.name}</h3>
                            {participant.location && (
                              <p className="text-sm text-gray-500">{participant.location}</p>
                            )}
                          </div>
                        </div>
                        <button 
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleViewProfile(participant.id)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <p className="text-gray-500">No participants found for this event</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, onSelect, isJoined, isCreator, formatDate }) {
  const spotsLeft = event.capacity - (event.attendances?.length || 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{event.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4" />
            <span>
              {event.attendances?.length || 0} / {event.capacity}
            </span>
          </div>
          <div className="text-sm font-medium">
            {spotsLeft > 0 ? (
              <span className="text-green-600 dark:text-green-400">
                {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Full</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {isJoined && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
            <Check className="h-4 w-4" />
            <span>Joined</span>
          </div>
        )}
        {isCreator && (
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            You created this event
          </div>
        )}
        <button 
          className="ml-auto px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => onSelect(event)}
        >
          View Group
        </button>
      </div>
    </div>
  );
}