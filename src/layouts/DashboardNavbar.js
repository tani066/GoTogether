'use client';

import Link from "next/link";
import { Sparkles, Calendar, Users, Settings, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GoTogether
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-indigo-600 font-medium flex items-center space-x-1">
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/events" className="text-gray-500 hover:text-indigo-600 font-medium flex items-center space-x-1">
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link href="/groups" className="text-gray-500 hover:text-indigo-600 font-medium flex items-center space-x-1">
              <Users className="h-5 w-5" />
              <span>Groups</span>
            </Link>
            <Link href="/dashboard/profile" className="text-gray-500 hover:text-indigo-600 font-medium flex items-center space-x-1">
              <Users className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </button>
            {/* Profile photo */}
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-5 w-5 text-indigo-600" />
              )}
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}