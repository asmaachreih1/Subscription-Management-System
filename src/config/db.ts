import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log(' MongoDB Connected');
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1);
  }
}
