'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Heart, Star } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "10,000+",
      label: "Active Users",
      color: "from-blue-500 to-indigo-500",
      delay: 0.1
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: "5,000+",
      label: "Events Discovered",
      color: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      icon: <Heart className="w-8 h-8" />,
      value: "15,000+",
      label: "Friendships Made",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.8/5",
      label: "Average Rating",
      color: "from-amber-500 to-orange-500",
      delay: 0.4
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: stat.delay }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center relative overflow-hidden group"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4`}>
                {stat.icon}
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;