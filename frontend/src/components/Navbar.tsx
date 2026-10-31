import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial check and periodic heartbeat
    const verifyHealth = async () => {
      const res = await checkBackendHealth();
      setBackendStatus(res.ok ? 'connected' : 'disconnected');
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Use Cases', href: '#use-cases' },
    { name: 'Research', href: '#research' },
    { name: 'About', href: '#about' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050A12]/90 backdrop-blur-md border-b border-sky-900/40 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 p-[1px] shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
            <div className="w-full h-full bg-[#050A12] rounded-[11px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-lg text-white">NIRNAYA</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/60">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Decide Smarter
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-7">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Action: Backend indicator & CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          <div
            title={
              backendStatus === 'connected'
                ? 'Backend API Connected'
                : backendStatus === 'checking'
                ? 'Pinging backend health...'
                : 'Backend API offline (run backend/npm run dev)'
            }
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#0B1526] border border-slate-800 text-xs text-slate-400"
          >
            {backendStatus === 'connected' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">API Live</span>
              </>
            ) : backendStatus === 'checking' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-slate-400">Syncing...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-400/90">API Staged</span>
              </>
            )}
          </div>

          <a
            href="#research"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Research
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#0B1526] border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050A12]/98 border-b border-sky-900/50 px-6 py-6 mt-3 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-sky-400 transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>
                Backend Status: {backendStatus === 'connected' ? 'Connected (Port 5000)' : 'Awaiting Connection'}
              </span>
            </div>
            <a
              href="#research"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center w-full px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm shadow-md"
            >
              Launch Research
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

