import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  HelpCircle, 
  ExternalLink,
  ShieldAlert,
  Cpu,
  FileCheck2,
  Calendar,
  AlertOctagon,
  HelpCircle as QuestionIcon,
  CheckSquare2,
  Compass,
  Info
} from 'lucide-react';
import { executeResearchAnalysis, type AnalysisResponse } from '../services/api';

const SAMPLE_SOURCES = [
  'https://en.wikipedia.org/wiki/Quantum_computing',
  'https://en.wikipedia.org/wiki/Qubit',
  'https://en.wikipedia.org/wiki/Quantum_supremacy',
];

export const ResearchForm: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [sourceUrls, setSourceUrls] = useState<string[]>(['', '']);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleAddUrl = () => {
    if (sourceUrls.length < 8) {
      setSourceUrls([...sourceUrls, '']);
    }
  };

  const handleRemoveUrl = (index: number) => {
    if (sourceUrls.length > 1) {
      const updated = sourceUrls.filter((_, i) => i !== index);
      setSourceUrls(updated);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...sourceUrls];
    updated[index] = value;
    setSourceUrls(updated);
  };

  const handleLoadSample = () => {
    setTopic('Quantum Computing Scalability');
    setGoal('Evaluate physical qubit decoherence barriers, physical vs logical overhead, and near-term commercial viability.');
    setSourceUrls(SAMPLE_SOURCES);
    setError(null);
  };

  const handleReset = () => {
    setTopic('');
    setGoal('');
    setSourceUrls(['', '']);
    setError(null);
    setResult(null);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!topic.trim() || topic.trim().length < 3) {
      setError('Please provide a research topic (minimum 3 characters).');
      return;
    }

    if (!goal.trim() || goal.trim().length < 5) {
      setError('Please provide a clear research goal (minimum 5 characters).');
      return;
    }

    const filteredUrls = sourceUrls.map(u => u.trim()).filter(Boolean);
    if (filteredUrls.length === 0) {
      setError('Please provide at least 1 valid source URL (up to 8).');
      return;
    }

    setStatus('extracting');

    // Simulate pipeline stage progress for user visual clarity
    const timer = setTimeout(() => {
      setStatus('analyzing');
    }, 2500);

    try {
      const response = await executeResearchAnalysis({
        topic: topic.trim(),
        goal: goal.trim(),
        sourceUrls: filteredUrls,
      });

      clearTimeout(timer);
      setStatus('done');
      setResult(response);

      if (!response.success && !response.requiresSetup) {
        setError(response.error || 'Failed to complete analysis.');
      }
    } catch (err: unknown) {
      clearTimeout(timer);
      setStatus('done');
      const msg = err instanceof Error ? err.message : 'Failed to communicate with NIRNAYA AI backend.';
      setError(msg);
    }
  };

  return (
    <section id="research" className="py-24 relative bg-[#050A12] border-t border-slate-900">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Live Research Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Execute Multi-Source Interrogation
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Submit your research objective and live web sources. The server fetches, sanitizes, and evaluates 
            evidence with Google Gemini to produce an audit-ready decision dossier.
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0B1526]/90 border border-slate-800 shadow-2xl shadow-black/80 backdrop-blur-xl">
          
          {/* Header Action: Load sample */}
          <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">Inquiry Specification & Analysis Form</span>
            </div>
            
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={status === 'extracting' || status === 'analyzing'}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-800/50 text-sky-300 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Load Verified Sample (Wikipedia Quantum)</span>
            </button>
          </div>

          {/* Form */}
          {(!result || (!result.data?.dossier && !result.requiresSetup && !result.data?.extraction)) && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Field 1: Topic */}
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-sm font-semibold text-slate-200">
                  Research Topic or Decision Thesis <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    disabled={status !== 'idle' && status !== 'done'}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Quantum Computing Scalability & Commercial Roadmap"
                    className="w-full px-4 py-3 rounded-xl bg-[#050A12] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm sm:text-base disabled:opacity-60"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <span>The central theme or strategic hypothesis under investigation.</span>
                </p>
              </div>

              {/* Field 2: Research Goal */}
              <div className="space-y-2">
                <label htmlFor="goal" className="block text-sm font-semibold text-slate-200">
                  Research Goal & Decision Question <span className="text-sky-400">*</span>
                </label>
                <textarea
                  id="goal"
                  rows={3}
                  value={goal}
                  disabled={status !== 'idle' && status !== 'done'}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Identify primary hardware bottlenecks for fault-tolerant qubits, distinguish near-term vs speculative claims, and quantify timeline confidence."
                  className="w-full px-4 py-3 rounded-xl bg-[#050A12] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm sm:text-base resize-none disabled:opacity-60"
                  required
                />
                <p className="text-xs text-slate-400">
                  What specific judgment or decision will this research inform?
                </p>
              </div>

              {/* Field 3: Multiple Source URLs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-200">
                    Source URLs to Interrogate (1–8 URLs) <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {sourceUrls.filter(Boolean).length} / 8 sources
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sourceUrls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-7 text-center font-mono text-xs text-slate-400">
                        #{index + 1}
                      </span>
                      <input
                        type="text"
                        value={url}
                        disabled={status !== 'idle' && status !== 'done'}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="https://example.com/research-paper-or-report (https:// automatically prepended)"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#050A12] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm disabled:opacity-60"
                      />
                      {sourceUrls.length > 1 && (
                        <button
                          type="button"
                          disabled={status !== 'idle' && status !== 'done'}
                          onClick={() => handleRemoveUrl(index)}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Remove source URL"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {sourceUrls.length < 8 && (
                  <button
                    type="button"
                    disabled={status !== 'idle' && status !== 'done'}
                    onClick={handleAddUrl}
                    className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#050A12] hover:bg-slate-900 border border-dashed border-slate-800 hover:border-sky-500/50 text-sky-400 text-xs font-semibold transition-colors mt-1 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Source URL</span>
                  </button>
                )}
              </div>

              {/* Error Notice */}
              {error && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start space-x-3 text-red-300 text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Progress Indicator */}
              {(status === 'extracting' || status === 'analyzing') && (
                <div className="p-5 rounded-2xl bg-[#050A12] border border-sky-900/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-300 flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                      <span>
                        {status === 'extracting'
                          ? 'Stage 1/2: Fetching live sources & stripping noise...'
                          : 'Stage 2/2: Google Gemini analyzing & triangulating claims...'}
                      </span>
                    </span>
                    <span className="text-slate-400">
                      {status === 'extracting' ? '50%' : '85%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-sky-500 to-sky-300 transition-all duration-700 ${
                        status === 'extracting' ? 'w-1/2' : 'w-4/5 animate-pulse'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Applying SSRF verification, content-size limits, and JSON schema grounding.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'extracting' || status === 'analyzing'}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-sky-500/20 hover:shadow-sky-400/40 hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>Execute Live End-to-End Analysis</span>
                </button>
              </div>

            </form>
          )}

          {/* Setup Required State: API Key Missing */}
          {result?.requiresSetup && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-4">
                <div className="flex items-start space-x-3.5">
                  <Cpu className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-amber-300">
                      Gemini API Key Setup Required for Live Synthesis
                    </h4>
                    <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                      Sources were successfully fetched, validated, and parsed on the server! To run the Gemini 
                      triangulation and contradiction engine, add your key to <code className="text-sky-300 bg-black/50 px-2 py-0.5 rounded font-mono">backend/.env</code>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-slate-400"># In backend/.env:</div>
                  <div className="text-sky-400">GEMINI_API_KEY=your_actual_gemini_api_key_here</div>
                  <div className="text-slate-400 mt-2"># Then restart backend or refresh analysis.</div>
                </div>
              </div>

              {/* Render Extracted Sources Breakdown even if key missing */}
              {result.data?.extraction && (
                <div className="p-5 rounded-xl bg-[#050A12] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-sky-400 tracking-wider font-semibold">
                      Live Extracted Sources ({result.data.extraction.successfulCount} succeeded, {result.data.extraction.failedCount} failed)
                    </span>
                    <span className="text-xs text-slate-400">SSRF Verified</span>
                  </div>

                  <div className="space-y-2">
                    {result.data.extraction.sources.map((src) => (
                      <div
                        key={src.id}
                        className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2"
                      >
                        <div className="flex items-center space-x-2 truncate max-w-full sm:max-w-[70%]">
                          <span className="font-mono text-sky-400 font-bold">[{src.id}]</span>
                          <span className="text-slate-200 truncate">{src.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono text-slate-400">
                            {src.extractedLength.toLocaleString()} chars
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[10px] font-mono">
                            READY FOR SYNTHESIS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Modify Sources & Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Analysis Results Dashboard */}
          {result?.data?.dossier && (
            <div className="space-y-8 text-left">
              
              {/* Header Status Bar */}
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-base font-bold text-emerald-300">
                      Live Multi-Source Research Dossier Generated
                    </h4>
                    <p className="text-xs text-slate-300">
                      Evaluated using <span className="font-mono text-sky-300">{result.data.dossier.modelUsed}</span> • {new Date(result.data.dossier.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>New Research Inquiry</span>
                </button>
              </div>

              {/* 1. Extraction Breakdown & Lineage */}
              <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Source Extraction & Audit Lineage</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {result.data.extraction.successfulCount} of {result.data.extraction.totalSubmitted} Extracted
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.data.extraction.sources.map((s) => (
                    <div
                      key={s.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        s.status === 'success'
                          ? 'bg-slate-900/80 border-slate-800'
                          : 'bg-red-950/20 border-red-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sky-400">[{s.id}]</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            s.status === 'success'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                              : 'bg-red-950 text-red-300 border border-red-800/50'
                          }`}
                        >
                          {s.status === 'success' ? 'EXTRACTED' : 'FETCH FAILED'}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-200 truncate" title={s.title}>
                        {s.title}
                      </div>

                      <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                        <span className="truncate max-w-[200px]">{s.domain}</span>
                        <a
                          href={s.normalizedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-sky-400 flex items-center space-x-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {s.status === 'failed' && s.error && (
                        <p className="text-red-400 text-[11px] font-mono pt-1">
                          Reason: {s.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Executive Summary */}
              <div className="p-6 rounded-2xl bg-[#050A12] border border-sky-900/40 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                  <Compass className="w-4 h-4" />
                  <span>Executive Decision Summary</span>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {result.data.dossier.executiveSummary}
                </div>
              </div>

              {/* 3. Evidence-Backed Findings */}
              <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Evidence-Backed Findings & Source Excerpts</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {result.data.dossier.evidenceBackedFindings.length} Claims Verified
                  </span>
                </div>

                <div className="space-y-3">
                  {result.data.dossier.evidenceBackedFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-sky-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono text-xs border border-sky-800/40">
                            [{finding.sourceId}]
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Confidence: {finding.confidence}
                          </span>
                        </div>
                        <a
                          href={finding.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-sky-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Source URL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <p className="text-sm font-semibold text-slate-100">
                        {finding.claim}
                      </p>

                      <div className="p-3 rounded-lg bg-black/40 border border-slate-800/60 text-xs text-slate-300 italic border-l-2 border-l-sky-400">
                        "{finding.supportingExcerpt}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Contradictory Claims & Disagreements */}
              <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Contradictory Claims & Divergences</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {result.data.dossier.contradictoryClaims.length} Detected
                  </span>
                </div>

                {result.data.dossier.contradictoryClaims.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No explicit factual contradictions were detected across the successfully extracted sources.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {result.data.dossier.contradictoryClaims.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-amber-950/10 border border-amber-900/40 space-y-3"
                      >
                        <div className="text-sm font-bold text-amber-300">
                          Disputed Aspect: {item.aspect}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                            <span className="font-mono text-sky-400 font-bold">[{item.claimA.sourceId}]:</span>
                            <p className="text-slate-200">{item.claimA.statement}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                            <span className="font-mono text-sky-400 font-bold">[{item.claimB.sourceId}]:</span>
                            <p className="text-slate-200">{item.claimB.statement}</p>
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/60">
                          <strong className="text-amber-400">Interrogation Note: </strong>
                          {item.interrogationNote}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Information Gaps & Potentially Outdated Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Info Gaps */}
                <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    <Info className="w-4 h-4" />
                    <span>Identified Information Gaps</span>
                  </div>

                  <div className="space-y-3">
                    {result.data.dossier.informationGaps.map((gap, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-white">{gap.area}</div>
                        <p className="text-slate-300">{gap.explanation}</p>
                        <div className="text-[11px] text-sky-300 pt-1 font-mono">
                          Decision Impact: {gap.impactOnDecision}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Potentially Outdated Info */}
                <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>Temporal & Outdated Risk</span>
                  </div>

                  {result.data.dossier.potentiallyOutdatedInfo.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      No explicit historical obsolescence flags detected in extracted sources.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {result.data.dossier.potentiallyOutdatedInfo.map((out, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{out.topic}</span>
                            <span className="font-mono text-amber-300 text-[10px]">
                              {out.claimDateOrTimeframe}
                            </span>
                          </div>
                          <p className="text-slate-300">{out.potentialRisk}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* 6. Unanswered Questions & Prioritized Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Unanswered Questions */}
                <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    <QuestionIcon className="w-4 h-4" />
                    <span>Unanswered Questions to Probe</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                    {result.data.dossier.unansweredQuestions.map((q, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verification Checklist */}
                <div className="p-6 rounded-2xl bg-[#050A12] border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    <CheckSquare2 className="w-4 h-4" />
                    <span>Prioritized Verification Checklist</span>
                  </div>

                  <div className="space-y-2">
                    {result.data.dossier.verificationChecklist.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{item.action}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              item.priority === 'HIGH'
                                ? 'bg-red-950 text-red-300 border border-red-800/40'
                                : 'bg-sky-950 text-sky-300 border border-sky-800/40'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Integrity Seal */}
              <div className="p-4 rounded-xl bg-[#0B1526] border border-slate-800 text-xs text-slate-400 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Auditable Grounding Notice: </span>
                  All findings shown above cite directly from the live web pages extracted during this session.
                  AI interpretations and interrogations are structured server-side with deterministic schemas.
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
