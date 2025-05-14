// app/chat/[sessionId]/page.tsx
import { Suspense } from 'react';
import Navbar from '@/components/navbar/navbar';
import Hero from '@/components/chatbothero/hero';
import ChatContainer from '@/components/chatinterface/ChatContainer';
import {redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { ChatSession } from '@/models/ChatSession';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/auth-utils';

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

async function verifyChatSession(sessionId: string) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return null;
    }

    const decoded = await verifyToken(token);
    if (!decoded?.userId) {
      return null;
    }

    await connectDB();
    const session = await ChatSession.findOne({
      _id: sessionId,
      userId: decoded.userId
    });

    return session;
  } catch (error) {
    console.error('Failed to verify chat session:', error);
    return null;
  }
}

function ChatLoadingState() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-300px)]">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto" />
        <p className="text-gray-400">Loading chat session...</p>
      </div>
    </div>
  );
}

export default async function ChatPage({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await verifyChatSession(resolvedParams.sessionId);
  
  if (!session) {
    redirect('/login?redirectTo=' + encodeURIComponent(`/chat/${resolvedParams.sessionId}`));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Hero />
      <div className="flex-1">
        <Suspense fallback={<ChatLoadingState />}>
          <ChatContainer sessionId={resolvedParams.sessionId} />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await verifyChatSession(resolvedParams.sessionId);
  
  return {
    title: session ? `${session.title} - Professor AI` : 'Chat - Professor AI',
    description: 'Interactive chat session with Professor AI',
    keywords: ['chat', 'AI', 'education', 'learning'],
  };
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate static params if needed
export async function generateStaticParams() {
  return [];
}