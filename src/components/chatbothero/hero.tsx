// components/chatbothero/hero.tsx
'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Bot, Cpu } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const text = "Professor AI";
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="relative py-12 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-950 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Bot className="absolute top-1/4 left-1/4 w-8 h-8 text-blue-400/20 animate-float" />
          <Cpu className="absolute bottom-1/4 right-1/4 w-8 h-8 text-purple-400/20 animate-float-delayed" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur group-hover:opacity-100 animate-pulse" />
            <div className="relative">
              <Sparkles className="w-12 h-12 text-blue-400 animate-spin-slow" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {displayText}
            </span>
            <span className="animate-blink text-purple-400">|</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;