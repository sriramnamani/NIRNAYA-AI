import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What does "NIRNAYA" mean?',
      answer:
        'NIRNAYA (निर्णय) is a classical Sanskrit and Hindi word signifying definitive judgment, resolution, and determination arrived at after critical examination and inquiry.',
    },
    {
      question: 'How is NIRNAYA AI different from standard search engines or conversational chatbots?',
      answer:
        'Standard chatbots often synthesize content without validating contradictory claims or challenging assumptions. NIRNAYA AI acts as an interrogative engine: it ingests multiple independent URLs, highlights conflicting data points, generates devil’s advocate counter-questions, and provides verifiable citation lineage.',
    },
    {
      question: 'Where is the Gemini API integrated and how are API keys protected?',
      answer:
        'All AI communications occur server-side inside the Node.js/Express backend. Client browsers never possess or expose the GEMINI_API_KEY. The modular geminiService handles structured prompt compilation, token budgeting, and JSON schema parsing.',
    },
    {
      question: 'What does Phase 1 include?',
      answer:
        'Phase 1 delivers the full responsive dark-mode web application, 3D rotating Earth hero section, comprehensive multi-input research intake form, backend Express API with health check (GET /api/health), source URL validation pipeline, and modular Gemini scaffolding.',
    },
    {
      question: 'How do I run the project locally?',
      answer:
        'In the backend folder, configure your .env file and run "npm run dev". In the frontend folder, run "npm run dev". The Vite dev server will proxy API calls directly to the Express server running on port 5000.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#050A12] border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Questions & Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Everything you need to know about NIRNAYA AI's architecture, methodology, and vision.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0B1526]/80 border border-slate-800 transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-white flex items-center space-x-3">
                    <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-sky-400 transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 text-left">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

