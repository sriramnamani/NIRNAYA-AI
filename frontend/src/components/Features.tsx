import React from 'react';
import { 
  Globe2, 
  GitFork, 
  ShieldAlert, 
  Cpu, 
  CheckCircle, 
  LockKeyhole 
} from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Globe2,
      title: 'Multi-Source Triangulation',
      description:
        'Compare across diverse research papers, news reports, and filings in parallel to eliminate single-source bias.',
      tag: 'Ingestion Engine',
    },
    {
      icon: ShieldAlert,
      title: "Devil's Advocate Interrogation",
      description:
        'NIRNAYA proactively formulates counter-hypotheses and uncovers blind spots before you commit to critical conclusions.',
      tag: 'Critical Reasoning',
    },
    {
      icon: GitFork,
      title: 'Conflict & Consensus Matrix',
      description:
        'Automatically classifies claims into consensus agreements, minor divergences, and direct contradictions.',
      tag: 'Synthesis',
    },
    {
      icon: Cpu,
      title: 'Google Gemini Core',
      description:
        'Harnesses state-of-the-art Gemini context models for deep multi-document reasoning with low latency.',
      tag: 'Server AI Pipeline',
    },
    {
      icon: CheckCircle,
      title: 'Verifiable Citation Lineage',
      description:
        'Zero blind trust. Every extracted assertion retains strict provenance links back to the source URL and domain.',
      tag: 'Auditability',
    },
    {
      icon: LockKeyhole,
      title: 'Server-Side Key Isolation',
      description:
        'Enterprise-grade security posture: your AI provider API keys never touch the client browser.',
      tag: 'Architecture',
    },
  ];

  return (
    <section id="features" className="py-24 relative bg-[#050A12] border-t border-slate-900">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for High-Stakes Decisions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Ordinary search gives you answers; NIRNAYA AI gives you reasoned judgment 
            tested against verifiable evidence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-7 rounded-2xl bg-[#0B1526]/70 border border-slate-800/80 hover:border-sky-500/50 hover:bg-[#0B1526] transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-800/40 text-sky-400 group-hover:scale-110 group-hover:bg-sky-900/60 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs text-sky-400 font-medium">
                  <span>Engineered for Solo Agility</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

