// types/chat.ts
export interface ImageReference {
  path: string;
  page: number;
}

export interface MessageMetadata {
  pages?: number[];
  citations?: string[];
}

export interface SessionMetadata {
  totalMessages?: number;
  imageCount?: number;
  lastInteraction?: Date;
}

export interface ChatSession {
  _id: string;
  userId: string;
  title: string;
  lastMessage: string;
  selectedBook: string;
  metadata?: SessionMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  userId: string;
  sessionId: string;
  text: string;
  isUser: boolean;
  book: string;
  images?: ImageReference[];
  metadata?: MessageMetadata;
  timestamp: Date;
}