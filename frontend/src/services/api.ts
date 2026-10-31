export interface HealthStatus {
  status: string;
  service: string;
  tagline: string;
  version: string;
  phase: number;
  timestamp: string;
  geminiConfigured: boolean;
}

export interface ResearchSubmission {
  topic: string;
  goal: string;
  sourceUrls: string[];
}

export interface ExtractedSourceInfo {
  id: string;
  url: string;
  normalizedUrl: string;
  domain: string;
  title: string;
  extractedLength: number;
  publishedDate?: string;
  status: 'success' | 'failed';
  error?: string;
}

export interface ExtractionSummary {
  totalSubmitted: number;
  successfulCount: number;
  failedCount: number;
  sources: ExtractedSourceInfo[];
}

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

export interface AnalysisResponse {
  success: boolean;
  message?: string;
  error?: string;
  requiresSetup?: boolean;
  data?: {
    topic: string;
    goal: string;
    extraction: ExtractionSummary;
    dossier: AnalysisDossier | null;
    geminiConfigured: boolean;
  };
}

const API_BASE = '/api';

export async function checkBackendHealth(): Promise<{ ok: boolean; data?: HealthStatus; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data: HealthStatus = await res.json();
    return { ok: true, data };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Backend unreachable';
    return { ok: false, error: errorMessage };
  }
}

export async function executeResearchAnalysis(payload: ResearchSubmission): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data: AnalysisResponse = await res.json();
  return data;
}
