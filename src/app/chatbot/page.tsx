'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProtected } from '@/components/auth/AuthProtected';
import Navbar from '@/components/navbar/navbar';
import Hero from '@/components/chatbothero/hero';
import ChatApp from '@/components/chatinterface/interface';
import SessionManager from '@/components/chat/sessionmanager';
import { withAuth } from "@/components/auth/withAuth";

interface ChatSession {
 _id: string;
 title: string;
 lastMessage: string;
 selectedBook: string;
 metadata?: {
   totalMessages?: number;
   imageCount?: number;
   lastInteraction?: Date;
 };
 createdAt: Date;
 updatedAt: Date;
}

const ProfessorAI = () => {
 const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
 const [sessions, setSessions] = useState<ChatSession[]>([]);

 const fetchSessions = useCallback(async () => {
   try {
     const response = await fetch('/api/chat-sessions');
     if (response.ok) {
       const data = await response.json();
       setSessions(data.sessions);
       if (data.sessions.length > 0 && !currentSessionId) {
         setCurrentSessionId(data.sessions[0]._id);
       }
     }
   } catch (error) {
     console.error('Failed to fetch sessions:', error);
   }
 }, [currentSessionId]);

 useEffect(() => {
   fetchSessions();
 }, [fetchSessions]);

 const handleNewSession = async () => {
  try {
    const response = await fetch('/api/chat-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Chat',
        selectedBook: '',
        lastMessage: 'New conversation started',
        book: '' // Add this field
      })
    });

    const data = await response.json();
    
    if (response.ok && data.session) {
      setSessions(prevSessions => [data.session, ...prevSessions]);
      setCurrentSessionId(data.session._id);
    } else {
      throw new Error(data.error || 'Unknown error occurred');
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    } else {
      console.error('Error details:', error);
    }
    throw error;
  }
};
 const handleSessionUpdate = async (sessionId: string, title: string, lastMessage: string) => {
   try {
     const response = await fetch(`/api/chat-sessions/${sessionId}`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ title, lastMessage }),
     });

     if (response.ok) {
       const { session } = await response.json();
       setSessions(prev => prev.map(s => s._id === sessionId ? session : s));
       await fetchSessions();
     }
   } catch (error) {
     console.error('Failed to update session:', error);
   }
 };

 const handleDeleteSession = async (sessionId: string) => {
   try {
     const response = await fetch(`/api/chat-sessions/${sessionId}`, {
       method: 'DELETE',
     });

     if (response.ok) {
       setSessions(prev => prev.filter(s => s._id !== sessionId));
       if (currentSessionId === sessionId) {
         const remainingSessions = sessions.filter(s => s._id !== sessionId);
         setCurrentSessionId(remainingSessions[0]?._id || null);
       }
       await fetchSessions();
     }
   } catch (error) {
     console.error('Failed to delete session:', error);
   }
 };

 return (
   <AuthProtected>
     <div className="min-h-screen bg-[#0A0118] text-white">
       <Navbar />
       <Hero />
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex gap-4">
           <div className="w-64 flex-shrink-0">
             <SessionManager
               sessions={sessions}
               currentSessionId={currentSessionId}
               onSessionSelect={setCurrentSessionId}
               onNewSession={handleNewSession}
               onDeleteSession={handleDeleteSession}
             />
           </div>

           <div className="flex-1">
             <div className="bg-[#0F0627]/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl shadow-purple-500/10">
               <div className="p-6">
                 {currentSessionId ? (
                   <ChatApp
                     sessionId={currentSessionId}
                     onUpdateSession={(title, lastMessage) => 
                       handleSessionUpdate(currentSessionId, title, lastMessage)
                     }
                   />
                 ) : (
                   <div className="h-[600px] flex items-center justify-center text-gray-400">
                     Select a chat or start a new one
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </AuthProtected>
 );
};

export default withAuth(ProfessorAI);