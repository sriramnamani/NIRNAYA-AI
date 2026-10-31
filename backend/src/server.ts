import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import healthRouter from './routes/health.js';
import researchRouter from './routes/research.js';
import { runResearchAnalysis } from './controllers/researchController.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server and production clients
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '2mb' }));

// Request logging in development
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', healthRouter);
app.use('/api/research', researchRouter);

// Direct alias for POST /api/analyze as specified
app.post('/api/analyze', runResearchAnalysis);

// Fallback 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. NIRNAYA AI API is running.',
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(`🚀 NIRNAYA AI Backend Service running on port ${config.port}`);
    console.log(`📍 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`🔍 Analyze Endpoint: http://localhost:${config.port}/api/analyze`);
    console.log(`⚙️ Gemini API configured: ${Boolean(config.geminiApiKey)}`);
    console.log(`===============================================`);
  });
}

export default app;
