// components/home/HomePage.tsx
'use client';
import { motion } from 'framer-motion';
import Hero from '@/components/chatbothero/hero';
import { FeatureCard } from '@/components/home/FeatureCard';
import { StatCard } from '@/components/home/StatsCard';
import { CTASection } from './CTASection';
import { features } from '@/data/home/features';
import { stats } from '@/data/home/stats';
import { Feature, StatItem } from '@/types/home.types';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
        <motion.div
          animate={{ 
            background: [
              "radial-gradient(circle at 0% 0%, #0066FF10 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #0066FF10 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, #0066FF10 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <Hero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-20"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Experience the Future of Learning
              </h2>
              <p className="text-slate-400 text-lg">
                Powered by advanced AI to deliver personalized academic support
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature: Feature, index: number) => (
                <FeatureCard 
                  key={index}
                  icon={<feature.icon />}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </motion.section>

          {/* Call to Action Section */}
          <CTASection />

          {/* Stats Section */}
          <section className="py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat: StatItem, index: number) => (
                <StatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  index={index}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
