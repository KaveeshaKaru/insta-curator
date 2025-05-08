"use client"

import { motion, useAnimation } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SocialCard from '@/components/SocialCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
}

const Typewriter = ({ text, delay = 0 }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isDeleting) {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, 50); // Faster deletion speed
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentIndex(0);
      }
    } else if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      // Wait for 2 seconds before starting to delete
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, displayText, isDeleting]);

  return (
    <motion.p 
      className="mt-3 text-sm text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {displayText}
      <span className="animate-pulse">|</span>
    </motion.p>
  );
};

export default function LandingPage() {
  const router = useRouter();
  
  const handleSignupClick = () => {
    router.push('/auth/login');
  };

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
      <div id="hero" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Left Column - Text */}
            <div className="relative lg:sticky lg:top-8 flex flex-col justify-center h-full">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent"
              >
                The easiest way to add a social feed to your site for free
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600"
              >
                Curator is a free forever social media aggregator that helps you collect and display content. Set up your feed in under 5 minutes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 sm:mt-8"
              >
                <button 
                  onClick={handleSignupClick}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                >
                  Sign up, it{"'"}s Free Forever
                </button>
                <Typewriter text="No credit card required." delay={0.5} />
              </motion.div>
            </div>

            {/* Right Column - Floating Cards */}
            <div className="mt-8 sm:mt-12 lg:mt-0 relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 relative">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 relative mx-auto max-w-full sm:max-w-[75%]">
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
      
      {/* Features Section */}
      <div id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">Why choose Insta-Curator?</h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
              Powerful features designed to help you showcase your social content beautifully
            </p>
          </motion.div>

          <div className="mt-10 sm:mt-20 grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
                title: "Connect Any Social Network",
                description: "Seamlessly connect Instagram, Twitter, Facebook, YouTube, TikTok, and more to build a diverse social wall.",
                delay: 0.2
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Setup in Minutes",
                description: "Quick and easy setup with no coding required. Get your social feed up and running in under 5 minutes.",
                delay: 0.4
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
                title: "Smart Content Curation",
                description: "Advanced filtering options let you showcase only the content that matches your brand's voice and values.",
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Wrangling Section */}
      <div id="content" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left side - Text content */}
            <div className="w-full lg:w-[480px] flex-none">
              <h2 className="text-2xl sm:text-4xl md:text-[56px] leading-tight font-extrabold mb-4 sm:mb-8 font-funnel bg-gradient-to-r from-[#62cff4] to-[#2c67f2] bg-clip-text text-transparent">
                Wrangle the best content, created by you or your customers
              </h2>
              <button 
                onClick={handleSignupClick}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#62cff4] to-[#2c67f2] text-white rounded-full text-base font-medium"
              >
                Sign up !!!!
              </button>
              <Typewriter text="Curator is a free forever social media aggregator." delay={0.5} />
            </div>

            {/* Right side - Cards */}
            <div className="flex-1 overflow-x-auto">
              <motion.div 
                className="flex space-x-4 sm:space-x-6 min-w-[700px] sm:min-w-0"
                animate={{
                  x: [0, -1120], // 4 cards × 280px width
                }}
                transition={{
                  x: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                {/* First set of cards */}
                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/surfer.jpg" alt="Surfers on beach" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 12C17 13.0609 16.5786 14.0783 15.8284 14.8284C15.0783 15.5786 14.0609 16 13 16C11.9391 16 10.9217 15.5786 10.1716 14.8284C9.42143 14.0783 9 13.0609 9 12C9 10.9391 9.42143 9.92172 10.1716 9.17157C10.9217 8.42143 11.9391 8 13 8C14.0609 8 15.0783 8.42143 15.8284 9.17157C16.5786 9.92172 17 10.9391 17 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Starting the day right</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>1 DAY AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/barman.jpg" alt="Barista at work" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Fueling up</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>3 DAYS AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/coconuttrees.jpg" alt="Palm trees" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 12C17 13.0609 16.5786 14.0783 15.8284 14.8284C15.0783 15.5786 14.0609 16 13 16C11.9391 16 10.9217 15.5786 10.1716 14.8284C9.42143 14.0783 9 13.0609 9 12C9 10.9391 9.42143 9.92172 10.1716 9.17157C10.9217 8.42143 11.9391 8 13 8C14.0609 8 15.0783 8.42143 15.8284 9.17157C16.5786 9.92172 17 10.9391 17 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Island life</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>3 WEEKS AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/waves.jpg" alt="Ocean waves" className="w-full h-full object-cover object-center" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 12C17 13.0609 16.5786 14.0783 15.8284 14.8284C15.0783 15.5786 14.0609 16 13 16C11.9391 16 10.9217 15.5786 10.1716 14.8284C9.42143 14.0783 9 13.0609 9 12C9 10.9391 9.42143 9.92172 10.1716 9.17157C10.9217 8.42143 11.9391 8 13 8C14.0609 8 15.0783 8.42143 15.8284 9.17157C16.5786 9.92172 17 10.9391 17 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Beautiful waves</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>1 MONTH AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicate set of cards for seamless loop */}
                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/surfer.jpg" alt="Surfers on beach" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 12C17 13.0609 16.5786 14.0783 15.8284 14.8284C15.0783 15.5786 14.0609 16 13 16C11.9391 16 10.9217 15.5786 10.1716 14.8284C9.42143 14.0783 9 13.0609 9 12C9 10.9391 9.42143 9.92172 10.1716 9.17157C10.9217 8.42143 11.9391 8 13 8C14.0609 8 15.0783 8.42143 15.8284 9.17157C16.5786 9.92172 17 10.9391 17 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Starting the day right</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>1 DAY AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/barman.jpg" alt="Barista at work" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Fueling up</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>3 DAYS AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/coconuttrees.jpg" alt="Palm trees" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 12C17 13.0609 16.5786 14.0783 15.8284 14.8284C15.0783 15.5786 14.0609 16 13 16C11.9391 16 10.9217 15.5786 10.1716 14.8284C9.42143 14.0783 9 13.0609 9 12C9 10.9391 9.42143 9.92172 10.1716 9.17157C10.9217 8.42143 11.9391 8 13 8C14.0609 8 15.0783 8.42143 15.8284 9.17157C16.5786 9.92172 17 10.9391 17 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Island life</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>3 WEEKS AGO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-none w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-w-4 aspect-h-4">
                      <img src="/images/waves.jpg" alt="Ocean waves" className="w-full h-full object-cover object-center" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 12C17 13.0609 16.5786 14.0783 15.8284 14.8284C15.0783 15.5786 14.0609 16 13 16C11.9391 16 10.9217 15.5786 10.1716 14.8284C9.42143 14.0783 9 13.0609 9 12C9 10.9391 9.42143 9.92172 10.1716 9.17157C10.9217 8.42143 11.9391 8 13 8C14.0609 8 15.0783 8.42143 15.8284 9.17157C16.5786 9.92172 17 10.9391 17 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-500 font-medium text-sm">Thomas Hill</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Beautiful waves</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">@TOMHILL</span>
                        <span>1 MONTH AGO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">What our customers say</h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-600">
              Join thousands of satisfied customers already using Insta-Curator
            </p>
          </motion.div>

          <div className="mt-10 sm:mt-20 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Director, TechCorp",
                quote: "Insta-Curator transformed how we showcase our community content. Setup was incredibly simple, and our engagement has increased by 40% since implementation.",
                delay: 0.2
              },
              {
                name: "Michael Rodriguez",
                role: "Social Media Manager, StyleBoutique",
                quote: "The customization options are fantastic. We were able to match our brand perfectly, and the moderation tools ensure our feed always looks professional.",
                delay: 0.4
              },
              {
                name: "Emily Chen",
                role: "Owner, Artisan Cafe",
                quote: "As a small business, we needed an affordable solution that didn't compromise on quality. Insta-Curator delivered exactly that, and we couldn't be happier.",
                delay: 0.6
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: testimonial.delay }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <svg className="h-8 w-8 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 italic">{testimonial.quote}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        id="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-2"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">Insta-Curator</h3>
              <p className="mt-4 text-gray-400">The easiest way to showcase your social media content beautifully. Connect, curate, and display your social feeds in minutes.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Documentation", "Support"].map((item, index) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((item, index) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 pt-8 border-t border-gray-800"
          >
            <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} Insta-Curator. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
} 