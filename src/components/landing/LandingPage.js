'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import EventCategories from './EventCategories';
import Testimonials from './Testimonials';
import Stats from './Stats';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import Footer from './Footer';
import AuthModal from '../AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onAuthModalOpen={handleAuthModalOpen} />
      <Hero onAuthModalOpen={handleAuthModalOpen} />
      <Features />
      <EventCategories />
      <Testimonials />
      <Stats />
      <HowItWorks />
      <CTA onAuthModalOpen={handleAuthModalOpen} />
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
    </div>
  );
};

export default LandingPage;