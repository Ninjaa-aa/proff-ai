// SessionManager.tsx
import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

interface ChatSession {
 _id: string;
 title: string;
 lastMessage: string;
 selectedBook?: string;
 updatedAt: Date;
}

interface SessionManagerProps {
 sessions: ChatSession[];
 currentSessionId: string | null;
 onSessionSelect: (sessionId: string) => void;
 onNewSession: () => Promise<void>;
 onDeleteSession: (sessionId: string) => void;
}

export const SessionManager = ({ 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onNewSession, 
  onDeleteSession 
}: SessionManagerProps) => {
 const [isCreating, setIsCreating] = useState(false);
 const [localSessions, setLocalSessions] = useState(sessions);

 useEffect(() => {
   setLocalSessions(sessions);
 }, [sessions]);

 useEffect(() => {
   if (localSessions.length > 0 && !currentSessionId) {
     onSessionSelect(localSessions[0]._id);
   }
 }, [localSessions, currentSessionId, onSessionSelect]);

 const handleNewSession = async () => {
   setIsCreating(true);
   try {
     await onNewSession();
     if (localSessions.length > 0) {
       onSessionSelect(localSessions[0]._id);
     }
   } finally {
     setIsCreating(false);
   }
 };

 const handleSessionClick = async (sessionId: string) => {
   try {
     await fetch(`/api/chat-sessions/${sessionId}`);
     onSessionSelect(sessionId);
   } catch (error) {
     console.error('Failed to load session:', error);
   }
 };

 return (
   <div className="flex flex-col space-y-2 p-4 bg-gray-800/40 rounded-lg">
     <button
       onClick={handleNewSession}
       disabled={isCreating}
       className="flex items-center justify-center space-x-2 p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors disabled:opacity-50"
     >
       <Plus className="w-4 h-4" />
       <span>{isCreating ? 'Creating...' : 'New Chat'}</span>
     </button>

     <div className="space-y-2 mt-4">
       {localSessions.map((session) => (
         <div
           key={session._id}
           className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
             currentSessionId === session._id
               ? 'bg-purple-500/20'
               : 'hover:bg-gray-700/50'
           }`}
           onClick={() => handleSessionClick(session._id)}
         >
           <div className="flex items-center space-x-2 min-w-0">
             <MessageSquare className="w-4 h-4 flex-shrink-0" />
             <div className="flex flex-col min-w-0">
               <span className="text-sm font-medium truncate">
                 {session.title}
               </span>
               <span className="text-xs text-gray-400 truncate">
                 {session.lastMessage}
               </span>
             </div>
           </div>
           <button
             onClick={(e) => {
               e.stopPropagation();
               onDeleteSession(session._id);
             }}
             className="p-1 hover:bg-red-500/20 rounded ml-2 flex-shrink-0"
           >
             <Trash2 className="w-4 h-4 text-red-400" />
           </button>
         </div>
       ))}
     </div>
   </div>
 );
};

export default SessionManager;