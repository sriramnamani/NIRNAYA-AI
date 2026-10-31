import React from 'react';
import { Compass, Code2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#03060C] border-t border-slate-900 py-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 p-[1px]">
                <div className="w-full h-full bg-[#050A12] rounded-[11px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <span className="font-extrabold tracking-wider text-xl text-white">NIRNAYA AI</span>
            </div>

            <p className="text-sm text-sky-400 font-semibold tracking-wide">
              Know More. Question Better. Decide Smarter.
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An intelligent multi-source research interrogator and critical decision engine. 
              Designed for analysts, scholars, and investors seeking unvarnished truth over blind summarization.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3 text-left">
            <div className="text-xs font-mono uppercase text-white font-bold tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-sky-400 transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-sky-400 transition-colors">Features</a></li>
              <li><a href="#use-cases" className="hover:text-sky-400 transition-colors">Use Cases</a></li>
              <li><a href="#research" className="hover:text-sky-400 transition-colors">Research Intake</a></li>
              <li><a href="#about" className="hover:text-sky-400 transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-sky-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 3: Architecture & Hackathon */}
          <div className="space-y-3 text-left">
            <div className="text-xs font-mono uppercase text-white font-bold tracking-wider">
              Project
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solo Hackathon Project • Phase 1 Release
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>• React + Vite + TypeScript</div>
              <div>• Tailwind CSS + Lucide Icons</div>
              <div>• Node.js + Express Backend</div>
              <div>• Google Gemini API Integration Ready</div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-1">
            <span>Built with precision &</span>
            <Heart className="w-3.5 h-3.5 text-sky-400 fill-sky-400 inline" />
            <span>for the Hackathon</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
            <span>•</span>
            <span className="font-mono text-sky-400/80">NIRNAYA AI v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
