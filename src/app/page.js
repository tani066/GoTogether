'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import LandingIntro from '@/components/landing/LandingIntro';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/onboarding');
    }
  }, [status, router]);

  useEffect(() => {
    // Show intro for 5 seconds, then transition to landing page
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {showIntro ? (
        <LandingIntro />
      ) : (
        <LandingPage />
      )}
    </>
  );
}