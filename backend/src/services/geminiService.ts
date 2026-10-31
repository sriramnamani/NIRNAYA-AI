import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import type { ExtractedSource } from './sourceExtractor.js';

export interface FindingItem {
  claim: string;
  sourceId: string;
  sourceUrl: string;
  supportingExcerpt: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InformationGap {
  area: string;
  explanation: string;
  impactOnDecision: string;
}

export interface ContradictoryClaim {
  aspect: string;
  claimA: {
    statement: string;
    sourceId: string;
    sourceUrl: string;
  };
  claimB: {
    statement: string;
    sourceId: string;
    sourceUrl: string;
  };
  interrogationNote: string;
}

export interface OutdatedInfoItem {
  topic: string;
  sourceId: string;
  sourceUrl: string;
  claimDateOrTimeframe: string;
  potentialRisk: string;
}

export interface VerificationChecklistItem {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  rationale: string;
}

export interface AnalysisDossier {
  executiveSummary: string;
  evidenceBackedFindings: FindingItem[];
  informationGaps: InformationGap[];
  contradictoryClaims: ContradictoryClaim[];
  potentiallyOutdatedInfo: OutdatedInfoItem[];
  unansweredQuestions: string[];
  verificationChecklist: VerificationChecklistItem[];
  modelUsed: string;
  timestamp: string;
}

export interface GeminiAnalysisResult {
  isConfigured: boolean;
  model: string;
  dossier: AnalysisDossier | null;
  error?: string;
}

class GeminiService {
  private client: GoogleGenAI | null = null;
  private readonly modelName: string;

  constructor() {
    this.modelName = config.geminiModel || 'gemini-3.5-flash';
    this.refreshClient();
  }

