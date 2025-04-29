"use client"

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SocialCard from '@/components/SocialCard';

export default function LandingPage() {
  const socialCards = [
    {
      platform: 'instagram' as const,
      imageSrc: '/images/beach.jpg',
      username: 'Joan Helliwell',
      content: 'Paradise found! 🌊 Perfect waves and golden sunsets. #BeachLife #Surfing',
      delay: 0.2
    },
    {
      platform: 'twitter' as const,
      imageSrc: '/images/coconut.jpg',
      username: '@JOANH84',
      content: "Tropical vibes only 🌴 Nature's best view right here!",
      delay: 0.3
    },
    {
      platform: 'youtube' as const,
      imageSrc: '/images/village.jpg',
      username: 'Joan Helliwell',
      content: 'NEW VLOG: Exploring hidden gems in this charming village ✨ Watch now!',
      delay: 0.4
    },
    {
      platform: 'instagram' as const,
      imageSrc: '/images/woman.jpg',
      username: 'Joan Helliwell',
      content: 'Coffee breaks and creative thoughts ☕️ Making every moment count',
      delay: 0.5
    },
    {
      platform: 'twitter' as const,
      imageSrc: '/images/leopard.jpg',
      username: '@JOANH84',
      content: 'Incredible wildlife encounter! 🐆 Nature never ceases to amaze me',
      delay: 0.6
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[90rem] mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Left Column - Text */}
            <div className="relative lg:sticky lg:top-8 flex flex-col justify-center h-full">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                The easiest way to add a social feed to your site for free
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-lg text-gray-600"
              >
                Curator is a free forever social media aggregator that helps you collect and display content. Set up your feed in under 5 minutes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8"
              >
                <button className="bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800">
                  Sign up, it{"'"}s Free Forever
                </button>
                <p className="mt-4 text-sm text-gray-500">No credit card required.</p>
              </motion.div>
            </div>

            {/* Right Column - Floating Cards */}
            <div className="mt-12 lg:mt-0 relative">
              <div className="grid grid-cols-3 gap-6 relative">
                {socialCards.slice(0, 3).map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: card.delay }}
                    className="transform hover:-translate-y-2 transition-transform duration-300"
                  >
                    <SocialCard {...card} />
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6 relative mx-auto max-w-[75%]">
                {socialCards.slice(3).map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: card.delay }}
                    className="transform hover:-translate-y-2 transition-transform duration-300"
                  >
                    <SocialCard {...card} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 