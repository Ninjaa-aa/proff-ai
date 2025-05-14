import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var globalMongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Explicitly initialize `cached` and ensure it always has a value
const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = global.globalMongoose || { conn: null, promise: null };

// Assign back to global to ensure persistence across hot-reloads
global.globalMongoose = cached;

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('New MongoDB connection established');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null; // Reset the promise on failure
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Ensure promise is reset on failure
    throw e;
  }

  return cached.conn;
}

// Add connection status check
export async function checkConnection() {
  try {
    const conn = await connectDB();
    return conn?.connection?.readyState === 1;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

export default connectDB;
