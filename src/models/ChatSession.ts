// models/ChatSession.ts
import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String, // Change from ObjectId to String
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  lastMessage: {
    type: String,
    default: 'New conversation started'
  },
  selectedBook: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);