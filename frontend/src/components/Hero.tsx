import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Layers, SearchCheck } from 'lucide-react';
import { RotatingEarth } from './RotatingEarth';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-sky-950/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Tagline, Value Proposition, Action Buttons */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            {/* Hackathon Project Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-300 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-inner">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>NIRNAYA AI • Solo Hackathon Project • Phase 1 Prototype</span>
            </div>

            {/* Main Headline & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Know More. <br />
                <span className="text-gradient-sky">Question Better.</span> <br />
                Decide Smarter.
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                An intelligent multi-source research interrogator and decision engine. 
                Instead of blind LLM summaries, NIRNAYA AI triangulates disparate sources, 
                challenges underlying assumptions, and synthesizes audit-ready dossiers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#research"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-sky-500/25 hover:shadow-sky-400/40 hover:-translate-y-0.5 flex items-center justify-center space-x-2 group"
              >
                <span>Initialize Research</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0B1526] hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-200 font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Explore Methodology</span>
              </a>
            </div>

            {/* Micro Feature Proof Points */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80">
              <div className="flex items-center space-x-2.5 text-left">
                <div className="p-2 rounded-lg bg-sky-950/50 border border-sky-800/40 text-sky-400 shrink-0">
                  <SearchCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Multi-Source Ingestion</div>
                  <div className="text-[11px] text-slate-400">Deep URL parsing & validation</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 text-left">
                <div className="p-2 rounded-lg bg-sky-950/50 border border-sky-800/40 text-sky-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Zero Hallucination Focus</div>
                  <div className="text-[11px] text-slate-400">Verifiable source lineage</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 text-left">
                <div className="p-2 rounded-lg bg-sky-950/50 border border-sky-800/40 text-sky-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Gemini Engine Ready</div>
                  <div className="text-[11px] text-slate-400">Modular server-side API</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Rotating Earth Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full relative">
              <RotatingEarth />
            </div>

            {/* Sub-caption */}
            <p className="mt-4 text-xs font-mono text-slate-400 text-center tracking-wide">
              Global Source Interrogation Mesh • Drag or hover to inspect projection
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

