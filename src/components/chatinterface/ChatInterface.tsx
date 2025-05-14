// components/chatinterface/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageList } from './MessageList';
import ChatInput from './ChatInput';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sessionId: string;
}

interface ChatInterfaceProps {
  sessionId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageBuffer = useRef<string>('');

  // Fetch session messages
  useEffect(() => {
    const fetchSessionMessages = async () => {
      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
      } catch (error) {
        console.error('Failed to fetch session messages:', error);
      }
    };

    if (sessionId) {
      fetchSessionMessages();
    }
  }, [sessionId]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('https://zt7rwk6f-5000.inc1.devtunnels.ms', {
      reconnection: true,
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Save message to database
  const saveMessage = useCallback(async (text: string, isUser: boolean) => {
    if (!sessionId) return null;
    
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, isUser }),
      });

      if (response.ok) {
        const { message } = await response.json();
        return message;
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }
    return null;
  }, [sessionId]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleStreamResponse = (data: { word: string }) => {
      messageBuffer.current += data.word;
      setCurrentResponse(messageBuffer.current);
    };

    const handleResponseComplete = async () => {
      if (messageBuffer.current.trim()) {
        const savedMessage = await saveMessage(messageBuffer.current.trim(), false);
        if (savedMessage) {
          setMessages(prev => [...prev, {
            ...savedMessage,
            timestamp: new Date(savedMessage.timestamp)
          }]);
        }
      }
      messageBuffer.current = '';
      setCurrentResponse('');
      setIsTyping(false);
      setIsGenerating(false);
    };

    socket.on('stream_response', handleStreamResponse);
    socket.on('response_complete', handleResponseComplete);
    
    return () => {
      socket.off('stream_response', handleStreamResponse);
      socket.off('response_complete', handleResponseComplete);
    };
  }, [socket, saveMessage]);

  // Handle question submission
  const handleQuestionSubmit = async () => {
    if (!question.trim() || isGenerating || !sessionId) return;

    const savedMessage = await saveMessage(question.trim(), true);
    if (savedMessage) {
      setMessages(prev => [...prev, {
        ...savedMessage,
        timestamp: new Date(savedMessage.timestamp)
      }]);
    }

    if (isConnected && socket) {
      socket.emit('ask_question', {
        question: question.trim(),
        sessionId
      });
    }

    setQuestion('');
    setIsTyping(true);
    setIsGenerating(true);
    messageBuffer.current = '';
    setCurrentResponse('');
  };

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <MessageList
        ref={messagesEndRef}
        messages={messages}
        currentResponse={currentResponse}
        isTyping={isTyping}
        isConnected={isConnected}
      />
      
      <ChatInput
        question={question}
        isGenerating={isGenerating}
        onQuestionChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleQuestionSubmit();
          }
        }}
        onSubmit={handleQuestionSubmit}
        onStop={() => {
          if (socket) {
            setIsGenerating(false);
            setIsTyping(false);
            socket.emit('stop_generation');
          }
        }}
      />
    </div>
  );
};

export default ChatInterface;