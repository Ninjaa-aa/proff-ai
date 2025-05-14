// components/pricing/PricingPage.tsx
'use client';
import { motion } from 'framer-motion';
import { pricingPlans } from '@/data/pricing/plans';
import { PricingCard } from '@/components/pricing/PricingCard';
import { FAQSection } from './FAQSection';
import { PricingPlan } from '@/types/price.types';

export const PricingPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[128px] animate-pulse delay-1000" />
        
        {/* Moving Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-[float_15s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
          <div className="absolute right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-[float_15s_ease-in-out_infinite]" style={{ animationDelay: '-7.5s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-30 animate-pulse" />
              <h1 className="relative text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-size-200 animate-[gradientFlow_3s_ease-in-out_infinite]">
                Choose Your Learning Journey
              </h1>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-slate-400 text-lg mb-8"
            >
              Select the plan that best fits your needs. Upgrade or downgrade at any time.
            </motion.p>
          </motion.div>
        </section>

        {/* Pricing Cards Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan: PricingPlan, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <PricingCard plan={plan} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />
      </div>
    </div>
  );
};
