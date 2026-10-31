import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { UseCases } from './components/UseCases';
import { ResearchForm } from './components/ResearchForm';
import { About } from './components/About';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-[#050A12] text-slate-100 selection:bg-sky-500 selection:text-slate-950">
      {/* Fixed Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <UseCases />
        <ResearchForm />
        <About />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