  /**
   * Refreshes the client in case environment variables were updated at runtime.
   */
  public refreshClient(): void {
    const key = process.env.GEMINI_API_KEY || config.geminiApiKey;
    if (key && key.trim().length > 0) {
      try {
        this.client = new GoogleGenAI({ apiKey: key.trim() });
      } catch (err) {
        console.error('Failed to initialize GoogleGenAI client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  /**
   * Check if the Gemini API key is configured and ready
   */
  public isConfigured(): boolean {
    const key = process.env.GEMINI_API_KEY || config.geminiApiKey;
    return Boolean(key && key.trim().length > 0);
  }

  /**
   * Perform structured research synthesis on extracted source content.
   */
  public async analyzeExtractedSources(
    topic: string,
    goal: string,
    extractedSources: ExtractedSource[]
  ): Promise<GeminiAnalysisResult> {
    this.refreshClient();

    if (!this.isConfigured() || !this.client) {
      return {
        isConfigured: false,
        model: this.modelName,
        dossier: null,
        error:
          'GEMINI_API_KEY is not configured in backend/.env. Please configure your API key to run AI synthesis.',
      };
    }

    // Only successfully extracted sources
    const validSources = extractedSources.filter(s => s.status === 'success' && s.textContent.trim().length > 0);

    if (validSources.length === 0) {
      return {
        isConfigured: true,
        model: this.modelName,
        dossier: null,
        error: 'No valid extracted text available from the provided sources for Gemini analysis.',
      };
    }

    // Compile source dossiers for prompt
    const sourceContextText = validSources
      .map(
        s => `
========================================
SOURCE ID: [${s.id}]
TITLE: ${s.title}
URL: ${s.normalizedUrl}
PUBLISHED DATE: ${s.publishedDate || 'Unknown'}
CONTENT:
${s.textContent}
========================================`
      )
      .join('\n');

    const validSourceIds = validSources.map(s => s.id);
    const validSourceIdList = validSourceIds.join(', ');

    const systemPrompt = `
You are the NIRNAYA AI Analytical Reasoning Engine.
Your motto: "Know More. Question Better. Decide Smarter."

CRITICAL TRUTH & CITATION RULES:
1. ONLY cite facts and excerpts present in the provided extracted sources (${validSourceIdList}).
2. NEVER invent, hallucinate, or fabricate source IDs, URLs, quotes, dates, or contradictory claims.
3. Every finding must refer to a valid source ID from [${validSourceIdList}] and include a verbatim or near-verbatim excerpt from that source.
4. If sources do not contradict each other on a point, do not invent contradictions; simply return an empty array [] for contradictoryClaims.
5. If there is genuine uncertainty or ambiguity, explicitly state it.
6. Return your entire output as strict valid JSON conforming to the requested schema. No markdown formatting outside JSON.
`;

    const userPrompt = `
RESEARCH TOPIC: ${topic}
RESEARCH GOAL: ${goal}

EXTRACTED SOURCES:
${sourceContextText}

Analyze these sources against the topic and goal. Provide a comprehensive, audit-ready structured report adhering to the following JSON structure:

{
  "executiveSummary": "A concise 2-4 paragraph analytical synthesis addressing the research goal directly.",
  "evidenceBackedFindings": [
    {
      "claim": "Direct factual assertion",
      "sourceId": "One of: ${validSourceIdList}",
      "sourceUrl": "The corresponding source URL",
      "supportingExcerpt": "Exact or closely matching quote/sentence from that source",
      "confidence": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "informationGaps": [
    {
      "area": "Topic area where information is missing",
      "explanation": "What specific information the sources fail to clarify",
      "impactOnDecision": "Why this gap matters for the decision goal"
    }
  ],
  "contradictoryClaims": [
    {
      "aspect": "Disputed metric, date, claim, or timeline",
      "claimA": {
        "statement": "What source A asserts",
        "sourceId": "Source ID",
        "sourceUrl": "Source URL"
      },
      "claimB": {
        "statement": "What source B asserts",
        "sourceId": "Source ID",
        "sourceUrl": "Source URL"
      },
      "interrogationNote": "Critical reasoning on why they disagree (methodology, date divergence, vendor bias, etc.)"
    }
  ],
  "potentiallyOutdatedInfo": [
    {
      "topic": "Claim or metric with potential staleness",
      "sourceId": "Source ID",
      "sourceUrl": "Source URL",
      "claimDateOrTimeframe": "Date or period referenced",
      "potentialRisk": "Why this might be obsolete or misleading now"
    }
  ],
  "unansweredQuestions": [
    "Question 1 to ask primary sources or vendors",
    "Question 2 to verify before acting"
  ],
  "verificationChecklist": [
    {
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "action": "Specific verification step to take",
      "rationale": "Why this must be confirmed independently"
    }
  ]
}
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // low temperature for high precision and groundedness
        },
      });

      const responseText = response.text?.trim() || '';
      if (!responseText) {
        throw new Error('Gemini API returned an empty response.');
      }

      // Parse and validate JSON
      let parsed: any;
      try {
        // Strip code fence if accidentally included
        const sanitized = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        parsed = JSON.parse(sanitized);
      } catch (jsonErr) {
        console.error('Failed to parse Gemini JSON output:', responseText);
        throw new Error('Failed to parse Gemini output as JSON: ' + (jsonErr instanceof Error ? jsonErr.message : String(jsonErr)));
      }

      // Post-validation: ensure citations map to actual source IDs
      const validMap = new Map(validSources.map(s => [s.id, s.normalizedUrl]));

      const sanitizedFindings: FindingItem[] = Array.isArray(parsed.evidenceBackedFindings)
        ? parsed.evidenceBackedFindings.map((f: any) => {
            const id = validMap.has(f.sourceId) ? f.sourceId : (validSources[0]?.id || 'S1');
            return {
              claim: String(f.claim || ''),
              sourceId: id,
              sourceUrl: validMap.get(id) || String(f.sourceUrl || ''),
              supportingExcerpt: String(f.supportingExcerpt || ''),
              confidence: ['HIGH', 'MEDIUM', 'LOW'].includes(f.confidence) ? f.confidence : 'MEDIUM',
            };
          })
        : [];

      const sanitizedContradictions: ContradictoryClaim[] = Array.isArray(parsed.contradictoryClaims)
        ? parsed.contradictoryClaims.map((c: any) => ({
            aspect: String(c.aspect || ''),
            claimA: {
              statement: String(c.claimA?.statement || ''),
              sourceId: validMap.has(c.claimA?.sourceId) ? c.claimA.sourceId : (validSources[0]?.id || 'S1'),
              sourceUrl: validMap.get(c.claimA?.sourceId) || String(c.claimA?.sourceUrl || ''),
            },
            claimB: {
              statement: String(c.claimB?.statement || ''),
              sourceId: validMap.has(c.claimB?.sourceId) ? c.claimB.sourceId : (validSources[1]?.id || validSources[0]?.id || 'S2'),
              sourceUrl: validMap.get(c.claimB?.sourceId) || String(c.claimB?.sourceUrl || ''),
            },
            interrogationNote: String(c.interrogationNote || ''),
          }))
        : [];

      const dossier: AnalysisDossier = {
        executiveSummary: String(parsed.executiveSummary || 'Summary not provided.'),
        evidenceBackedFindings: sanitizedFindings,
        informationGaps: Array.isArray(parsed.informationGaps)
          ? parsed.informationGaps.map((g: any) => ({
              area: String(g.area || ''),
              explanation: String(g.explanation || ''),
              impactOnDecision: String(g.impactOnDecision || ''),
            }))
          : [],
        contradictoryClaims: sanitizedContradictions,
        potentiallyOutdatedInfo: Array.isArray(parsed.potentiallyOutdatedInfo)
          ? parsed.potentiallyOutdatedInfo.map((o: any) => ({
              topic: String(o.topic || ''),
              sourceId: validMap.has(o.sourceId) ? o.sourceId : (validSources[0]?.id || 'S1'),
              sourceUrl: validMap.get(o.sourceId) || String(o.sourceUrl || ''),
              claimDateOrTimeframe: String(o.claimDateOrTimeframe || 'Unknown'),
              potentialRisk: String(o.potentialRisk || ''),
            }))
          : [],
        unansweredQuestions: Array.isArray(parsed.unansweredQuestions)
          ? parsed.unansweredQuestions.map((q: any) => String(q))
          : [],
        verificationChecklist: Array.isArray(parsed.verificationChecklist)
          ? parsed.verificationChecklist.map((v: any) => ({
              priority: ['HIGH', 'MEDIUM', 'LOW'].includes(v.priority) ? v.priority : 'MEDIUM',
              action: String(v.action || ''),
              rationale: String(v.rationale || ''),
            }))
          : [],
        modelUsed: this.modelName,
        timestamp: new Date().toISOString(),
      };

      return {
        isConfigured: true,
        model: this.modelName,
        dossier,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Gemini API analysis failed:', msg);
      return {
        isConfigured: true,
        model: this.modelName,
        dossier: null,
        error: `Gemini API execution error: ${msg}`,
      };
    }
  }
}

export const geminiService = new GeminiService();
