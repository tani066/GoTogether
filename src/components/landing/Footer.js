'use client';

import { Sparkles, Twitter, Instagram, Facebook, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-[20vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
               <div>
      <Image src="/logo.png" alt="My Logo" width={30} height={30} />
    </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GoTogether
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              Find your event squad and create unforgettable memories together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Events Guide</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} GoTogether. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;