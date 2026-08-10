import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  ArrowRight, 
  Search, 
  UserCheck, 
  Fingerprint, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Lock,
  Zap,
  Star
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  
  // Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const workflowSteps = [
    {
      num: '01',
      title: 'Submit Spec Data',
      desc: 'Enter the e-commerce product URL or drag-n-drop an item snapshot in our Verification page.'
    },
    {
      num: '02',
      title: 'Execute Multi-Signal Audit',
      desc: 'Our engine evaluates Price ratios, Seller review history, Platform registry and Brand authorization rules.'
    },
    {
      num: '03',
      title: 'Consensus Decision Warning',
      desc: 'Receive immediate compliance rating. Export immutable security PDF reports for compliance logs.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Luxury Watch Collector',
      text: 'TrueStyle flagged a Rolex listing on a lookalike domain within 3 seconds. The seller had zero ratings on an obfuscated Russian domain. Saved me $8,000!',
      rating: 5
    },
    {
      name: 'Marcus G.',
      role: 'Boutique Reseller Owner',
      text: 'Our curators run every URL scan through TrueStyle prior to wholesale procurement. The 2-signal voting logic prevents false positives and ensures accuracy.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'How does the 2-signal consensus logic minimize false alarms?',
      a: 'If a brand runs an authentic steep discount (e.g. Nike official clearance), only the price signal flags suspicion. Since the other variables (official domain, certified seller) are safe, the platform marks the item as Safe. A counterfeit warning only issues when two or more vectors fail validation.'
    },
    {
      q: 'Does TrueStyle support image visual audits?',
      a: 'Yes, users can upload snapshot files of fashion tags and material quality which are indexed alongside seller reviews and prices for high-precision evaluations.'
    },
    {
      q: 'How do I upgrade to the premium scanner tool?',
      a: 'Create a free secure credentials account, head to your dashboard settings tab, and deploy the Shield Pro plan to unlock unlimited scans and PDF reports.'
    }
  ];

  return (
    <div className="space-y-24 pb-20 select-none">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:py-32 cyber-grid">
        {/* Radial Blue Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-glow opacity-60 pointer-events-none rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Cyber Alert Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyber-blue-900/30 border border-cyber-blue-700/30 text-cyber-blue-400 text-xs font-mono font-medium animate-pulse">
            <Fingerprint className="w-4 h-4" />
            <span>AI-Driven Fashion Anti-Counterfeit Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none max-w-4xl mx-auto font-mono">
            Protect Online Fashion Shoppers From <span className="text-glow-blue text-cyber-blue-500">Counterfeits</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            TrueStyle deploys multi-vector threat calculations checking price discrepancies, domain registrations, and vendor reputational scores to identify replica items in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={user ? "/verify" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white font-semibold text-sm tracking-wider uppercase transition shadow-neon-blue flex items-center justify-center space-x-2"
            >
              <span>Scan Suspicious Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-cyber-dark-border text-gray-300 hover:text-white hover:bg-cyber-dark-border/40 text-sm font-semibold transition flex items-center justify-center"
            >
              Review Threat Engine
            </Link>
          </div>
        </div>

        {/* Floating Matrix animation */}
        <div className="max-w-4xl mx-auto px-4 mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-transparent z-10" />
          <GlassCard hoverable={false} className="border-cyber-blue-900/30 overflow-hidden relative p-1 pb-0 rounded-2xl">
            {/* Visual scan beam sweep */}
            <div className="absolute inset-x-0 h-0.5 bg-cyber-blue-500 shadow-[0_0_10px_#337cff] animate-scan z-20" />
            <div className="bg-[#050608] rounded-xl p-6 font-mono text-[10px] text-gray-500 space-y-2 h-64 overflow-hidden leading-relaxed text-left opacity-75 select-none">
              <div>[INFO] SECURE PORT HANDSHAKE INITIATED...</div>
              <div>[WHOIS] Domain: cheapguccibags.ru // Host Server Location: Moscow</div>
              <div>[WHOIS] Registration Created Date: 2026-07-25 (Age: 3 Days)</div>
              <div>[CHECK] Cross-Referencing price metrics: gg marmont retail price $2,100 vs offer $250.</div>
              <div className="text-yellow-500">[WARN] Price discount (88%) triggers high risk promotion parameters.</div>
              <div>[CHECK] Interrogating vendor reputation database for merchant "Cheap Luxury Steals"</div>
              <div className="text-yellow-500">[WARN] Seller trust database contains zero verified ratings. Rating: 1.2/5</div>
              <div>[CHECK] Verifying Brand distribution license check for Gucci.</div>
              <div className="text-red-500">[CRITICAL] Gucci products are restricted to verified brand portals. Domain unauthorized.</div>
              <div className="text-red-500 font-bold animate-pulse">[ALERT] 3 SUSPICIOUS VECTORS CONFIRMED // VOTE: HIGH RISK COUNTERFEIT.</div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
            ACTIVE SHIELD VECTORS
          </span>
          <h2 className="text-3xl font-bold text-white mt-1 tracking-tight">
            Comprehensive Verification Framework
          </h2>
          <p className="text-xs text-gray-500 mt-2">Our scanner evaluates multiple vectors simultaneously for high-precision validation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard>
            <Cpu className="w-8 h-8 text-cyber-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-white font-mono uppercase">Price Risk Analytics</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Detects extreme discounts that violate official luxury brand pricing rules and wholesale guidelines.
            </p>
          </GlassCard>

          <GlassCard>
            <UserCheck className="w-8 h-8 text-cyber-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-white font-mono uppercase">Seller Trust Score</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Inspects ratings, customer complaints, and transaction volume to filter newly created scam vendor accounts.
            </p>
          </GlassCard>

          <GlassCard>
            <ShieldCheck className="w-8 h-8 text-cyber-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-white font-mono uppercase">Platform Auditing</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Audits Top-Level Domains, registration age, typosquatting variants, and brand domains lists.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Workflow Steps Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
            CORE TIMELINE
          </span>
          <h2 className="text-3xl font-bold text-white mt-1 tracking-tight">
            How TrueStyle Protects You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {workflowSteps.map((step, idx) => (
            <GlassCard key={idx} className="relative flex flex-col justify-between p-6">
              <div>
                <span className="text-4xl font-extrabold text-cyber-blue-900/60 font-mono block mb-4">{step.num}</span>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
            AUDIT FEEDBACK
          </span>
          <h2 className="text-3xl font-bold text-white mt-1 tracking-tight">
            Trusted by Collectors & Curators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <GlassCard key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex space-x-1 mb-4 select-none">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-cyber-blue-500 fill-cyber-blue-500" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 italic leading-relaxed">"{t.text}"</p>
              </div>
              <div className="mt-4 border-t border-cyber-dark-border pt-3 select-none">
                <span className="block text-xs font-bold text-white">{t.name}</span>
                <span className="block text-[10px] text-gray-500 mt-0.5">{t.role}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Accordion FAQs */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8 text-center font-mono select-none">
          Frequently Answered Inquiries
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <GlassCard key={idx} hoverable={false} className="p-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left select-none"
                >
                  <span className="text-xs font-bold text-white flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-cyber-blue-500" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {isOpen && (
                  <p className="mt-3 pl-6 border-l border-cyber-blue-900 text-[11px] text-gray-400 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
};
