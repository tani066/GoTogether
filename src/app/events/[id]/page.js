'use client';

import { useEffect, useState, use} from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Helper Icons (using simple SVGs for universal support)
const CalendarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const ClockIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const LocationIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.707A10.134 10.134 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10c0 1.468-.318 2.871-.908 4.144L12 21.018l-5.748-4.311A9.957 9.957 0 0012 17a9.957 9.957 0 005.657-.293z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a2 2 0 100-4 2 2 0 000 4z" /></svg>);
const TagIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21V9a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11H8m6 0h-2m2 4h-4m4 4H8m0-12V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>);
const RupeeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CapacityIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M12 10a5 5 0 100-10 5 5 0 000 10z" /></svg>);
const LinkIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);


// Custom Detail Item component with enhanced styling
function DetailItem({ label, value, icon: Icon, isLink = false }) {
  // Use a fallback for null/empty values
  const displayValue = value || (isLink ? 'N/A' : 'Unknown');
  
  return (
    <motion.div 
        className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {Icon && <Icon className="h-4 w-4 text-indigo-500" />}
          <span className="uppercase tracking-wider">{label}</span>
      </div>
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-600 dark:text-indigo-400 font-semibold text-base hover:underline break-all"
        >
          {value ? 'View External Link' : 'N/A'}
        </a>
      ) : (
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {displayValue}
        </span>
      )}
    </motion.div>
  );
}

export default function EventDetailsPage({ params }) {
  // **CRITICAL FIX:** Access id directly from params in client component
  // The line `const { id } = use(params);` is incorrect for Client Components
  const { id } = use(params); 
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState(null); 
  const [joinError, setJoinError] = useState('');

  // --- Data Fetching Logic ---

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && id) {
      fetchEventDetails();
    }
  }, [session, id, fetchEventDetails]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const data = await response.json();
      setEvent(data.event);
      if (data.event.isUserJoined) {
          setJoinStatus('joined');
      }
      
      // Check if user has a pending join request
      const joinRequestsResponse = await fetch(`/api/join-requests?eventId=${id}`);
      if (joinRequestsResponse.ok) {
        const joinRequestsData = await joinRequestsResponse.json();
        const userRequests = joinRequestsData.userRequests || [];
        
        if (userRequests.length > 0) {
          const request = userRequests[0];
          if (request.status === 'PENDING') {
            setJoinStatus('requested');
          } else if (request.status === 'APPROVED') {
            setJoinStatus('joined');
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    setJoinLoading(true);
    setJoinError('');
    try {
      const response = await fetch(`/api/join-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: id,
          message: '' // Optional message from user
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setJoinError(errorData.error || 'Failed to send join request.');
        return;
      }
      setJoinStatus('requested');
    } catch (err) {
      console.error('Join request error:', err);
      setJoinError('An internal error occurred.');
    } finally {
      setJoinLoading(false);
    }
  };

  // --- UI Components: Loading & Error States ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
        >
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">Loading Event Details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 p-8 rounded-xl shadow-lg max-w-lg text-center"
        >
          <p className="text-xl font-semibold mb-2">Oops! Something went wrong.</p>
          <p>{error || 'Event not found or accessible.'}</p>
          <Link href="/events" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
            ← Back to All Events
          </Link>
        </motion.div>
      </div>
    );
  }

  // Determine button state text
  let buttonText = 'Join Event';
  let buttonDisabled = joinLoading || joinStatus === 'requested' || joinStatus === 'joined';

  if (joinLoading) {
      buttonText = 'Sending Request...';
  } else if (joinStatus === 'requested') {
      buttonText = 'Request Sent!';
  } else if (joinStatus === 'joined') {
      buttonText = 'You Are Joined!';
      buttonDisabled = true;
  }

  // --- Main Render: Enhanced Design ---

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Events</span>
        </motion.button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Hero Image Section */}
          {event.imageUrl ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-96"
            >
                <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                    <motion.span 
                        className="inline-block px-4 py-1.5 text-sm font-bold text-white bg-indigo-600/80 rounded-full mb-4 shadow-lg tracking-wider backdrop-blur-sm"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    >
                        {event.category.toUpperCase() || 'UNCATEGORIZED'}
                    </motion.span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                        {event.title}
                    </h1>
                </div>
            </motion.div>
          ) : (
            <div className="w-full h-80 bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center">
                <div className="text-center p-8">
                    <motion.span 
                        className="inline-block px-4 py-1.5 text-sm font-bold text-white bg-white/20 rounded-full mb-4 backdrop-blur-sm"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    >
                        {event.category.toUpperCase() || 'UNCATEGORIZED'}
                    </motion.span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                        {event.title}
                    </h1>
                </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            
            {/* Description */}
            <header className="mb-10 border-b pb-6 dark:border-gray-700">
                <div className="flex items-center mb-6">
                    <div className="h-10 w-1 bg-indigo-600 mr-3 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About This Event</h2>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                    {event.description}
                </p>
            </header>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <DetailItem label="Date" value={new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} icon={CalendarIcon} />
                <DetailItem label="Time" value={event.time} icon={ClockIcon} />
                <DetailItem label="Location" value={event.location} icon={LocationIcon} />
                <DetailItem label="Category" value={event.category} icon={TagIcon} />
                <DetailItem label="Price" value={event.price ? `₹${event.price}` : 'Free'} icon={RupeeIcon} />
                <DetailItem label="Capacity" value={event.capacity || 'Unlimited'} icon={CapacityIcon} />
                {event.externalUrl && (
                    <DetailItem label="RSVP Link" value={event.externalUrl} isLink icon={LinkIcon} />
                )}
            </div>

            {/* Action Section */}
            <div className="pt-8 border-t dark:border-gray-700">
                <motion.button
                    onClick={handleJoinEvent}
                    className={`
                        w-full md:w-auto px-12 py-4 text-xl rounded-xl font-extrabold shadow-lg transition-all duration-300 transform flex items-center justify-center space-x-2
                        ${buttonDisabled && joinStatus === 'joined' 
                            ? 'bg-green-600/90 text-white cursor-not-allowed shadow-green-500/40' 
                            : buttonDisabled && joinStatus === 'requested' 
                            ? 'bg-gray-500 text-white cursor-not-allowed shadow-gray-400/30'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800 hover:-translate-y-1 shadow-2xl shadow-indigo-600/50'
                        }
                        disabled:opacity-70 disabled:shadow-none
                    `}
                    disabled={buttonDisabled}
                    whileHover={!buttonDisabled ? { scale: 1.02 } : {}}
                    whileTap={!buttonDisabled ? { scale: 0.98 } : {}}
                >
                    {joinLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
                    <span>{buttonText}</span>
                </motion.button>
                
                {joinError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800"
                    >
                        **Error:** {joinError}
                    </motion.div>
                )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}