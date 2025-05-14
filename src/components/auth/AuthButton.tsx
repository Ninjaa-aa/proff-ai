// components/auth/AuthButton.tsx
'use client';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { LogIn, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const AuthButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </motion.button>
        </Link>
        <Link href="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Sign Up</span>
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center space-x-2"
    >
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </motion.div>
  );
};