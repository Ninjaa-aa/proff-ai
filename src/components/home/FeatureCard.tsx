// components/home/FeatureCard.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

export const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent hover:from-blue-500/30 transition-all duration-300"
  >
    <div className="relative bg-black rounded-[23px] p-8 h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black opacity-90 group-hover:opacity-80 transition-opacity duration-300"></div>
      <div className="relative">
        <motion.div 
          className="mb-6 text-blue-500"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);
