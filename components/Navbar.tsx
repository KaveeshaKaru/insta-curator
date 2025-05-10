"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignupClick = () => {
    router.push('/auth/login');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-50 border-b border-gray-100 bg-white rounded-b-2xl shadow-lg"
      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo/iCurator-logo.png" alt="iCurator Logo" width={140} height={40} priority />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { label: 'Home', target: 'hero' },
              { label: 'Features', target: 'features' },
              { label: 'Content', target: 'content' },
              { label: 'Testimonials', target: 'testimonials' },
              { label: 'Footer', target: 'footer' },
            ].map((item, idx) => (
              <motion.button
                key={item.target}
                whileHover={{ scale: 1.0, y: -1, color: '#0096FF', textShadow: '0px 2px 8px #0096FF' }}
                whileTap={{ scale: 0.95, color: '#0096FF' }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => {
                  const el = document.getElementById(item.target);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-500 font-bold tracking-wide focus:outline-none bg-transparent border-none text-base px-2 py-1"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
              aria-label="Open menu"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleSignupClick}
              className="px-4 py-2 bg-gradient-to-r from-[#62cff4] to-[#2c67f2] text-white font-bold rounded-md transition-transform transform-gpu hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="font-bold text-transparent bg-clip-text bg-white">
                Sign up, it's Free
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-gradient-to-r from-[#f12711] to-[#f5af19] rounded-b-2xl shadow-lg"
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          {[
            { label: 'Home', target: 'hero' },
            { label: 'Features', target: 'features' },
            { label: 'Content', target: 'content' },
            { label: 'Testimonials', target: 'testimonials' },
            { label: 'Footer', target: 'footer' },
          ].map((item, idx) => (
            <motion.button
              key={item.target}
              whileHover={{ scale: 1.08, color: '#ffe259', textShadow: '0px 2px 8px #ff7300' }}
              whileTap={{ scale: 0.95, color: '#ff7300' }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById(item.target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white font-bold tracking-wide focus:outline-none bg-transparent border-none text-lg px-2 py-2 w-full text-center"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              {item.label}
            </motion.button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleSignupClick();
            }}
            className="w-11/12 px-4 py-2 bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] font-bold rounded-md transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg border border-gray-200 mt-2"
          >
            Sign up, it's Free
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
} 