'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import YourEventsSection from '../../components/events/yourEvents';
import Link from 'next/link';
import { ArrowRight, Calendar, Heart, Plus, Star, Users, Briefcase, TrendingUp, Check } from 'lucide-react'; // Added more icons for flexibility

// --- CONSTANTS/HELPERS (Outside the component for better performance) ---

// Animation for fade-in and scale-up effect
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
};

// Data for the quick stats cards
const statCardData = (totalEvents, createdEvents, upcomingEvents, favoriteEvents) => [
  {
    icon: Calendar,
    title: 'Total Events',
    value: totalEvents,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-gray-700/50',
  },
  {
    icon: Briefcase, // Changed from Star to Briefcase for 'Your Created' to imply management
    title: 'Events Created',
    value: createdEvents,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-gray-700/50',
  },
  {
    icon: TrendingUp, // Changed from Users to TrendingUp for 'Upcoming' to imply future
    title: 'Upcoming',
    value: upcomingEvents,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-gray-700/50',
  },
  {
    icon: Heart,
    title: 'Favorites',
    value: favoriteEvents,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-gray-700/50',
  },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  // --- AUTHENTICATION & REDIRECTION ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (session) {
      fetchEvents();
      fetchAcceptedEvents();
    }
  }, [session]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // NOTE: Ensure your /api/events endpoint is protected and returns user-relevant data
      const response = await fetch(`/api/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAcceptedEvents = async () => {
    try {
      // Fetch events where the user has been accepted
      const response = await fetch(`/api/events/joined`);
      if (!response.ok) {
        throw new Error('Failed to fetch accepted events');
      }
      const data = await response.json();
      setAcceptedEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching accepted events:', error);
    }
  };

  // --- STUB HANDLERS ---
  const handleEditEvent = (event) => { console.log('Edit event:', event); };
  const handleDeleteEvent = async (event) => { console.log('Delete event:', event); };
  const handleViewRequests = (event) => { console.log('View requests for event:', event); };
  const handleAcceptRequest = async (request) => { console.log('Accept request:', request); };
  const handleRejectRequest = async (request) => { console.log('Reject request:', request); };

  // --- LOADING / GUARD CLAUSES ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 shadow-lg"
        ></motion.div>
      </div>
    );
  }

  if (!session) {
    return null; // Will be redirected by useEffect
  }

  // --- DASHBOARD STATS CALCULATIONS ---
  const totalEvents = events.length;
  // NOTE: This comparison is highly dependent on how your event data is structured.
  // A robust solution would use the event's actual creator ID/foreign key.
  const createdEvents = events.filter(e => e.createdBy === session?.user?.email).length;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
  // NOTE: 'e.isFavorite' is a placeholder. You'll need a backend check for a user's favorites.
  const favoriteEvents = events.filter(e => e.isFavorite).length;
  
  const statsData = statCardData(totalEvents, createdEvents, upcomingEvents, favoriteEvents);

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* ======================= WELCOME SECTION ======================= */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
            Welcome back, {session.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your hub for events, groups, and connections.
          </p>
        </motion.div>

        {/* ======================= QUICK STATS (Enhanced Cards) ======================= */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={stat.title}
              variants={cardVariants}
              className={`rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 ${stat.bg} hover:shadow-xl dark:shadow-2xl dark:shadow-gray-950/50`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.bg} bg-opacity-70 dark:bg-opacity-30`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ======================= QUICK ACTIONS (CTA Banner) ======================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-2">
                Ready for your next adventure?
              </h3>
              <p className="text-indigo-100/90 mb-6 md:mb-0 max-w-lg">
                Discover new communities, browse events, or create your own in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 rounded-full hover:bg-gray-100 transition-colors font-semibold shadow-md"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Link>
              <Link
                href="/events" // Added a link to create an event
                className="inline-flex items-center px-6 py-3 border border-white text-white rounded-full hover:bg-white/20 transition-colors font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </div>
          </div>
        </motion.div>
        
        {/* ======================= FEATURED EVENTS ======================= */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Events</h2>
            <Link
              href="/events"
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            // Placeholder/Skeleton Loader
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            // Event Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href={`/events/${event.id}`}>
                    {event.imageUrl
                      ? <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover" />
                      : <div className="h-48 w-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center">
                          <Star className="w-12 h-12 text-white opacity-50" />
                        </div>
                    }
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs px-3 py-1 font-semibold rounded-full">
                          {event.category || 'General'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {/* Capacity badge */}
                      {typeof event.capacity === 'number' && (
                        <div className="mb-3">
                          <span className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                            {event.capacity - (event.attendances?.length || 0)} spots left
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {event.description || 'No description provided.'}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          📍 {event.location || 'Online'}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center">
                          Details <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Featured Events Right Now</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to create one or explore the full events page!</p>
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Explore Events
              </Link>
            </div>
          )}
        </div>

        {/* ======================= EVENTS YOU'VE JOINED ======================= */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Events You've Joined</h2>
          {acceptedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href={`/events/${event.id}`}>
                    {event.imageUrl
                      ? <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover" />
                      : <div className="h-48 w-full bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center">
                          <Check className="w-12 h-12 text-white opacity-50" />
                        </div>
                    }
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-3 py-1 font-semibold rounded-full">
                          Joined
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-green-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {event.description || 'No description provided.'}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          📍 {event.location || 'Online'}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium text-sm flex items-center">
                          View Details <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">You Haven't Joined Any Events Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Browse events and send join requests to get started!</p>
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                <Users className="w-4 h-4 mr-2" />
                Find Events to Join
              </Link>
            </div>
          )}
        </div>

        {/* ======================= YOUR EVENTS (Admin/Creator Management) ======================= */}
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Events & Management</h2>
             <YourEventsSection
                events={events} // You might want to filter this list to only show created/managed events
                session={session}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onViewRequests={handleViewRequests}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                loading={loading}
              />
        </div>

      </div>
    </div>
  );
}