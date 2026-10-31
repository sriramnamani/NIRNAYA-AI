import React from 'react';
import { Compass, Sparkles, Terminal, Code2, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative bg-[#050A12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Origins & Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            About NIRNAYA AI
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            In Sanskrit and Hindi, <span className="text-sky-400 font-semibold italic">"NIRNAYA" (निर्णय)</span> signifies 
            the arrival at truth through decisive inquiry and sound judgment.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base leading-relaxed text-left">
            <div className="p-6 rounded-2xl bg-[#0B1526]/80 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2.5">
                <Compass className="w-5 h-5 text-sky-400" />
                <span>The Core Premise</span>
              </h3>
              <p>
                In the generative AI era, we are flooded with summaries, but starved for critical judgment. 
                Most chatbots act like overly agreeable assistants—they digest web content indiscriminately, 
                reproduce marketing copy as truth, and fail to interrogate contradictions across sources.
              </p>
              <p>
                <strong className="text-white">NIRNAYA AI</strong> was created to inverse this paradigm. 
                Built around the philosophy <em className="text-sky-300">"Know More. Question Better. Decide Smarter"</em>, 
                the platform treats sources as witnesses in an intellectual inquiry: verifying provenance, 
                highlighting conflicting data points, and framing rigorous counter-questions.
              </p>
            </div>

            {/* Solo Hackathon Box */}
            <div className="p-6 rounded-2xl bg-sky-950/30 border border-sky-800/40 space-y-3">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Solo Hackathon Project</span>
              </div>
              <p className="text-sm text-slate-300">
                Engineered end-to-end as an agile solo project, prioritizing clean code architecture, 
                defensive system design, responsive dark-mode aesthetics, and a modular backend prepared 
                for production Google Gemini API integration.
              </p>
            </div>
          </div>

          {/* Right Architecture Breakdown */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0B1526] border border-slate-800 space-y-5 text-left">
              <div className="text-xs font-mono uppercase text-sky-400 tracking-wider font-semibold flex items-center justify-between">
                <span>Phase 1 Tech Stack</span>
                <Terminal className="w-4 h-4 text-slate-500" />
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800/40 text-sky-400 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Frontend Engine</div>
                    <div className="text-xs text-slate-400">React 19 • Vite • TypeScript • Tailwind CSS • Lucide Icons</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800/40 text-sky-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Backend Server</div>
                    <div className="text-xs text-slate-400">Node.js • Express • TypeScript • Modular Services</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800/40 text-sky-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">AI Reasoning</div>
                    <div className="text-xs text-slate-400">Google Gemini API integration with server-side key isolation</div>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Phase 1 Build Status</span>
                <span className="text-emerald-400 font-semibold">VERIFIED READY</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

