import type { Request, Response } from 'express';
import { geminiService } from '../services/geminiService.js';
import { sourceExtractor } from '../services/sourceExtractor.js';

export const validateResearchInput = (req: Request, res: Response): void => {
  const { topic, goal, sourceUrls } = req.body;

  const errors: string[] = [];
  if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
    errors.push('Topic must be at least 3 characters long.');
  }

  if (!goal || typeof goal !== 'string' || goal.trim().length < 5) {
    errors.push('Research goal must be at least 5 characters long.');
  }

  if (!Array.isArray(sourceUrls) || sourceUrls.length === 0) {
    errors.push('At least one source URL is required.');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  const cleanUrls = sourceUrls.map((u: any) => String(u).trim()).filter(Boolean);
  const normalizedUrls: string[] = [];
  const validationErrors: string[] = [];

  for (const url of cleanUrls) {
    try {
      normalizedUrls.push(sourceExtractor.normalizeUrl(url));
    } catch (err: unknown) {
      validationErrors.push(err instanceof Error ? err.message : String(err));
    }
  }

  if (validationErrors.length > 0) {
    res.status(400).json({
      success: false,
      errors: validationErrors,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Research inputs validated successfully.',
    data: {
      topic: topic.trim(),
      goal: goal.trim(),
      sourceUrls: normalizedUrls,
      geminiConfigured: geminiService.isConfigured(),
    },
  });
};

/**
 * End-to-end research analysis pipeline:
 * 1. Validates inputs & normalizes URLs
 * 2. Fetches web pages safely (SSRF prevention, timeouts, limits)
 * 3. Extracts clean text via Cheerio
 * 4. Interrogates Gemini 2.5 with structured JSON schema
 * 5. Returns validated dossier with source-by-source status
 */
export const runResearchAnalysis = async (req: Request, res: Response): Promise<void> => {
  const { topic, goal, sourceUrls } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid topic (minimum 3 characters).',
    });
    return;
  }

  if (!goal || typeof goal !== 'string' || goal.trim().length < 5) {
    res.status(400).json({
      success: false,
      error: 'Please provide a clear research goal (minimum 5 characters).',
    });
    return;
  }

  if (!Array.isArray(sourceUrls) || sourceUrls.length === 0) {
    res.status(400).json({
      success: false,
      error: 'At least one source URL (up to 8) is required.',
    });
    return;
  }

  const cleanUrls = sourceUrls.map((u: any) => String(u).trim()).filter(Boolean);
  if (cleanUrls.length === 0) {
    res.status(400).json({
      success: false,
      error: 'Please provide at least one non-empty source URL.',
    });
    return;
  }

  console.log(`[NIRNAYA AI] Starting analysis for topic: "${topic}" across ${cleanUrls.length} sources...`);

  // Step 1: Extract sources
  const extractionResult = await sourceExtractor.extractAll(cleanUrls);
  console.log(
    `[NIRNAYA AI] Extraction finished: ${extractionResult.successfulCount} succeeded, ${extractionResult.failedCount} failed.`
  );

  // If all sources failed to extract
  if (extractionResult.successfulCount === 0) {
    res.status(422).json({
      success: false,
      error:
        'All submitted sources could not be reached or had insufficient readable text. Check the source extraction breakdown.',
      data: {
        topic: topic.trim(),
        goal: goal.trim(),
        extraction: extractionResult,
        dossier: null,
        geminiConfigured: geminiService.isConfigured(),
      },
    });
    return;
  }

  // Step 2: Check Gemini API Key configuration
  if (!geminiService.isConfigured()) {
    res.status(200).json({
      success: false,
      requiresSetup: true,
      error:
        'GEMINI_API_KEY is not configured in backend/.env. Sources were successfully extracted, but AI synthesis requires an API key.',
      data: {
        topic: topic.trim(),
        goal: goal.trim(),
        extraction: extractionResult,
        dossier: null,
        geminiConfigured: false,
      },
    });
    return;
  }

  // Step 3: Run Gemini Interrogation
  const geminiResponse = await geminiService.analyzeExtractedSources(
    topic.trim(),
    goal.trim(),
    extractionResult.sources
  );

  if (!geminiResponse.dossier) {
    res.status(502).json({
      success: false,
      error: geminiResponse.error || 'Gemini synthesis failed to produce an audit dossier.',
      data: {
        topic: topic.trim(),
        goal: goal.trim(),
        extraction: extractionResult,
        dossier: null,
        geminiConfigured: true,
      },
    });
    return;
  }

  // Step 4: Return full analysis
  res.status(200).json({
    success: true,
    message: 'Analysis completed successfully.',
    data: {
      topic: topic.trim(),
      goal: goal.trim(),
      extraction: extractionResult,
      dossier: geminiResponse.dossier,
      geminiConfigured: true,
    },
  });
};
