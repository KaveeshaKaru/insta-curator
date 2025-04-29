"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
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
          <Link href="/" className="flex items-center">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
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
            <Link href="/auth/login" className="text-gray-900 hover:text-gray-600">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Sign up, it's Free
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 