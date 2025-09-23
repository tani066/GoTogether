'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Home, 
  Users, 
  Calendar as CalendarIcon, 
  Settings, 
  Sparkles,
  User,
  MapPin,
  Heart,
  FileText
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    name: '',
    username: '',
    age: '',
    location: '',
    interests: '',
    bio: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('../../api/users/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUserData(userData);
      
      // Initialize form with user data
      setForm({
        name: userData.name || '',
        username: userData.username || '',
        age: userData.age || '',
        location: userData.location || '',
        interests: userData.interests ? userData.interests.join(', ') : '',
        bio: userData.bio || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Process interests from comma-separated string to array
      const processedForm = {
        ...form,
        interests: form.interests.split(',').map(item => item.trim()).filter(Boolean)
      };
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedForm),
      });
      
      // Handle different response scenarios
      if (!response.ok) {
        // For non-200 responses, handle without trying to parse JSON
        setError('Failed to update profile. Please try again.');
        return;
      }
      
      try {
        const responseData = await response.json();
        setUserData(responseData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } catch (jsonError) {
        setError('Error processing server response. Please try again.');
      }
      
      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-600"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1e293b] border-b border-[#e2e8f0] dark:border-[#334155] sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  GoTogether
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-[#64748b] hover:text-violet-600 font-medium flex items-center space-x-1 relative">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/events" className="text-[#64748b] hover:text-violet-600 font-medium flex items-center space-x-1 relative">
                <CalendarIcon className="h-5 w-5" />
                <span>Events</span>
              </Link>
              <Link href="/groups" className="text-[#64748b] hover:text-violet-600 font-medium flex items-center space-x-1 relative">
                <Users className="h-5 w-5" />
                <span>Groups</span>
              </Link>
              <Link href="/dashboard/profile" className="text-violet-600 font-medium flex items-center space-x-1 relative">
                <User className="h-5 w-5" />
                <span>Profile</span>
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-600"
                ></motion.div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#64748b] hover:text-violet-600 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-800"
                />
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center ring-2 ring-violet-200 dark:ring-violet-800"
                >
                  <User size={16} className="text-violet-600 dark:text-violet-300" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Back button */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto px-4 py-4"
      >
        <motion.button 
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.back()}
          className="flex items-center text-[#64748b] hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </motion.button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 py-4 max-w-4xl"
      >
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg overflow-hidden"
        >
          {/* Profile header */}
          <div className="h-48 bg-gradient-to-r from-violet-500 to-fuchsia-500 relative">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute -bottom-16 left-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-32 w-32 rounded-full border-4 border-white dark:border-[#1e293b] bg-[#f1f5f9] flex items-center justify-center overflow-hidden shadow-lg"
              >
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-violet-300" />
                )}
              </motion.div>
            </motion.div>
          
            {/* Edit/Save button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute top-4 right-4"
            >
              {isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Save Changes
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-violet-600 border border-violet-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Edit Profile
                </motion.button>
              )}
            </motion.div>
          </div>
        
          {/* Profile content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-20 px-8 pb-8"
          >
            {success && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500 rounded-md shadow-sm"
              >
                {success}
              </motion.div>
            )}
            
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 bg-rose-50 text-rose-700 border-l-4 border-rose-500 rounded-md shadow-sm"
              >
                {error}
              </motion.div>
            )}
            
            {isEditing ? (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#e2e8f0] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] dark:border-[#475569] rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-[#1e293b] dark:text-white shadow-sm transition-all duration-200"
                    />
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#e2e8f0] mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] dark:border-[#475569] rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-[#1e293b] dark:text-white shadow-sm transition-all duration-200"
                    />
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#e2e8f0] mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] dark:border-[#475569] rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-[#1e293b] dark:text-white shadow-sm transition-all duration-200"
                    />
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#e2e8f0] mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] dark:border-[#475569] rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-[#1e293b] dark:text-white shadow-sm transition-all duration-200"
                    />
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -2 }} 
                    transition={{ type: "spring", stiffness: 500 }}
                    className="md:col-span-2"
                  >
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#e2e8f0] mb-1">
                      Interests (comma separated)
                    </label>
                    <input
                      type="text"
                      name="interests"
                      value={form.interests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] dark:border-[#475569] rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-[#1e293b] dark:text-white shadow-sm transition-all duration-200"
                      placeholder="e.g. hiking, music, photography"
                    />
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -2 }} 
                    transition={{ type: "spring", stiffness: 500 }}
                    className="md:col-span-2"
                  >
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#e2e8f0] mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-[#e2e8f0] dark:border-[#475569] rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-[#1e293b] dark:text-white shadow-sm transition-all duration-200"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </motion.div>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">
                    {userData?.name || 'Your Name'}
                  </h1>
                  <p className="text-[#64748b] dark:text-[#94a3b8]">
                    @{userData?.username || 'username'}
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {userData?.age && (
                    <motion.div 
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2 text-[#475569] dark:text-[#cbd5e1]"
                    >
                      <User size={18} className="text-violet-500" />
                      <span>{userData.age} years old</span>
                    </motion.div>
                  )}
                  
                  {userData?.location && (
                    <motion.div 
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2 text-[#475569] dark:text-[#cbd5e1]"
                    >
                      <MapPin size={18} className="text-violet-500" />
                      <span>{userData.location}</span>
                    </motion.div>
                  )}
                </motion.div>
                
                {userData?.interests && userData.interests.length > 0 && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-2 text-[#334155] dark:text-[#e2e8f0] font-medium">
                      <Heart size={18} className="text-violet-500" />
                      <span>Interests</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userData.interests.length > 0 ? (
                        userData.interests.map((interest, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-sm"
                          >
                            {interest}
                          </motion.span>
                        ))
                      ) : (
                        <span className="text-[#64748b] dark:text-[#94a3b8]">No interests added yet</span>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {userData?.bio && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-2 text-[#334155] dark:text-[#e2e8f0] font-medium">
                      <FileText size={18} className="text-violet-500" />
                      <span>About</span>
                    </div>
                    <p className="text-[#475569] dark:text-[#cbd5e1] whitespace-pre-line">
                      {userData.bio}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
