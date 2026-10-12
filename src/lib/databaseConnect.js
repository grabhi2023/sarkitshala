import mongoose from 'mongoose';

const cached = globalThis._mongooseCache || (globalThis._mongooseCache = { conn: null, promise: null });

export default async function dbConnect() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}