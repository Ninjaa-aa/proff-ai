// app/api/chat-sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ChatSession } from '@/models/ChatSession';
import { Message } from '@/models/Message';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all chat sessions for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const sessions = await ChatSession.find({ 
      userId: session.user.id 
    })
    .sort({ updatedAt: -1 })
    .lean();

    return NextResponse.json({ sessions, success: true });
  } catch (error) {
    console.error('Failed to fetch chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

// Create a new chat session
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const chatSession = await ChatSession.create({
      userId: session.user.id,
      title: 'New Chat',
      lastMessage: 'New conversation started',
      updatedAt: new Date()
    });

    return NextResponse.json({ session: chatSession, success: true });
  } catch (error) {
    console.error('Failed to create chat session:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}

// Delete multiple sessions
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionIds } = await request.json();
    if (!sessionIds || !Array.isArray(sessionIds)) {
      return NextResponse.json({ error: 'Invalid session IDs' }, { status: 400 });
    }

    await connectDB();

    // Delete sessions and their associated messages
    const deleteSessions = ChatSession.deleteMany({
      _id: { $in: sessionIds },
      userId: session.user.id
    });

    const deleteMessages = Message.deleteMany({
      sessionId: { $in: sessionIds }
    });

    await Promise.all([deleteSessions, deleteMessages]);

    return NextResponse.json({ 
      success: true,
      message: 'Sessions and messages deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat sessions' },
      { status: 500 }
    );
  }
}

// Update multiple sessions
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessions } = await request.json();
    if (!sessions || !Array.isArray(sessions)) {
      return NextResponse.json({ error: 'Invalid sessions data' }, { status: 400 });
    }

    await connectDB();

    const updatePromises = sessions.map(async (sessionUpdate) => {
      const { _id, title, lastMessage, selectedBook } = sessionUpdate;
      
      return ChatSession.findOneAndUpdate(
        { 
          _id,
          userId: session.user.id 
        },
        { 
          ...(title && { title }),
          ...(lastMessage && { lastMessage }),
          ...(selectedBook && { selectedBook }),
          updatedAt: new Date()
        },
        { new: true }
      );
    });

    const updatedSessions = await Promise.all(updatePromises);

    return NextResponse.json({ 
      sessions: updatedSessions,
      success: true
    });
  } catch (error) {
    console.error('Failed to update chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to update chat sessions' },
      { status: 500 }
    );
  }
}