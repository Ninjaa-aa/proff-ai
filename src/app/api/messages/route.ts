// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message } from '@/models/Message';
import { verifyToken } from '@/lib/auth/auth-utils';
import { cookies } from 'next/headers';

// Get chat history
export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const messages = await Message.find({ 
      userId: decoded.userId 
    }).sort({ timestamp: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Save new message
export async function POST(request: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { text, isUser, conversationId } = await request.json();

    await connectDB();

    const message = await Message.create({
      userId: decoded.userId,
      text,
      isUser,
      conversationId
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Failed to save message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}