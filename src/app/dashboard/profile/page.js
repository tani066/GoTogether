"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  MapPin,
  Heart,
  FileText,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    age: "",
    location: "",
    interests: "",
    bio: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
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
      const response = await fetch("../../api/users/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUserData(userData);

      // Initialize form with user data
      setForm({
        name: userData.name || "",
        username: userData.username || "",
        age: userData.age || "",
        location: userData.location || "",
        interests: userData.interests ? userData.interests.join(", ") : "",
        bio: userData.bio || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
        interests: form.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedForm),
      });

      // Handle different response scenarios
      if (!response.ok) {
        // For non-200 responses, handle without trying to parse JSON
        setError("Failed to update profile. Please try again.");
        return;
      }

      try {
        const responseData = await response.json();
        setUserData(responseData);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } catch (jsonError) {
        setError("Error processing server response. Please try again.");
      }

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || (loading && !userData)) {
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
      {/* Profile Content Only - Navbar is now in dashboard/layout.js */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={userData.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-violet-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {userData?.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-300">@{userData?.username}</p>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{userData?.location}</span>
              </div>
            </div>
          </div>

          {/* Profile Details & Edit Form */}
          {!isEditing ? (
            <div>
              <div className="mb-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">Age:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{userData?.age}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">Interests:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {userData?.interests?.join(", ")}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">Bio:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{userData?.bio}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-600 focus:ring focus:ring-violet-600 focus:ring-opacity-50 dark:bg-[#334155] dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-600 focus:ring focus:ring-violet-600 focus:ring-opacity-50 dark:bg-[#334155] dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-600 focus:ring focus:ring-violet-600 focus:ring-opacity-50 dark:bg-[#334155] dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-600 focus:ring focus:ring-violet-600 focus:ring-opacity-50 dark:bg-[#334155] dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interests</label>
                <input
                  type="text"
                  name="interests"
                  value={form.interests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-600 focus:ring focus:ring-violet-600 focus:ring-opacity-50 dark:bg-[#334155] dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-600 focus:ring focus:ring-violet-600 focus:ring-opacity-50 dark:bg-[#334155] dark:text-white"
                  rows={3}
                  required
                ></textarea>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
