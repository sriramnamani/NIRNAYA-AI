import React from 'react';
import { TrendingUp, Briefcase, GraduationCap, Scale, ChevronRight } from 'lucide-react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      icon: TrendingUp,
      title: 'Competitive Market Intelligence',
      targetAudience: 'Product Leaders & Strategy Teams',
      description:
        'Triangulate release notes, teardowns, and industry analyst commentaries to reveal the actual maturity of emerging technologies.',
      exampleQuery: 'Compare solid-state battery commercialization claims across CATL, QuantumScape, and Toyota.',
    },
    {
      icon: Briefcase,
      title: 'Investment & Due Diligence',
      targetAudience: 'Venture Capitalists & Angel Investors',
      description:
        'Pressure-test pitch deck metrics against market reports, independent benchmark evaluations, and regulatory disclosures.',
      exampleQuery: 'Audit enterprise AI agent traction versus churn indicators in current B2B SaaS filings.',
    },
    {
      icon: GraduationCap,
      title: 'Scientific & Academic Research',
      targetAudience: 'Researchers & Graduate Scholars',
      description:
        'Synthesize findings across conflicting preprint literature, isolate reproducible claims, and identify unaddressed methodology flaws.',
      exampleQuery: 'Reconcile contradictory findings in LLM reasoning benchmark degradation studies.',
    },
    {
      icon: Scale,
      title: 'Policy & Regulatory Strategy',
      targetAudience: 'Compliance Officers & Legal Counsel',
      description:
        'Map out multi-jurisdictional AI safety frameworks and data residency mandates across US, EU, and APAC guidelines.',
      exampleQuery: 'Synthesize EU AI Act enforcement obligations against standard US SaaS cloud architectures.',
    },
  ];

  return (
    <section id="use-cases" className="py-24 relative bg-[#050A12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Real-World Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Designed for Critical Workflows
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Whether you are evaluating a multimillion-dollar market bet or drafting a rigorous literature review, 
            NIRNAYA AI accelerates clarity.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-8 rounded-2xl bg-[#0B1526]/80 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-sky-950/70 border border-sky-800/50 text-sky-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      {item.targetAudience}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Example Query Pill */}
                <div className="p-4 rounded-xl bg-[#050A12] border border-slate-800/80 group-hover:border-sky-900/60 transition-colors">
                  <div className="text-[11px] font-mono text-sky-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                    <span>Example Interrogation Case</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-slate-300 italic">
                    "{item.exampleQuery}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

