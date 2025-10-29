'use client';

import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  LayoutDashboard, // Use specific icons for better context
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname for active state
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";

// Helper component for navigation links
const NavLink = ({ href, children, isActive }) => (
  <Link
    href={href}
    className={`
      flex items-center space-x-2 px-3 py-2 rounded-lg 
      font-semibold text-sm transition-all duration-200 ease-in-out
      ${isActive
        ? 'text-indigo-600 dark:text-teal-400 bg-indigo-50 dark:bg-gray-700/50' // Active state: Strong color, subtle background
        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700' // Hover state: Subtle lift
      }
    `}
  >
    {children}
  </Link>
);


export default function DashboardNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Get current path for active links

  const handleLogout = async () => {
    // Show a quick visual feedback before redirecting
    // You could integrate a toast notification here
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    // 1. High Contrast Background, Sticky, Z-index High
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- Brand / Logo --- */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              {/* Refined Icon: Vibrant, use Teal as the secondary brand color */}
               <div>
            <Image src="/logo.png" alt="My Logo" width={30} height={30} />
            </div>
              {/* Text: Bold, high-contrast gradient */}
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
                GoTogether
              </span>
            </Link>
          </div>
          
          {/* --- Main Navigation Links (Centered) --- */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/dashboard" isActive={pathname === '/dashboard'}>
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink href="/events" isActive={pathname.startsWith('/events') && pathname !== '/groups'}>
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </NavLink>
            <NavLink href="/groups" isActive={pathname.startsWith('/groups')}>
              <Users className="h-5 w-5" />
              <span>Groups</span>
            </NavLink>
          </div>
          
          {/* --- User Actions / Secondary Icons --- */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* 1. Notifications Dropdown */}
            <NotificationsDropdown />
            
            {/* 2. Settings Button */}
            <button 
              className="
                p-2 text-gray-500 dark:text-gray-400 rounded-full 
                hover:text-indigo-600 dark:hover:text-teal-400 
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* 3. Profile Link/Avatar (Wrapped in Link for better UX) */}
            <Link 
              href="/dashboard/profile"
              className="
                relative h-9 w-9 rounded-full ring-2 ring-transparent 
                hover:ring-indigo-500 dark:hover:ring-teal-500 transition-all duration-300
                flex items-center justify-center overflow-hidden
              "
              title={session?.user?.name || 'Profile'}
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="h-9 w-9 bg-indigo-50 dark:bg-gray-700 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-indigo-600 dark:text-teal-400" />
                </div>
              )}
            </Link>
            
            {/* 4. Logout button (High contrast hover color: Red) */}
            <button
              onClick={handleLogout}
              className="
                p-2 text-gray-500 dark:text-gray-400 rounded-full 
                hover:text-red-600 dark:hover:text-red-500 
                hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-red-500
              "
              title="Logout"
            >
              <LogOut className="w-5 h-5 transform transition-transform hover:-translate-y-0.5" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}