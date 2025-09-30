'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Star, Mail, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default function UserProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserEvents();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/events`);
      if (response.ok) {
        const data = await response.json();
        setUserEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  if (loading) {
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

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "We couldn't find the user you're looking for."}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-6 py-6 md:px-8 md:py-8 flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 -mt-16 md:-mt-20 mb-4 md:mb-0 md:mr-8">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white dark:border-gray-800 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 md:h-16 md:w-16 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                {user.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.reputation && (
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{user.reputation} Rating</span>
                  </div>
                )}
              </div>
              {user.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
                  {user.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {user.interests && (typeof user.interests === 'string' 
                  ? user.interests.split(',').map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full"
                    >
                      {interest.trim()}
                    </span>
                  ))
                  : Array.isArray(user.interests) 
                    ? user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full"
                      >
                        {typeof interest === 'string' ? interest.trim() : interest}
                      </span>
                    ))
                    : null
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* User Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: Calendar, label: 'Events Created', value: userEvents.filter(e => e.creatorId === userId).length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
            { icon: Users, label: 'Events Joined', value: userEvents.filter(e => e.creatorId !== userId).length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
            { icon: Star, label: 'Rating', value: user.reputation || '4.5', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
            { icon: Heart, label: 'Connections', value: '24', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* User Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Events by {user.name}</h2>
          
          {userEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                      ) : (
                        <Calendar className="h-12 w-12 text-white opacity-50" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                          {event.category || 'General'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          📍 {event.location || 'Online'}
                        </span>
                        {typeof event.capacity === 'number' && (
                          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {event.capacity - (event.attendances?.length || 0)} spots left
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Events Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">This user hasn&apos;t created any events yet.</p>
            </div>
          )}
        </motion.div>
        
        {/* Action Buttons */}
        <div className="flex justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mr-4"
          >
            Go Back
          </button>
          {session && session.user.id !== userId && (
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}