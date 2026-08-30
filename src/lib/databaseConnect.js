import mongoose from 'mongoose';

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) {
    console.log(' Database is already connected');
    return;
  }

  try {
  const db = await mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10, 
      
  });

  isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log('Database connected successfully');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
}
