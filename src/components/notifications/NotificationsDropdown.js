'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear all notifications
  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    
    try {
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: notifications.map(n => n.id) }),
      });
      
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Mark notifications as read
  const markAsRead = async (ids) => {
    if (!ids || ids.length === 0) return;
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            ids.includes(notification.id) 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - ids.length));
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Handle notification action (accept/reject join request)
  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(`/api/join-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        // Refresh notifications after action
        fetchNotifications();
      }
    } catch (error) {
      console.error(`Error ${status === 'APPROVED' ? 'approving' : 'rejecting'} request:`, error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      const unreadIds = notifications
        .filter(notification => !notification.isRead)
        .map(notification => notification.id);
      
      if (unreadIds.length > 0) {
        markAsRead(unreadIds);
      }
    }
  }, [isOpen, notifications]);
  
  // Set up polling for real-time notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        fetchNotifications();
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'JOIN_REQUEST':
        return <User className="w-5 h-5 text-indigo-500" />;
      case 'REQUEST_APPROVED':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'REQUEST_REJECTED':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        !notification.isRead ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>

                          {/* Action buttons for join requests */}
                          {notification.type === 'JOIN_REQUEST' && notification.request && (
                            <div className="mt-3 flex flex-col space-y-2">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRequestAction(notification.requestId, 'APPROVED')}
                                  className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-md hover:bg-green-600"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRequestAction(notification.requestId, 'REJECTED')}
                                  className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </div>
                              {notification.request?.userId && (
                                <Link 
                                  href={`/profile/${notification.request.userId}`}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                  View User Profile
                                </Link>
                              )}
                            </div>
                          )}

                          {/* View event link */}
                          {notification.eventId && (
                            <Link 
                              href={`/events/${notification.eventId}`}
                              className="mt-2 inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              View Event
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={fetchNotifications}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Refresh
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}