'use client';

import { useEffect } from 'react';
import BlurText from "../ui/BlurText";

export default function LandingIntro() {

  return (
    // The main container with the animated gradient background
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 bg-[length:200%_200%] animate-gradient-xy p-4">
      <BlurText
        text="Welcome To GoTogether!"
        delay={40} 
        animateBy="letters" // Animating by 'letters' looks great for a single word
        className="font-display text-5xl font-bold tracking-wider text-white md:text-7xl"
      />
    </div>
  );
}