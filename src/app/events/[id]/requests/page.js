'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, User, Clock, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function EventRequestsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToast } = useToast();
  const [event, setEvent] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event details and requests
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session) {
      fetchEventAndRequests();
    }
  }, [session, id, status, router]);

  const fetchEventAndRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResponse = await fetch(`/api/events/${id}`);
      if (!eventResponse.ok) {
        throw new Error('Failed to fetch event details');
      }
      const eventData = await eventResponse.json();
      setEvent(eventData.event);
      
      // Check if user is the event creator
      if (eventData.event.creatorId !== session.user.id) {
        router.push(`/events/${id}`);
        return;
      }
      
      // Fetch join requests
      const requestsResponse = await fetch(`/api/events/${id}/requests`);
      if (!requestsResponse.ok) {
        throw new Error('Failed to fetch join requests');
      }
      const requestsData = await requestsResponse.json();
      setRequests(requestsData.requests || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/join-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      
      if (response.ok) {
        // Update the local state
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'APPROVED' } : req
          )
        );
        addToast('Request accepted successfully!', 'success');
      } else {
        addToast('Failed to accept request. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      addToast('An error occurred while accepting the request.', 'error');
    }
  };
  
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/join-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      
      if (response.ok) {
        // Update the local state
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'REJECTED' } : req
          )
        );
        addToast('Request rejected successfully!', 'success');
      } else {
        addToast('Failed to reject request. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      addToast('An error occurred while rejecting the request.', 'error');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const pendingRequests = requests.filter(req => req.status === 'PENDING');
  const approvedRequests = requests.filter(req => req.status === 'APPROVED');
  const rejectedRequests = requests.filter(req => req.status === 'REJECTED');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{event.title} - Join Requests</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Manage who can join your event</p>
        
        {/* Pending Requests Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Requests</h2>
          
          {pendingRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No pending requests at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingRequests.map(request => (
                <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">{request.user?.name || 'Unknown User'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      {request.message && (
                        <p className="mt-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                          &ldquo;{request.message}&rdquo;
                        </p>
                      )}
                      <div className="mt-3">
                        <Link 
                          href={`/profile/${request.userId}`}
                          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Approved Requests Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Approved Requests</h2>
          
          {approvedRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No approved requests yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {approvedRequests.map(request => (
                <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">{request.user?.name || 'Unknown User'}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Approved on {new Date(request.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <Link 
                          href={`/profile/${request.userId}`}
                          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                    <div className="text-green-600 dark:text-green-400 font-medium flex items-center">
                      <Check className="h-5 w-5 mr-1" />
                      Approved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Rejected Requests Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rejected Requests</h2>
          
          {rejectedRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No rejected requests.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {rejectedRequests.map(request => (
                <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">{request.user?.name || 'Unknown User'}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Rejected on {new Date(request.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-red-600 dark:text-red-400 font-medium flex items-center">
                      <X className="h-5 w-5 mr-1" />
                      Rejected
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}