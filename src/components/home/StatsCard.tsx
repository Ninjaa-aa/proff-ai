// components/home/StatsCard.tsx
import { motion } from 'framer-motion';

export interface StatCardProps {
  label: string;
  value: string;
  index: number;
}

export const StatCard = ({ label, value, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="text-center p-8 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="text-3xl font-bold text-blue-500 mb-2">{value}</div>
    <div className="text-slate-400">{label}</div>
  </motion.div>
);

export default StatCard;