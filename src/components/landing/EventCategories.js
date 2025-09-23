'use client';

import { motion } from 'framer-motion';
import { Music, Film, Utensils, Ticket, Mic, Palette } from 'lucide-react';

const EventCategories = () => {
  const categories = [
    {
      icon: <Music className="w-8 h-8" />,
      name: "Concerts",
      color: "from-pink-500 to-rose-500",
      emoji: "🎵",
      delay: 0.1
    },
    {
      icon: <Film className="w-8 h-8" />,
      name: "Movies",
      color: "from-blue-500 to-indigo-500",
      emoji: "🎬",
      delay: 0.2
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      name: "Food & Drinks",
      color: "from-amber-500 to-orange-500",
      emoji: "🍔",
      delay: 0.3
    },
    {
      icon: <Ticket className="w-8 h-8" />,
      name: "Festivals",
      color: "from-green-500 to-emerald-500",
      emoji: "🎪",
      delay: 0.4
    },
    {
      icon: <Mic className="w-8 h-8" />,
      name: "Stand-up",
      color: "from-purple-500 to-violet-500",
      emoji: "🎭",
      delay: 0.5
    },
    {
      icon: <Palette className="w-8 h-8" />,
      name: "Art & Culture",
      color: "from-cyan-500 to-teal-500",
      emoji: "🎨",
      delay: 0.6
    }
  ];

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Event Categories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect events that match your interests
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: category.delay }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group cursor-pointer"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{category.name}</h3>
              <div className="text-2xl text-center">{category.emoji}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;