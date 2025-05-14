// app/chat/[sessionId]/not-found.tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/navbar/navbar';
import Hero from '@/components/chatbothero/hero';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Hero />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-200">Chat Not Found</h2>
          <p className="text-gray-400">The chat session you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/chatbot" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}