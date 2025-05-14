// models/Message.ts
import { Schema, model, models } from 'mongoose';

export interface IMessage {
  userId: Schema.Types.ObjectId;
  sessionId: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  book: string;          // Add book reference
  images?: Array<{      // Add images array
    path: string;
    page: number;
  }>;
  metadata?: {          // Add metadata for source citations
    pages?: number[];
    citations?: string[];
  };
}

const messageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  text: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    default: true
  },
  book: {
    type: String,
    required: true
  },
  images: [{
    path: {
      type: String,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  }],
  metadata: {
    pages: [Number],
    citations: [String]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Clear existing model if it exists to prevent OverwriteModelError
if (models.Message) {
  delete models.Message;
}

export const Message = model<IMessage>('Message', messageSchema);