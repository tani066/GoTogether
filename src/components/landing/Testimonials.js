'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "GoTogether helped me find amazing concert buddies when I moved to a new city. Now I never have to miss my favorite bands!",
      author: "Alex Johnson",
      role: "Music Enthusiast",
      avatar: "https://lh3.googleusercontent.com/a-/AOh14GgLaIMbQcm-MptJIZxO1wl9NRCYQi-RJHGcwN8P=s96-c",
      stars: 5,
      delay: 0.1
    },
    {
      quote: "As an introvert, I was always hesitant to go to events alone. This platform connected me with like-minded people who made me feel comfortable.",
      author: "Sarah Chen",
      role: "Film Buff",
      avatar: "https://lh3.googleusercontent.com/a-/AOh14GhqYCtgODjBQZ2Hd9JGjpYt7-vyTMF5Aq8XzDGY=s96-c",
      stars: 5,
      delay: 0.2
    },
    {
      quote: "The rating system ensures you meet reliable people. I've made genuine friendships through events we attended together!",
      author: "Michael Rodriguez",
      role: "Festival Goer",
      avatar: "https://lh3.googleusercontent.com/a-/AOh14GjDBk8Ym2RZ6Qvy9CwkjGKq9SR5UvYlGgEaJ6Yb=s96-c",
      stars: 4,
      delay: 0.3
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy users creating memories together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: testimonial.delay }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
                {[...Array(5 - testimonial.stars)].map((_, i) => (
                  <Star key={i + testimonial.stars} className="w-5 h-5 text-gray-300 fill-gray-300" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;