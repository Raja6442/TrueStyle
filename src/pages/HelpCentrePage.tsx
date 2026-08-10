import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Search, HelpCircle, ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  q: string;
  a: string;
  cat: 'scanner' | 'account' | 'billing';
}

const FAQS: FAQItem[] = [
  {
    q: 'How does TrueStyle calculate counterfeit risk scores?',
    a: 'We monitor four risk parameters: Price Risk, Seller reputation, Platform domain verification, and Brand distribution limits. A counterfeit warning is triggered if and only if two or more vectors return suspicious values.',
    cat: 'scanner'
  },
  {
    q: 'Why did my scanned product get marked "Safe" despite having a steep discount?',
    a: 'Under our Multi-Signal Voting logic, a single suspicious parameter (like a discount) is not enough to issue a high risk alert if the seller and domain are official verified channels (e.g. Nike official clearance event).',
    cat: 'scanner'
  },
  {
    q: 'What should I do if my OTP email verification is slow to arrive?',
    a: 'In mock-fallback mode, your verification code is displayed directly on your screen upon registration for instant authentication. For live Supabase projects, check your spam filter or request a new code.',
    cat: 'account'
  },
  {
    q: 'Can I add custom brands to the official brand list?',
    a: 'Administrators can log in to the Admin Terminal and add new entries to the official brands registry, updating authorized domain lists globally.',
    cat: 'account'
  },
  {
    q: 'How do I cancel my Premium subscription?',
    a: 'You can manage, upgrade, or toggle billing configurations inside the User Preferences page on your dashboard.',
    cat: 'billing'
  }
];

export const HelpCentrePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'scanner' | 'account' | 'billing'>('all');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || 
                          faq.a.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || faq.cat === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
          SUPPORT TERMINAL
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 tracking-tight">
          Help Centre
        </h1>
        <p className="mt-4 text-gray-400 text-sm">
          Search our knowledge base for platform documentation, scanning parameters, and security policies.
        </p>
        
        {/* Search Input */}
        <div className="relative max-w-lg mx-auto mt-8">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search credentials, scan rules, OTP guides..."
            className="w-full pl-10 pr-4 py-3 bg-cyber-dark-card border border-cyber-dark-border text-xs rounded-xl text-white focus:outline-none focus:border-cyber-blue-500 focus:ring-1 focus:ring-cyber-blue-500 transition"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 justify-center mb-8">
        {(['all', 'scanner', 'account', 'billing'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
              selectedCat === cat 
                ? 'bg-cyber-blue-700 text-white' 
                : 'bg-cyber-dark-card text-gray-400 border border-cyber-dark-border hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const globalIdx = FAQS.indexOf(faq);
            const isExpanded = expandedIdx === globalIdx;
            
            return (
              <GlassCard key={globalIdx} hoverable={false} className="p-4">
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : globalIdx)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-white flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2 text-cyber-blue-500 shrink-0" />
                    {faq.q}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                
                {isExpanded && (
                  <div className="mt-3 pl-6 border-l border-cyber-blue-900 text-xs text-gray-400 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </GlassCard>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 text-xs">
            No matching security articles found. Try searching for 'OTP', 'Price', or 'Seller'.
          </div>
        )}
      </div>

      <div className="text-center mt-12 bg-cyber-dark-card/50 p-6 rounded-xl border border-cyber-dark-border">
        <h4 className="text-white font-bold text-sm">Still have questions?</h4>
        <p className="text-xs text-gray-500 mt-1 mb-4">Submit a help ticket directly to our security engineers.</p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyber-blue-900/30 text-cyber-blue-400 hover:bg-cyber-blue-800/40 border border-cyber-blue-700/30 text-xs font-semibold transition"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Open Ticket Terminal</span>
        </Link>
      </div>
    </div>
  );
};
