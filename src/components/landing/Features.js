'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Star } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Discover Events",
      description: "Find concerts, festivals, movies, standup shows, and more happening in your city",
      color: "from-blue-500 to-cyan-500",
      badge: "Popular",
      delay: 0.1
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join Groups",
      description: "Connect with like-minded people who share your interests and want to attend the same events",
      color: "from-green-500 to-emerald-500",
      badge: "Social",
      delay: 0.2
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Build Reputation",
      description: "Rate and get rated by others to build trust and find the best event companions",
      color: "from-purple-500 to-pink-500",
      badge: "Trust",
      delay: 0.3
    }
  ];

  return (
    <section id="features" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GoTogether</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make it easy to find your tribe and explore the world together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {feature.badge}
                </span>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;