import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
};

if (!env.MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined in .env file');
}
