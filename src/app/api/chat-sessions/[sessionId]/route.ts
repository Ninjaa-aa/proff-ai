import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ChatSession } from '@/models/ChatSession';
import { Message } from '@/models/Message';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RouteParams {
  params: Promise<{ sessionId: string }>
}

// Get a specific chat session
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

    const chatSession = await ChatSession.findOne({
      _id: sessionId,
      userId: session.user.id
    }).lean();

    if (!chatSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ session: chatSession, success: true });
  } catch (error) {
    console.error('Failed to fetch chat session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}

// Update a specific chat session
export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { sessionId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, lastMessage, selectedBook } = await request.json();
    
    await connectDB();

    const chatSession = await ChatSession.findOneAndUpdate(
      { 
        _id: sessionId,
        userId: session.user.id 
      },
      { 
        ...(title && { title }),
        ...(lastMessage && { lastMessage }),
        ...(selectedBook && { selectedBook }),
        'metadata.lastInteraction': new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!chatSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      session: chatSession,
      success: true 
    });
  } catch (error) {
    console.error('Failed to update chat session:', error);
    return NextResponse.json(
      { error: 'Failed to update chat session' },
      { status: 500 }
    );
  }
}

// Delete a specific chat session
export async function DELETE(
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

    const [chatSession] = await Promise.all([
      ChatSession.findOneAndDelete({
        _id: sessionId,
        userId: session.user.id
      }),
      Message.deleteMany({ 
        sessionId: sessionId
      })
    ]);

    if (!chatSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Chat session and messages deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete chat session:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    );
  }
}