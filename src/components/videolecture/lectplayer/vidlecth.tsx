import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, MessageCircle, Clock, Loader2, Square, Bot, User, AlertTriangle, Play } from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import { Lecture, Question, Transcript } from '@/types/vidlecth';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import TranscriptDisplay from '@/components/videolecture/transdisplay/transcript';

// Socket configuration
const SOCKET_URL = 'https://zt7rwk6f-5000.inc1.devtunnels.ms';
const SOCKET_OPTIONS = {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
};

// Component interfaces
interface VideoLectureProps {
  video: Lecture;
}

interface ProcessingStatus {
  status: 'idle' | 'started' | 'progress' | 'complete' | 'error';
  message: string;
  progress?: number;
}

// Processing status UI component
const ProcessingStatus = ({ status, onRetry }: { status: ProcessingStatus; onRetry: () => void; }) => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
    <div className="text-center space-y-4">
      <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500" />
      <p>This video needs to be processed before chat features can be used.</p>
      <div className="space-y-2">
        <button
          onClick={onRetry}
          disabled={status.status === 'progress'}
          className={`px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 ${
            status.status === 'progress' ? 'cursor-not-allowed' : ''
          }`}
        >
          {status.status === 'progress' ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing... {status.progress}%</span>
            </div>
          ) : (
            'Process Video'
          )}
        </button>

        {status.status !== 'idle' && (
          <div className="mt-4 space-y-2">
            <p className={`text-sm ${status.status === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
              {status.message}
            </p>
            {status.progress !== undefined && status.status === 'progress' && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Text animation component
const AnimatedText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showFormatted, setShowFormatted] = useState(false);
  
  // Check if the text includes "Key Video Moments" section
  const hasKeyMoments = text.includes("Key Video Moments");

  useEffect(() => {
    if (!text) return;
    
    setDisplayedText('');
    setIsComplete(false);
    setShowFormatted(false);
    
    let index = 0;
    const speed = Math.min(25, 1000 / text.length);  // Adjust speed based on length
    
    // For long responses or responses with Key Video Moments, speed up animation
    const adjustedSpeed = hasKeyMoments ? speed * 0.7 : speed;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        setIsComplete(true);
        // Once animation is complete, show the formatted version
        setTimeout(() => setShowFormatted(true), 300);
        clearInterval(timer);
      }
    }, adjustedSpeed);
    
    return () => clearInterval(timer);
  }, [text, hasKeyMoments]);

  // If animation is complete and we have key moments, show the formatted version
  if (isComplete && showFormatted && hasKeyMoments) {
    function processTimestamps(text: string) {
      // Regex to match timestamps in the format [00:00] or [00:00 -> 00:00]
      const timestampRegex = /\[([\d:]+)(?:\s*->\s*([\d:]+))?\]/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = timestampRegex.exec(text)) !== null) {
      // Push the text before the timestamp
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Push the timestamp itself
      parts.push(
        <span key={match.index} className="text-purple-500">
        {match[0]}
        </span>
      );

      lastIndex = match.index + match[0].length;
      }

      // Push the remaining text after the last timestamp
      if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
      }

      return <>{parts}</>;
    }

    return <>{processTimestamps(text)}</>;
  }
  
  // Otherwise just show the raw animated text with cursor
  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      {!isComplete && <span className="animate-pulse">▌</span>}
    </div>
  );
};

// Default placeholder SVG for video preview
const defaultPlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23101520'/%3E%3Ccircle cx='320' cy='180' r='70' fill='%231e2030'/%3E%3Cpath d='M370 180 L290 230 L290 130 Z' fill='white'/%3E%3C/svg%3E`;

// Main Video Lecture Component
const VideoLecture: React.FC<VideoLectureProps> = ({ video }) => {
  // State management
  const [activeTab, setActiveTab] = useState<'transcript' | 'questions'>('transcript');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [transcriptData, setTranscriptData] = useState<Transcript[]>([]);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isTranscriptionAvailable, setIsTranscriptionAvailable] = useState(video.hasTranscription);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    status: 'idle',
    message: ''
  });
  // Video playing states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Animation states
  const [showAnimatedResponse, setShowAnimatedResponse] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const messageBuffer = useRef<string>('');
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  const initializeChat = useCallback(() => {
    if (!socketRef.current?.connected) return;
    if (!video.hasTranscription) {
      setIsTranscriptionAvailable(false);
      return;
    }

    setChatError(null);
    setIsTranscriptionAvailable(true);
    socketRef.current.emit('start_video_chat', { video_title: video.title });
  }, [video.hasTranscription, video.title]);

  // Format duration from seconds to mm:ss or hh:mm:ss
  const formatDuration = (seconds: number): string => {
    if (!seconds) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format nice timestamp for messages
  const formatMessageTime = (timestamp: number): string => {
    const now = new Date();
    const messageDate = new Date();
    messageDate.setHours(0, 0, timestamp, 0);
    
    return format(messageDate, 'h:mm a');
  };

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      // Don't auto-play initially
      videoElement.pause();
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e);
      setIsVideoError(true);
    };

    const handlePlay = () => {
      setIsVideoPlaying(true);
    };

    const handlePause = () => {
      setIsVideoPlaying(false);
    };

    // Set up event listeners
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError as EventListener);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      // Clean up event listeners
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError as EventListener);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [video.path]);

  // Function to start playing the video
  const startPlayback = () => {
    if (videoRef.current && isVideoLoaded && !isVideoPlaying) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  };

  // Socket initialization and connection management
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, SOCKET_OPTIONS);
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      setConnectionStatus('connected');
      if (video.hasTranscription) {
        socket.emit('start_video_chat', { video_title: video.title });
      }
    };

    const handleChatStarted = () => {
      setChatInitialized(true);
      setChatError(null);
    };

    const handleError = (error: { message: string; type?: string }) => {
      setChatError(error.message);
      if (error.type === 'NO_TRANSCRIPTION') setIsTranscriptionAvailable(false);
      if (error.type === 'INITIALIZATION_ERROR') setChatInitialized(false);
    };
    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      setChatInitialized(false);
    };

    socket.on('connect', handleConnect);
    socket.on('video_chat_started', handleChatStarted);
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('video_chat_started', handleChatStarted);
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
    };
  }, [video.hasTranscription, video.title]);

  // Message handling and response streaming
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    const handleStreamResponse = (data: { word: string }) => {
      setIsTyping(true);
      messageBuffer.current += data.word;
      setCurrentResponse(messageBuffer.current);
    };
    
    const handleResponseComplete = () => {
      if (messageBuffer.current.trim()) {
        const botMessage: Question = {
          id: Date.now(),
          text: messageBuffer.current.trim(),
          timestamp: currentTime,
          answered: true,
          isUser: false
        };
        
        // Show animated response first, then add to messages
        setShowAnimatedResponse(true);
        
        // After animation completes, add to messages
        setTimeout(() => {
          setQuestions(prev => [...prev, botMessage]);
          setShowAnimatedResponse(false);
          setIsTyping(false);
          setIsGenerating(false);
          messageBuffer.current = '';
          setCurrentResponse('');
        }, 1500); // Adjust timing based on animation speed
      } else {
        setIsTyping(false);
        setIsGenerating(false);
        messageBuffer.current = '';
        setCurrentResponse('');
      }
    };

    socket.on('stream_response', handleStreamResponse);
    socket.on('response_complete', handleResponseComplete);

    return () => {
      socket.off('stream_response', handleStreamResponse);
      socket.off('response_complete', handleResponseComplete);
    };
  }, [currentTime]);

  // Processing status handler
  useEffect(() => {
    if (!socketRef.current) return;

    const handleProcessingStatus = (data: ProcessingStatus) => {
      setProcessingStatus(data);
      if (data.status === 'complete') {
        setIsProcessing(false);
        setIsTranscriptionAvailable(true);
        if (socketRef.current?.connected) {
          socketRef.current.emit('start_video_chat', { video_title: video.title });
        }
      } else if (data.status === 'error') {
        setIsProcessing(false);
      }
    };

    socketRef.current.on('processing_status', handleProcessingStatus);
    return () => {
      socketRef.current?.off('processing_status', handleProcessingStatus);
    };
  }, [video.title]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions, currentResponse]);

  // Load transcript data
  useEffect(() => {
    const fetchTranscript = async () => {
      if (video.hasTranscription) {
        try {
          const response = await fetch(`${SOCKET_URL}/api/video/${video.id}/transcript`);
          if (!response.ok) throw new Error('Failed to fetch transcript');
          const data = await response.json();
          setTranscriptData(data.transcript);
        } catch (fetchError) {
          console.error('Error fetching transcript:', fetchError);
          setTranscriptData([]);
        }
      }
    };

    fetchTranscript();
  }, [video]);

  // Event Handlers
  const handleProcessVideo = async () => {
    try {
      setIsProcessing(true);
      setProcessingStatus({
        status: 'progress',
        message: 'Initializing video processing...',
        progress: 0
      });

      const response = await fetch(`${SOCKET_URL}/api/video/${video.id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to process video');
      }
    } catch (error) {
      setProcessingStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        progress: 0
      });
      setIsProcessing(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || isGenerating || !chatInitialized) return;

    const questionText = newQuestion.trim();
    const question: Question = {
      id: Date.now(),
      text: questionText,
      timestamp: currentTime,
      answered: false,
      isUser: true
    };

    setQuestions(prev => [...prev, question]);
    setNewQuestion('');
    setIsTyping(true);
    setIsGenerating(true);
    messageBuffer.current = '';
    setCurrentResponse('');

    socketRef.current?.emit('video_chat_message', {
      message: questionText,
      currentTime
    });
  };

  const handleStopGeneration = () => {
    socketRef.current?.emit('end_chat');
    setIsGenerating(false);
    setIsTyping(false);
    setCurrentResponse('');
    messageBuffer.current = '';
    initializeChat();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleDownloadTranscript = () => {
    const transcript = transcriptData
      .map(item => `[${formatDuration(item.time)}] ${item.text}`)
      .join('\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.title}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format and highlight timestamps in message content
  const processTimestamps = (text: string) => {
    // Check for "Key Video Moments" section
    if (text.includes("Key Video Moments")) {
      const [mainContent, timestampSection] = text.split(/Key\s+Video\s+Moments/i);
      
      // Process main content with inline timestamps
      const mainContentProcessed = processInlineTimestamps(mainContent);
      
      // Format the "Key Video Moments" section
      return (
        <div className="space-y-3">
          {/* Main content */}
          <div className="text-gray-200 whitespace-pre-wrap">
            {mainContentProcessed}
          </div>
          
          {/* Key Video Moments heading */}
          <div className="mt-4 mb-2">
            <h3 className="text-purple-300 font-medium border-b border-purple-700/30 pb-1">
              Key Video Moments
            </h3>
          </div>
          
          {/* Format each timestamp in the section */}
          <div className="space-y-3 pl-1">
            {formatTimestampSection(timestampSection)}
          </div>
        </div>
      );
    }
    
    // Fall back to inline timestamp processing for messages without sections
    return <div className="text-gray-200 whitespace-pre-wrap">{processInlineTimestamps(text)}</div>;
  };
  
  // Process inline timestamps within regular text
  const processInlineTimestamps = (text: string) => {
    // Regex to match common timestamp patterns like [00:00 -> 00:00] or [00:00]
    const timestampRegex = /\[([\d:]+)(?:\s*->\s*([\d:]+))?\]/g;
    
    if (!text || !timestampRegex.test(text)) {
      return text;
    }
    
    // Reset regex lastIndex
    timestampRegex.lastIndex = 0;
    
    // Array to hold the processed parts
    const processedParts: JSX.Element[] = [];
    let i = 0;
    
    // Process each match
    let match: RegExpExecArray | null;
    while ((match = timestampRegex.exec(text)) !== null) {
      // Add text before timestamp
      if (text.substring(i, match.index).trim()) {
        processedParts.push(
          <span key={`text-${i}`}>
            {text.substring(i, match.index)}
          </span>
        );
      }
      
      // Format the timestamp
      const startTime = match[1];
      const endTime = match[2];
      
      processedParts.push(
        <span 
          key={`timestamp-${match.index}`}
          className="inline-flex items-center px-2 py-0.5 mx-1 rounded bg-purple-600/20 text-purple-300 font-mono text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          {startTime}
          {endTime && <span className="mx-1">→</span>}
          {endTime && endTime}
        </span>
      );
      
      i = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (i < text.length) {
      processedParts.push(
        <span key={`text-end`}>
          {text.substring(i)}
        </span>
      );
    }
    
    return processedParts;
  };
  
  // Format dedicated timestamp section
  const formatTimestampSection = (text: string = '') => {
    if (!text) return null;
    
    // Regex to match timestamp entries like "▶ 00:00" followed by content
    const entries = text.split(/▶\s*([\d:]+)/i).filter(Boolean);
    const result: JSX.Element[] = [];
    
    for (let i = 0; i < entries.length; i += 2) {
      // If we have a timestamp and content pair
      if (i + 1 < entries.length) {
        const timestamp = entries[i].trim();
        const content = entries[i + 1].trim();
        
        result.push(
          <div key={`ts-${i}`} className="border-l-2 border-purple-500/30 pl-3 py-1">
            <div 
              className="flex items-center mb-1 cursor-pointer hover:text-purple-300 transition-colors"
              onClick={() => {
                // Here you could add functionality to jump to this timestamp in the video
                console.log(`Clicked timestamp: ${timestamp}`);
              }}
            >
              <div className="bg-purple-600/30 text-purple-300 font-mono text-sm px-2 py-0.5 rounded flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span>{timestamp}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">{content}</p>
          </div>
        );
      }
    }
    
    return result;
  };

  // Message component with improved styling
  const MessageBubble = ({ question, animated = false }: { question: Question, animated?: boolean }) => (
    <div
      className={`flex items-start space-x-2 mb-4 ${question.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        question.isUser ? 'bg-purple-500/20' : 'bg-blue-500/20'
      }`}>
        {question.isUser ? (
          <User className="w-5 h-5 text-purple-400" />
        ) : (
          <Bot className="w-5 h-5 text-blue-400" />
        )}
      </div>
      
      <div className={`max-w-[85%] ${question.isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          question.isUser ? 'bg-purple-500/10' : 'bg-blue-500/10'
        }`}>
          {animated ? (
            <AnimatedText text={question.text} />
          ) : (
            processTimestamps(question.text)
          )}
        </div>
        
        <div className={`flex items-center mt-1 text-xs text-gray-400 ${
          question.isUser ? 'justify-end' : 'justify-start'
        }`}>
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatDuration(question.timestamp)}</span>
          <span className="mx-1">•</span>
          <span>{formatMessageTime(question.timestamp)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Main Content */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 text-gray-200">
        <div className="p-6">
          {/* Video Player with Preview UI */}
          <div className="space-y-3">
            <div 
              ref={videoContainerRef}
              className="aspect-video bg-gray-950 rounded-lg overflow-hidden relative"
            >
              {/* Show loader only until video metadata is loaded */}
              {!isVideoLoaded && !isVideoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                </div>
              )}
              
              {/* Video Element - Always present but only visible when playing */}
              <video
                ref={videoRef}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                controls={isVideoPlaying}
                src={`${SOCKET_URL}${video.path}`}
                poster={`${SOCKET_URL}${video.thumbnail}`} 
                preload="metadata"
                style={{ display: isVideoPlaying ? 'block' : 'none' }}
                crossOrigin="anonymous"
              />
              
              {/* Play Button Overlay - Show when video is loaded but not playing */}
              {isVideoLoaded && !isVideoPlaying && (
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={startPlayback}
                >
                  {/* Use actual thumbnail as background */}
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${SOCKET_URL}${video.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-opacity">
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-purple-600 bg-opacity-80 flex items-center justify-center mb-4">
                          <Play className="w-10 h-10 text-white ml-2" />
                        </div>
                        <h3 className="text-xl font-medium text-white text-center px-4 drop-shadow-md">
                          {video.title}
                        </h3>
                        {/* Display duration */}
                        {video.duration > 0 && (
                          <div className="mt-2 px-3 py-1 bg-black bg-opacity-60 rounded-full text-white text-sm flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(video.duration)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error State */}
              {isVideoError && (
                <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-gray-400">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                  <p>Failed to load video.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
            
            {/* Video Controls */}
            <div className="flex justify-between items-center px-1">
              <div className="text-sm text-gray-400">
                {formatDuration(currentTime)} / {formatDuration(video.duration)}
              </div>
              {/* <div className="flex gap-2">
                {video.hasTranscription && (
                  <button 
                    onClick={handleDownloadTranscript}
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-gray-800 text-purple-300 hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Transcript
                  </button>
                )}
              </div> */}
            </div>
          </div>

          {/* Tabs */}
          <div className="w-full mt-6">
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'transcript' 
                    ? 'bg-gray-700 text-purple-300' 
                    : 'text-gray-400 hover:text-purple-300'
                }`}
              >
                Transcript
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'questions' 
                    ? 'bg-gray-700 text-purple-300' 
                    : 'text-gray-400 hover:text-purple-300'
                }`}
              >
                Questions
              </button>
            </div>

            <div className="mt-4">
              {activeTab === 'transcript' && (
                <TranscriptDisplay 
                  videoId={video.id} 
                  currentTime={currentTime} 
                />
              )}

              {activeTab === 'questions' && (
                <div className="h-64 space-y-4">
                  {!video.hasTranscription ? (
                    <ProcessingStatus
                      status={processingStatus}
                      onRetry={handleProcessVideo}
                    />
                  ) : connectionStatus !== 'connected' ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      <div className="text-center space-y-2">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-500" />
                        <p>Connecting to chat server...</p>
                      </div>
                    </div>
                  ) : chatError && !isGenerating ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      <div className="text-center space-y-2">
                        <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
                        <p>{chatError}</p>
                        <button 
                          onClick={initializeChat}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-48 overflow-y-auto pr-2">
                        <AnimatePresence>
                          {questions.map((question) => (
                            <motion.div
                              key={question.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <MessageBubble question={question} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        {/* Show animated response when streaming */}
                        {showAnimatedResponse && currentResponse && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <MessageBubble 
                              question={{
                                id: Date.now(),
                                text: currentResponse,
                                timestamp: currentTime,
                                answered: true,
                                isUser: false
                              }} 
                              animated={true}
                            />
                          </motion.div>
                        )}
                        
                        {isTyping && !currentResponse && (
                          <div className="flex items-center space-x-2 text-gray-400 my-4">
                            <div className="flex">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/20">
                                <Bot className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="ml-2 bg-blue-500/10 rounded-lg px-4 py-2 inline-flex">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Current response with animation */}
                        {!showAnimatedResponse && currentResponse && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start space-x-2">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/20">
                                <Bot className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="max-w-[85%]">
                                <div className="rounded-lg px-4 py-2 bg-blue-500/10">
                                  <AnimatedText text={currentResponse} />
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{formatDuration(currentTime)}</span>
                                  <span className="mx-1">•</span>
                                  <span>{formatMessageTime(currentTime)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <form onSubmit={handleQuestionSubmit} className="flex gap-2 mt-4">
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder={
                            chatInitialized
                              ? "Ask about the lecture..."
                              : "Connecting to chat..."
                          }
                          disabled={!chatInitialized || isGenerating}
                          className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 
                                    placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {isGenerating ? (
                          <button
                            type="button"
                            onClick={handleStopGeneration}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white inline-flex items-center"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            type="submit"
                            disabled={!chatInitialized || !newQuestion.trim() || isGenerating}
                            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white 
                                      inline-flex items-center transition-colors disabled:opacity-50 
                                      disabled:cursor-not-allowed"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Ask
                          </button>
                        )}
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLecture;