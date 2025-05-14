// components/chatinterface/ChatHistory.tsx
'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ChatHistoryProps {
  currentSessionId: string;
}

interface ChatSession {
  _id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export const ChatHistory = ({ currentSessionId }: ChatHistoryProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      const response = await fetch('/api/chat-sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
        const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title: 'New Chat',
            lastMessage: 'Start a new conversation'
        }),
        });

        if (response.ok) {
        const data = await response.json();
        router.push(`/chat/${data.session._id}`);
        await fetchChatSessions(); // Refresh the chat list
        }
    } catch (error) {
        console.error('Failed to create new chat:', error);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove session from local state
        setSessions(sessions.filter(session => session._id !== sessionId));
        
        // If we just deleted the current session, create a new one
        if (sessionId === currentSessionId) {
          createNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete chat session:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={createNewChat}
        className="flex items-center justify-center gap-2 p-3 m-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="text-gray-400 text-center py-4">Loading chats...</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No chats yet</div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session._id}
                onClick={() => router.push(`/chat/${session._id}`)}
                className={`group relative p-3 rounded-lg transition-colors cursor-pointer
                  ${session._id === currentSessionId 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30' 
                    : 'hover:bg-gray-800'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-200 truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {session.lastMessage}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteSession(session._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-opacity"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {format(new Date(session.updatedAt), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};