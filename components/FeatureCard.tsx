"use client"

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        ease: [0.21, 1.11, 0.81, 0.99], // Custom ease curve for floating effect
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative p-5 rounded-lg hover:bg-gray-50"
    >
      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
        {icon}
      </div>
      <div className="ml-16">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
} 