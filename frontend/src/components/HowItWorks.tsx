import React from 'react';
import { Target, FileSearch, BrainCircuit, CheckSquare, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Target & Ingest',
      subtitle: 'Define Topic, Goal & Source URLs',
      description:
        'Specify the core decision problem along with multiple authoritative web sources, research papers, or industry reports.',
      icon: Target,
      highlight: 'Structured Multi-Input Intake',
    },
    {
      step: '02',
      title: 'Extract & Triangulate',
      subtitle: 'Lineage Extraction & Deduplication',
      description:
        'Server-side extractors strip noise, parse core paragraphs, map out domain credibility, and construct cross-reference chains.',
      icon: FileSearch,
      highlight: 'Context Extraction Pipeline',
    },
    {
      step: '03',
      title: 'Interrogate & Invalidate',
      subtitle: 'Gemini Critical Reasoning Engine',
      description:
        'The reasoning model does not just summarize: it stress-tests claims, uncovers contradicting facts, and isolates unsupported assertions.',
      icon: BrainCircuit,
      highlight: 'Counter-Factual Inquiry',
    },
    {
      step: '04',
      title: 'Synthesize & Decide',
      subtitle: 'Transparent Decision Dossier',
      description:
        'Receive an executive intelligence brief complete with confidence ratings, corroborated findings, and verbatim citation lineage.',
      icon: CheckSquare,
      highlight: 'Audit-Ready Executive Brief',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[#050A12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Architecture & Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How NIRNAYA AI Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A rigorous four-tier pipeline engineered to bridge the gap between raw web information 
            and sound executive decision-making.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative group p-6 rounded-2xl bg-[#0B1526]/80 border border-slate-800/90 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
              >
                {/* Step pill & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800/40">
                      STEP {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-sky-500/40 text-sky-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-medium text-sky-400/80 mb-3">
                    {item.subtitle}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Highlight */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-slate-400">{item.highlight}</span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500/60 hidden lg:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

