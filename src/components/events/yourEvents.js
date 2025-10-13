import React from 'react'
// Assuming these are imported from 'next/link' and other libraries like lucide-react or similar
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router'; // For router.back()
import { motion } from 'framer-motion'; // For motion.div
import { Calendar, Users, Star, Heart, ArrowRight, Bell, Settings, Sparkles, Plus } from 'lucide-react'; 


const YourEventsSection = ({ events, session, onEditEvent, onDeleteEvent, onViewRequests, onAcceptRequest, onRejectRequest, loading }) => {
  // Filter events created by the current admin
  const filteredEvents = events?.filter(event => event.creatorId === session?.user?.id) || [];

  // Toast logic (using a simple alert for demonstration, replace with your toast library)
  const showToast = (message, type = 'success') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Handler wrappers for admin actions
  const handleEdit = (event) => {
    if (onEditEvent) onEditEvent(event);
    showToast('Event edit opened.', 'info');
  };
  const handleDelete = async (event) => {
    if (!onDeleteEvent) return;
    try {
      await onDeleteEvent(event);
      showToast('Event deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete event.', 'error');
    }
  };
  const handleViewRequests = (event) => {
    if (onViewRequests) onViewRequests(event);
    showToast('Viewing join requests.', 'info');
  };
  const handleAccept = async (request) => {
    if (!onAcceptRequest) return;
    try {
      await onAcceptRequest(request);
      showToast('Request accepted!', 'success');
    } catch (err) {
      showToast('Failed to accept request.', 'error');
    }
  };
  const handleReject = async (request) => {
    if (!onRejectRequest) return;
    try {
      await onRejectRequest(request);
      showToast('Request rejected.', 'success');
    } catch (err) {
      showToast('Failed to reject request.', 'error');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Created Events</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse dark:bg-gray-800 dark:border-gray-700">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="col-span-3 text-center py-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">You haven&apos;t created any events yet.</p>
          <Link href="/events/create" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Create Event</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between relative"
            >
              {event.imageUrl
                ? <Image src={event.imageUrl} alt={event.title} width={500} height={300} className="h-48 w-full object-cover rounded-t-xl mb-4" />
                : <div className="h-48 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-t-xl mb-4"></div>
              }
              {/* Capacity left badge */}
              {typeof event.capacity === 'number' && (
                <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  {event.capacity - (event.attendances?.length || 0)} spots left
                </span>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                    {event.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-300">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    📍 {event.location}
                  </span>
                  <Link
                    href={`/events/${event.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Manage →
                  </Link>
                </div>
                {/* Admin management actions */}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(event)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(event)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  <button onClick={() => handleViewRequests(event)} className="px-3 py-1 bg-blue-500 text-white rounded">Requests</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourEventsSection;