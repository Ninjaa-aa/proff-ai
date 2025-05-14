// app/chat/[sessionId]/loading.tsx
import Navbar from '@/components/navbar/navbar';
import Hero from '@/components/chatbothero/hero';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Hero />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Loading chat session...</p>
        </div>
      </div>
    </div>
  );
}