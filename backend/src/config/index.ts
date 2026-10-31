import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
};

