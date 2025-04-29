"use client"

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SocialCard from '@/components/SocialCard';
import { useRouter } from 'next/navigation';

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
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[90rem] mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Left Column - Text */}
            <div className="relative lg:sticky lg:top-8 flex flex-col justify-center h-full">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent sm:text-6xl"
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
                <button 
                  onClick={handleSignupClick}
                  className="px-8 py-4 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                >
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
      
      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">Why choose Insta-Curator?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed to help you showcase your social content beautifully
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">What our customers say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Join thousands of satisfied customers already using Insta-Curator
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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