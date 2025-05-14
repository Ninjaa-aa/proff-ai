import React from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  question: string;
  isGenerating: boolean;
  disabled?: boolean; // Add this
  onQuestionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onStop: () => void;
}
const ChatInput = ({ 
  question, 
  isGenerating, 
  onQuestionChange, 
  onKeyDown, 
  onSubmit, 
  onStop 
}: ChatInputProps) => (
  <div className="border-t border-gray-800 bg-gray-900 p-4">
    <div className="max-w-3xl mx-auto relative flex items-center">
      <textarea
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onKeyDown}
        placeholder="Ask your question..."
        disabled={isGenerating}
        className="w-full bg-gray-800 text-gray-200 rounded-lg pl-4 pr-12 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        rows={1}
      />
      {isGenerating ? (
        <button
          onClick={onStop}
          className="absolute right-2 p-2 text-red-400 hover:text-red-300"
        >
          <Square className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={!question.trim()}
          className="absolute right-2 p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500"
        >
          <Send className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);

export default ChatInput;