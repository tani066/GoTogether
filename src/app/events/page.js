'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Filter, Plus, Calendar, MapPin, Tag, Euro, Users, Globe, Image, X, Loader2 } from 'lucide-react';

// Common input styles for re-use
const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white transition-colors p-2.5 text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

// Simplified Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
  </div>
);

// Event Categories for dropdowns
const eventCategories = [
    { value: 'outdoor', label: 'Outdoor Adventures' },
    { value: 'technology', label: 'Tech & Innovation' },
    { value: 'community', label: 'Community Meetups' },
    { value: 'fitness', label: 'Fitness & Wellness' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'music', label: 'Music & Concerts' },
];

export default function EventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- FILTER STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // --- MODAL STATE AND HANDLERS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '', location: '', category: '', 
    price: '', capacity: '', imageUrl: '', externalUrl: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError('');
    setFormData({
      title: '', description: '', date: '', time: '', location: '', category: '', price: '', capacity: '', imageUrl: '', externalUrl: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- API CALLS ---
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            // Convert capacity to number if it's not empty, otherwise null
            capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormError(errorData.error || 'Failed to create event. Check your inputs.');
        return;
      }
      
      handleCloseModal();
      await fetchEvents();
    } catch (err) {
      console.error("Event creation error:", err);
      setFormError('An internal error occurred while creating the event.');
    } finally {
      setFormLoading(false);
    }
  };
  // -----------------------------------------------------------

  // --- EFFECTS ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchEvents();
    }
  }, [session]);

  // --- COMPUTED STATE (Filtering logic) ---
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // --- RENDER GUARD CLAUSES ---
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================= HEADER & CTA ======================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Discover Events</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Find exciting events and connect with like-minded people.</p>
          </div>
          <button 
            onClick={handleOpenModal} 
            className="mt-6 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 shadow-lg transition-all flex items-center space-x-2 font-semibold ring-4 ring-indigo-300/50 dark:ring-indigo-700/30"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* ======================= FILTER & SEARCH SECTION ======================= */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 mb-10 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-12 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${inputClasses}`}
                placeholder="Search by title or description..."
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative md:w-56">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`block w-full pl-12 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white appearance-none ${inputClasses}`}
                >
                    <option value="">All Categories</option>
                    {eventCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
                {/* Custom arrow for select */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
          </div>
        </div>

        {/* ======================= ERROR MESSAGE ======================= */}
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl mb-8 font-medium">
              <p className="flex items-center">
                <X className="h-5 w-5 mr-3" />
                {error}
              </p>
            </div>
          )}

        {/* ======================= EVENT LIST / EMPTY STATE ======================= */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse h-80 border border-gray-100 dark:border-gray-700">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
              <Calendar className="mx-auto h-12 w-12 text-indigo-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No events match your criteria</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search term or category filter, or be the first to create one!
              </p>
              <div className="mt-6">
                <button onClick={handleOpenModal} className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 shadow-md transition-all flex items-center space-x-2 mx-auto font-semibold">
                  <Plus className="h-5 w-5" />
                  <span>Create New Event</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 cursor-pointer">
                      
                      {/* Image/Placeholder */}
                      <div className="relative">
                          {event.imageUrl ? (
                              <img
                                  src={event.imageUrl}
                                  alt={event.title}
                                  className="w-full h-48 object-cover"
                              />
                          ) : (
                              <div className="w-full h-48 bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Calendar className='w-10 h-10 text-white opacity-60' />
                              </div>
                          )}
                          <div className="absolute top-0 right-0 m-3 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                              {event.category.toUpperCase()}
                          </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                            <Calendar className='w-4 h-4 mr-2 text-indigo-500' />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className='w-4 h-4 mr-2 text-red-500' />
                            {event.location}
                          </span>
                          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Euro className='w-4 h-4 mr-2 text-green-500' />
                            {event.price || 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>
                </Link>
              ))}
            </div>
          )}
        </main>

      {/* ======================= CREATE EVENT MODAL ======================= */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-8 text-left align-middle shadow-2xl transition-all">
                  <div className="flex justify-between items-start border-b pb-3 mb-5 dark:border-gray-700">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      Plan Your New Event
                    </Dialog.Title>
                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {formError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 font-medium" role="alert">
                      <span className="block">{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="title" className={labelClasses}>Title *</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleFormChange} className={inputClasses} placeholder="e.g. Hiking Trip to Blue Mountain" />
                      </div>
                      <div>
                        <label htmlFor="location" className={labelClasses}>Location *</label>
                        <input type="text" name="location" id="location" required value={formData.location} onChange={handleFormChange} className={inputClasses} placeholder="e.g. Central Park, New York (or Online)" />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className={labelClasses}>Description *</label>
                      <textarea name="description" id="description" rows="3" required value={formData.description} onChange={handleFormChange} className={inputClasses} placeholder="Tell your attendees what the event is about..."></textarea>
                    </div>

                    {/* Date, Time, Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="date" className={labelClasses}>Date *</label>
                        <input type="date" name="date" id="date" required value={formData.date} onChange={handleFormChange} className={inputClasses} />
                      </div>
                      <div>
                        <label htmlFor="time" className={labelClasses}>Time *</label>
                        <input type="time" name="time" id="time" required value={formData.time} onChange={handleFormChange} className={inputClasses} />
                      </div>
                      <div>
                        <label htmlFor="category" className={labelClasses}>Category *</label>
                        <select name="category" id="category" required value={formData.category} onChange={handleFormChange} className={inputClasses}>
                            <option value="" disabled>Select Category</option>
                            {eventCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Price, Capacity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className={labelClasses}>Price (e.g., 10.00 or Free)</label>
                            <div className="relative">
                                <Euro className='w-4 h-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'/>
                                <input type="text" name="price" id="price" value={formData.price} onChange={handleFormChange} className={`${inputClasses} pl-10`} placeholder="0.00 or Free" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="capacity" className={labelClasses}>Capacity (optional)</label>
                            <div className="relative">
                                <Users className='w-4 h-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'/>
                                <input type="number" name="capacity" id="capacity" min="1" value={formData.capacity} onChange={handleFormChange} className={`${inputClasses} pl-10`} placeholder="e.g., 50 attendees" />
                            </div>
                        </div>
                    </div>

                    {/* URLs */}
                    <div className="space-y-4">
                      <div>
                          <label htmlFor="imageUrl" className={labelClasses}>Image URL (optional)</label>
                          <div className="relative">
                              <Image className='w-4 h-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'/>
                              <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleFormChange} className={`${inputClasses} pl-10`} placeholder="https://example.com/event-banner.jpg" />
                          </div>
                      </div>
                      
                      <div>
                          <label htmlFor="externalUrl" className={labelClasses}>External RSVP Link (optional)</label>
                          <div className="relative">
                              <Globe className='w-4 h-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'/>
                              <input type="url" name="externalUrl" id="externalUrl" value={formData.externalUrl} onChange={handleFormChange} className={`${inputClasses} pl-10`} placeholder="https://external-rsvp-link.com" />
                          </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={handleCloseModal}
                        disabled={formLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {formLoading ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Creating...
                          </>
                        ) : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}