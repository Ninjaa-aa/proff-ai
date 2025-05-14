// components/home/TestimonialCard.tsx
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
interface TestimonialCardProps {
  text: string;
  author: string;
  role: string;
  index: number;
}

export const TestimonialCard = ({ text, author, role, index }: TestimonialCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="p-8 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <motion.div 
        className="flex-shrink-0"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10">
          <Star className="w-5 h-5 text-blue-500" />
        </div>
      </motion.div>
      <div>
        <p className="text-slate-300 leading-relaxed mb-6">&quot;{text}&quot;</p>
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-blue-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  </motion.div>
);
