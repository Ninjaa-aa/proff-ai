// app/api/chat-sessions/[sessionId]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message } from '@/models/Message';
import { ChatSession } from '@/models/ChatSession';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RouteParams {
  params: Promise<{ sessionId: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { sessionId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify session ownership
    const chatSession = await ChatSession.findOne({
      _id: sessionId,
      userId: session.user.id
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ messages, success: true });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { sessionId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    // Start a session for atomic operations
    const mongoSession = await Message.startSession();
    mongoSession.startTransaction();

    try {
      // Create the message
      const message = await Message.create([{
        sessionId,
        content: body.content,
        role: body.role,
        createdAt: new Date()
      }], { session: mongoSession });

      // Update the chat session
      await ChatSession.findByIdAndUpdate(
        sessionId,
        {
          lastMessage: body.content,
          updatedAt: new Date()
        },
        { session: mongoSession }
      );

      await mongoSession.commitTransaction();
      return NextResponse.json({ message: message[0], success: true });
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}