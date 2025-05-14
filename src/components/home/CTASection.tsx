import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Bot } from 'lucide-react'; // Replace 'some-icon-library' with the actual library name

export const CTASection = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="py-20"
  >
    <div className="relative rounded-[2.5rem] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl" />
      
      {/* Animated Glowing orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-blue-500/30 blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-purple-500/30 blur-3xl"
      />
      
      {/* Content */}
    <div className="relative p-12 md:p-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Academic Journey?</h2>
            <ul className="space-y-4 mb-8">
            {[
                "24/7 Intelligent Support",
                "Personalized Learning Experience",
                "Comprehensive Subject Coverage"
            ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-slate-300">{item}</span>
                </li>
            ))}
            </ul>
            <div className="flex flex-wrap gap-4">
            <Link href="/chatbot">
                <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-2xl flex items-center gap-2 font-medium transition-all">
                Start Learning
                <ArrowRight className="w-5 h-5" />
                </button>
            </Link>
            <Link href="/pricing">
                <button className="px-8 py-4 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white rounded-2xl transition-all">
                View Plans
                </button>
            </Link>
            </div>
        </div>
        <div className="relative">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 p-8">
            <div className="flex items-center gap-4 mb-8">
                <Bot className="w-10 h-10 text-blue-500" />
                <div className="flex-1 h-2 bg-slate-700 rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                <div key={item} className="h-2 bg-slate-700 rounded-full w-full" />
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
  </motion.section>
);