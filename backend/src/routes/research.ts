import { Router } from 'express';
import { validateResearchInput, runResearchAnalysis } from '../controllers/researchController.js';

const router = Router();

router.post('/validate', validateResearchInput);
router.post('/submit', runResearchAnalysis); // Alias for backwards-compatibility
router.post('/analyze', runResearchAnalysis);

export default router;
