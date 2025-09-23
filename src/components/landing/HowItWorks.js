'use client';

import { motion } from 'framer-motion';
import { Search, UserPlus, Calendar, MapPin } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Find Events",
      description: "Discover exciting events happening in your city that match your interests",
      color: "from-blue-500 to-indigo-500",
      delay: 0.1
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Connect",
      description: "Join groups or create your own to find the perfect event companions",
      color: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Plan Together",
      description: "Coordinate details, chat with your group, and get ready for the event",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Enjoy",
      description: "Meet up, have fun, and create lasting memories with your new friends",
      color: "from-amber-500 to-orange-500",
      delay: 0.4
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GoTogether</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to amazing events and new friendships in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: step.delay }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-100 rounded-full opacity-50"></div>
              
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg mr-4`}>
                    {step.icon}
                  </div>
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-40 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
    </section>
  );
};

export default HowItWorks;