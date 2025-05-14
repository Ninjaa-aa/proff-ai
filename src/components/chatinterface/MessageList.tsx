// components/chatinterface/MessageList.tsx
import React from 'react';
import { Bot, User, Loader2, WifiOff } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MessageItem = React.memo(({ message }: { message: Message }) => (
  <div className={`px-4 py-6 ${message.isUser ? 'bg-gray-800/50' : ''}`}>
    <div className="max-w-3xl mx-auto flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.isUser ? 'bg-purple-500/20' : 'bg-blue-500/20'
      }`}>
        {message.isUser ? (
          <User className="w-5 h-5 text-purple-400" />
        ) : (
          <Bot className="w-5 h-5 text-blue-400" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-invert max-w-none">
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        <span className="text-xs text-gray-500">
          {format(new Date(message.timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  </div>
));

MessageItem.displayName = 'MessageItem';

interface MessageListProps {
  messages: Message[];
  currentResponse: string;
  isTyping: boolean;
  isConnected: boolean;
}

export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentResponse, isTyping, isConnected }, ref) => {
    if (!isConnected) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <WifiOff className="w-12 h-12 mx-auto mb-4" />
            <p>Connection lost. Trying to reconnect...</p>
          </div>
        </div>
      );
    }

    const hasContent = messages.length > 0 || currentResponse || isTyping;

    return (
      <div ref={ref} className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-800">
          {!hasContent ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Start a conversation with Professor AI
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
              
              {currentResponse && (
                <MessageItem
                  key="current-response"
                  message={{
                    id: 'current-response',
                    text: currentResponse,
                    isUser: false,
                    timestamp: new Date()
                  }}
                />
              )}
              
              {isTyping && !currentResponse && (
                <div className="px-4 py-6">
                  <div className="max-w-3xl mx-auto flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Professor AI is typing...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';