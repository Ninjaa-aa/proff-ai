'use client';
import React, { useState, useEffect } from 'react';
import { ChatHistory } from './ChatHistory';
import ChatInterface from './ChatInterface';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatContainerProps {
  sessionId?: string;
}

export default function ChatContainer({ sessionId }: ChatContainerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (sessionId) {
          // If sessionId is provided, use it
          setActiveSessionId(sessionId);
          setIsLoading(false);
          return;
        }

        // If no sessionId, fetch sessions
        const response = await fetch('/api/chat-sessions');
        if (response.ok) {
          const data = await response.json();
          
          if (data.sessions && data.sessions.length > 0) {
            // Use the most recent session
            const mostRecentSession = data.sessions[0];
            router.push(`/chat/${mostRecentSession._id}`);
          } else {
            // No sessions exist, create a new one
            const createResponse = await fetch('/api/chat-sessions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                title: 'New Chat',
                lastMessage: 'Start a new conversation'
              })
            });

            if (createResponse.ok) {
              const newSessionData = await createResponse.json();
              router.push(`/chat/${newSessionData.session._id}`);
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-400">Loading your chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-300px)]">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-0' : 'w-64'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}>
        {activeSessionId && <ChatHistory currentSessionId={activeSessionId} />}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-[350px] md:hidden z-50 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-900">
        {activeSessionId ? (
          <ChatInterface sessionId={activeSessionId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="animate-pulse">Creating new chat session...</div>
          </div>
        )}
      </div>
    </div>
  );
}