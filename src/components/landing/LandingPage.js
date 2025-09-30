'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import AuthModal from '../AuthModal';
import Features from './Features';
import EventCategories from './EventCategories';
import Footer from './Footer';

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
      <Features/>
      <HowItWorks />
      
      <EventCategories/>
       <Footer/>
      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
     
    </div>
  );
};

export default LandingPage;