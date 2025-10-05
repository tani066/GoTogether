'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Check, 
  ChevronLeft, 
  User, 
  Clock, // Added Clock for better date/time representation
  Loader2 // Used a more modern spinner
} from 'lucide-react';
import DashboardNavbar from '@/layouts/DashboardNavbar'; // Assuming this component exists

// --- Component: GroupsPage (Main) ---

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
      // Use replace for cleaner history when redirecting from unauth state
      router.replace('/auth/signin');
    }
  }, [status, router]);

  // Fetch created events (Memoized for clean dependency array)
  const fetchCreatedEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/events?creator=true');
      if (response.ok) {
        const data = await response.json();
        setCreatedEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching created events:', error);
    }
  }, []);

  // Fetch joined events (Memoized for clean dependency array)
  const fetchJoinedEvents = useCallback(async () => {
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
  }, []);

  // Fetch event participants (Memoized for clean dependency array)
  const fetchEventParticipants = useCallback(async (eventId) => {
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
  }, []);

  // Initial data fetching
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCreatedEvents();
      fetchJoinedEvents();
    }
  }, [status, fetchCreatedEvents, fetchJoinedEvents]); // Added fetch functions to dependencies

  // Handle event selection
  const handleEventSelect = (event) => {
    // Scroll to the top when a new event is selected for a better UX transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Format date helper: Now includes time for better detail
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950"> {/* Use 950 for deeper dark mode */}
        <DashboardNavbar />
        <div className="container mx-auto py-12 px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-800 dark:text-white">Groups</h1>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin" /> {/* Modern spinner */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300"> {/* Smooth background transition */}
      <DashboardNavbar />
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 dark:text-white transition-colors duration-300">
          {selectedEvent ? 'Event Details' : 'Your Groups'}
        </h1>
        
        {!selectedEvent ? (
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4"> {/* Enhanced shadow and entrance animation */}
            <div className="flex mb-6 border-b border-gray-100 dark:border-gray-700">
              <TabButton 
                label="Events You've Joined" 
                active={activeTab === 'joined'} 
                onClick={() => setActiveTab('joined')} 
              />
              <TabButton 
                label="Events You've Created" 
                active={activeTab === 'created'} 
                onClick={() => setActiveTab('created')} 
              />
            </div>
            
            {(activeTab === 'joined' ? joinedEvents : createdEvents).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Increased grid columns and gap */}
                {(activeTab === 'joined' ? joinedEvents : createdEvents).map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onSelect={handleEventSelect}
                    isJoined={activeTab === 'joined'}
                    isCreator={activeTab === 'created'}
                    formatDate={formatDate}
                    delay={index * 50} // Staggered animation for list items
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                tab={activeTab} 
                router={router} 
              />
            )}
          </div>
        ) : (
          <EventDetailsView 
            selectedEvent={selectedEvent}
            participants={participants}
            loadingParticipants={loadingParticipants}
            handleBackToEvents={handleBackToEvents}
            handleViewProfile={handleViewProfile}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}

// --- Component: TabButton ---

function TabButton({ label, active, onClick }) {
  return (
    <button 
      className={`
        px-6 py-3 font-semibold text-lg transition-all duration-300 ease-in-out relative
        ${active 
          ? 'text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }
      `}
      onClick={onClick}
    >
      {label}
      {/* Animated active tab indicator */}
      {active && (
        <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-lg transition-all duration-300 origin-bottom scale-y-100"></div>
      )}
    </button>
  );
}


// --- Component: EventCard ---

function EventCard({ event, onSelect, isJoined, isCreator, formatDate, delay }) {
  const spotsLeft = event.capacity - (event.attendances?.length || 0);
  
  return (
    <div 
      className="
        bg-white dark:bg-gray-800 rounded-xl shadow-lg 
        hover:shadow-2xl hover:scale-[1.02] 
        transition-all duration-300 ease-in-out 
        h-full flex flex-col cursor-pointer 
        border border-gray-100 dark:border-gray-700
      "
      style={{ animation: `fadeInSlideUp 0.5s ease-out forwards ${delay}ms`, opacity: 0 }} // Custom CSS keyframe for smoother entrance
    >
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="h-4 w-4 text-indigo-500" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{event.description}</p>
        
        <div className="flex items-center justify-between text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-semibold">
            <Users className="h-4 w-4 text-indigo-600" />
            <span>
              {event.attendances?.length || 0} / {event.capacity} Attendees
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-b-xl">
        <div className="flex items-center gap-3">
          {isJoined && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold p-1 bg-green-50 dark:bg-green-900/50 rounded-full">
              <Check className="h-4 w-4" />
              <span>Joined</span>
            </div>
          )}
          {isCreator && (
            <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold p-1 bg-blue-50 dark:bg-blue-900/50 rounded-full">
              <User className="h-4 w-4" />
              <span>Creator</span>
            </div>
          )}
        </div>
        
        <button 
          className="
            px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-full 
            hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 
            shadow-md hover:shadow-lg
          "
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click if one is added
            onSelect(event);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// --- Component: EmptyState ---

function EmptyState({ tab, router }) {
  const isJoined = tab === 'joined';
  return (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors duration-300">
      <Users className="h-12 w-12 text-indigo-500 mx-auto mb-4 opacity-70" />
      <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
        {isJoined ? "No events joined yet" : "No events created yet"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {isJoined 
          ? "It looks like you haven't RSVP'd to any events. Explore events to connect with others!"
          : "Start building your community by creating your first event now."
        }
      </p>
      <button 
        onClick={() => router.push(isJoined ? '/events' : '/create-event')} // Assuming /create-event route exists
        className="
          bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-lg 
          shadow-lg hover:bg-indigo-700 transform hover:scale-105 
          transition-all duration-300 ease-out
        "
      >
        {isJoined ? 'Find Events' : 'Create Event'}
      </button>
    </div>
  );
}

// --- Component: EventDetailsView (New) ---

function EventDetailsView({ selectedEvent, participants, loadingParticipants, handleBackToEvents, handleViewProfile, formatDate }) {
  
  const spotsLeft = selectedEvent.capacity - (selectedEvent.attendances?.length || 0);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
      <button 
        onClick={handleBackToEvents} 
        className="
          flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 
          font-semibold transition-colors mb-6 text-lg group
        "
      >
        <ChevronLeft className="h-6 w-6 mr-1 transform transition-transform group-hover:-translate-x-1" /> 
        Back to All Groups
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 mb-8 border-t-4 border-indigo-600 dark:border-indigo-400">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{selectedEvent.title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{selectedEvent.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-b border-gray-100 dark:border-gray-700 py-4">
          <InfoPill icon={Clock} label="Date & Time" value={formatDate(selectedEvent.date)} />
          <InfoPill icon={MapPin} label="Location" value={selectedEvent.location} />
          <InfoPill 
            icon={Users} 
            label="Attendance" 
            value={`${selectedEvent.attendances?.length || 0} / ${selectedEvent.capacity} participants`}
            status={spotsLeft <= 0 ? 'full' : spotsLeft <= 5 ? 'low' : 'ok'}
          />
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
          <p className={`font-semibold ${spotsLeft > 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {spotsLeft > 0 
              ? `Hurry up! ${spotsLeft} spots are still available.`
              : 'The event is now full.'
            }
          </p>
        </div>
      </div>
      
      {/* Participants Section */}
      <section>
        <h2 className="text-3xl font-bold mb-5 text-gray-800 dark:text-white">Participants ({participants.length})</h2>
        {loadingParticipants ? (
          <div className="flex justify-center items-center h-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : participants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participants.map((participant) => (
              <ParticipantCard 
                key={participant.id} 
                participant={participant} 
                handleViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-lg">Be the first to join this event!</p>
          </div>
        )}
      </section>
    </div>
  );
}

// --- Component: InfoPill (New Helper) ---

function InfoPill({ icon: Icon, label, value, status }) {
  let statusColor = 'text-gray-600 dark:text-gray-300';
  if (status === 'full') statusColor = 'text-red-600 dark:text-red-400';
  if (status === 'low') statusColor = 'text-yellow-600 dark:text-yellow-400';

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-base font-semibold ${statusColor}`}>{value}</p>
      </div>
    </div>
  );
}

// --- Component: ParticipantCard (New Helper) ---

function ParticipantCard({ participant, handleViewProfile }) {
  return (
    <div 
      className="
        bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 
        flex items-center justify-between transition-transform duration-300 hover:scale-[1.01]
        border border-gray-100 dark:border-gray-700
      "
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden flex-shrink-0">
          {participant.avatar ? (
            <img 
              src={participant.avatar} 
              alt={participant.name} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              {participant.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{participant.name}</h3>
          {participant.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{participant.location}</p>
          )}
        </div>
      </div>
      <button 
        className="
          px-4 py-2 text-sm border border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 
          rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200 
          font-medium flex-shrink-0
        "
        onClick={() => handleViewProfile(participant.id)}
      >
        View Profile
      </button>
    </div>
  );
}

// Add custom keyframes for the staggered list entrance effect
// This should ideally be in your global CSS, but included here for completeness
// The animation property is added to EventCard's style prop.
