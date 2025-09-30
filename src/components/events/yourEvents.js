import React from 'react'
// Assuming these are imported from 'next/link' and other libraries like lucide-react or similar
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router'; // For router.back()
import { motion } from 'framer-motion'; // For motion.div
import { Calendar, Users, Star, Heart, ArrowRight, Bell, Settings, Sparkles, Plus } from 'lucide-react'; 


const YourEventsPage = ({ events, session, onEditEvent, onDeleteEvent, onViewRequests, onAcceptRequest, onRejectRequest, loading }) => {
  // Filter events created by the current admin
  const filteredEvents = events.filter(event => event.creatorId === session.user.id);

  // Toast logic (using a simple alert for demonstration, replace with your toast library)
  const showToast = (message, type = 'success') => {
    // Replace with your preferred toast library
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Handler wrappers for admin actions
  const handleEdit = (event) => {
    onEditEvent(event);
    showToast('Event edit opened.', 'info');
  };
  const handleDelete = async (event) => {
    try {
      await onDeleteEvent(event);
      showToast('Event deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete event.', 'error');
    }
  };
  const handleViewRequests = (event) => {
    onViewRequests(event);
    showToast('Viewing join requests.', 'info');
  };
  const handleAccept = async (request) => {
    try {
      await onAcceptRequest(request);
      showToast('Request accepted!', 'success');
    } catch (err) {
      showToast('Failed to accept request.', 'error');
    }
  };
  const handleReject = async (request) => {
    try {
      await onRejectRequest(request);
      showToast('Request rejected.', 'success');
    } catch (err) {
      showToast('Failed to reject request.', 'error');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {session.user.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Ready to discover your next adventure?
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <Calendar className="w-6 h-6 text-blue-600" />, label: "Events Attended", value: "12", bgColor: "bg-blue-100", textColor: "text-blue-600" },
              { icon: <Users className="w-6 h-6 text-green-600" />, label: "Groups Joined", value: "8", bgColor: "bg-green-100", textColor: "text-green-600" },
              { icon: <Star className="w-6 h-6 text-yellow-600" />, label: "Your Rating", value: "4.8", bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
              { icon: <Heart className="w-6 h-6 text-red-600" />, label: "Friends Made", value: "24", bgColor: "bg-red-100", textColor: "text-red-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.textColor} mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Your Events Section (Moved inside Main Content) */}
          <YourEventsSection events={events} session={session} onEditEvent={onEditEvent} onDeleteEvent={onDeleteEvent} onViewRequests={onViewRequests} onAcceptRequest={onAcceptRequest} onRejectRequest={onRejectRequest} loading={loading} />
          
          {/* Featured Events (Existing content) */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Events</h2>
              <Link
                href="/events"
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

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
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 6).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
                  >
                    {event.imageUrl && (
                      <div className="h-48 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                    )}
                    <div className="p-6">
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
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No events yet</h3>
                <p className="text-gray-500 mb-4 dark:text-gray-400">Be the first to discover amazing events in your city!</p>
                <Link
                  href="/events"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Explore Events
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions (Existing content) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Ready for your next adventure?</h3>
            <p className="text-indigo-100 mb-6">
              Join groups, discover events, and make new friends who share your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Link>
              <Link
                href="/groups"
                className="inline-flex items-center px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                My Groups
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}




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
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">You haven't created any events yet.</p>
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
                ? <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover rounded-t-xl mb-4" />
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