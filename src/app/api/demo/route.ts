// app/api/demo/route.ts
import { NextResponse } from 'next/server';
import DemoUser from '@/models/DemoUser';
import connectDB from '@/lib/mongodb';
import crypto from 'crypto';

const EXPIRATION_HOURS = 12;
const MS_PER_HOUR = 60 * 60 * 1000;
const MAX_DEMO_USERS = 10;

export async function POST() {
  try {
    await connectDB();

    // First, cleanup expired demos
    await DemoUser.cleanupDemos();

    // Count total demo users (both active and inactive)
    const totalDemos = await DemoUser.countDocuments();

    if (totalDemos >= MAX_DEMO_USERS) {
      return NextResponse.json({
        error: 'Maximum number of demo accounts reached. Please try again later.'
      }, { status: 429 });
    }

    const expiresAt = new Date(Date.now() + EXPIRATION_HOURS * MS_PER_HOUR);

    const demoUser = await DemoUser.create({
      email: `demo_${crypto.randomBytes(4).toString('hex')}@professor.ai`,
      password: crypto.randomBytes(4).toString('hex'),
      expiresAt,
      isAdmin: true,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      credentials: {
        email: demoUser.email,
        password: demoUser.password
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create demo account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}