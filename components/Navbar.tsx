"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Instagram } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const handleSignupClick = () => {
    router.push('/auth/login');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-white z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Instagram className="h-6 w-6 text-gray-900" />
            <span className="text-xl font-semibold text-gray-900">
              Insta-Curator
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-900 hover:text-gray-600">FEATURES</Link>
            <Link href="#templates" className="text-gray-900 hover:text-gray-600">TEMPLATES</Link>
            <Link href="#pricing" className="text-gray-900 hover:text-gray-600">PRICING</Link>
            <Link href="#events" className="text-gray-900 hover:text-gray-600">EVENTS</Link>
            <Link href="#docs" className="text-gray-900 hover:text-gray-600">DOCS</Link>
            <Link href="#blog" className="text-gray-900 hover:text-gray-600">BLOG</Link>
            <Link href="#contact" className="text-gray-900 hover:text-gray-600">CONTACT</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSignupClick}
              className="px-4 py-2 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-bold rounded-md transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
            >
              Sign up, it's Free
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 