import { Router, type Request, type Response } from 'express';
import { geminiService } from '../services/geminiService.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'NIRNAYA AI Backend API',
    tagline: 'Know More. Question Better. Decide Smarter.',
    version: '1.0.0',
    phase: 1,
    timestamp: new Date().toISOString(),
    geminiConfigured: geminiService.isConfigured(),
  });
});

export default router;

