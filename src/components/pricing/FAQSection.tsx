// components/pricing/FAQSection.tsx
'use client';
import { faqItems } from '@/data/pricing/faq';
import { motion } from 'framer-motion';

export const FAQSection: React.FC = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div className="space-y-8">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            className="border-b border-slate-800/50 pb-8 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-white mb-3">{item.q}</h3>
            <p className="text-slate-400">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};