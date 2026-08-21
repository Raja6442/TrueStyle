import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Tag, UserCheck, Globe, ShieldAlert, Award, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Tool 1: Price Risk
  const [msrp, setMsrp] = useState('');
  const [price, setPrice] = useState('');
  
  // Tool 2: Seller Rep
  const [sellerName, setSellerName] = useState('');
  const [sellerResult, setSellerResult] = useState<'none' | 'good' | 'bad'>('none');

  // Tool 3: Registry
  const [domain, setDomain] = useState('');
  const [domainResult, setDomainResult] = useState<'none' | 'good' | 'bad'>('none');

  // Tool 4: Supply Chain
  const [brand, setBrand] = useState('Gucci');
  const [brandResult, setBrandResult] = useState<'none' | 'open' | 'closed'>('none');

  const toggleCard = (idx: number) => {
    setActiveCard(activeCard === idx ? null : idx);
  };

  const handleSellerCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName) return;
    if (sellerName.toLowerCase().includes('official') || sellerName.toLowerCase().includes('verified')) {
      setSellerResult('good');
    } else {
      setSellerResult('bad');
    }
  };

  const handleDomainCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    if (domain.endsWith('.com') && !domain.includes('0') && !domain.includes('l')) {
      setDomainResult('good');
    } else {
      setDomainResult('bad');
    }
  };

  const handleBrandCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand === 'Gucci' || brand === 'Rolex' || brand === 'Louis Vuitton') {
      setBrandResult('closed');
    } else {
      setBrandResult('open');
    }
  };

  // Price Logic
  const msrpVal = parseFloat(msrp) || 0;
  const priceVal = parseFloat(price) || 0;
  const discount = msrpVal > 0 ? ((msrpVal - priceVal) / msrpVal) * 100 : 0;
  const isHighRiskPrice = discount > 70;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-accent font-mono text-xs font-semibold tracking-widest uppercase">
          DETECTION SUITE
        </span>
        <h1 className="text-4xl font-bold text-foreground mt-2 tracking-tight">
          Verify Features
        </h1>
        <p className="mt-4 text-muted text-lg leading-relaxed">
          TrueStyle operates on a distributed threat engine that inspects transactions from four primary dimensions. Click any feature below to test the engine!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature 1 */}
        <GlassCard hoverable={true} className="cursor-pointer transition-all duration-300" onClick={() => toggleCard(1)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-accent/20 p-3 rounded-xl border border-accent/30 shrink-0">
                <Tag className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Price Risk Indexing</h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  Scans pricing matrices to identify deviations from typical MSRP retail thresholds. By modeling seasonal sales averages, it detects discounts (e.g. 70%+) that are commercially impossible for authentic luxury distribution.
                </p>
                <span className="text-xs font-semibold text-accent font-mono bg-accent/20 px-2.5 py-1 rounded">
                  Active Heuristic Vector
                </span>
              </div>
            </div>
            {activeCard === 1 ? <ChevronUp className="w-5 h-5 text-muted shrink-0 mt-2" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0 mt-2" />}
          </div>
          
          {activeCard === 1 && (
            <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
              <h4 className="text-sm font-bold text-foreground mb-4">Test the Engine</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">MSRP (₹)</label>
                  <input type="number" value={msrp} onChange={e => setMsrp(e.target.value)} placeholder="10000" className="w-full glass-input px-3 py-2 rounded-lg text-sm text-foreground bg-black/40 border-border focus:ring-1 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Selling Price (₹)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="2000" className="w-full glass-input px-3 py-2 rounded-lg text-sm text-foreground bg-black/40 border-border focus:ring-1 focus:ring-accent outline-none" />
                </div>
              </div>
              
              {(msrpVal > 0 && priceVal > 0) && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${isHighRiskPrice ? 'bg-red-950/30 border border-red-900/50 text-red-400' : 'bg-green-950/30 border border-green-900/50 text-green-400'}`}>
                  {isHighRiskPrice ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <div>
                    <div className="text-sm font-bold">{Math.round(discount)}% Discount Detected</div>
                    <div className="text-xs opacity-80">{isHighRiskPrice ? 'High Risk: Commercially Impossible.' : 'Safe: Within normal retail thresholds.'}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* Feature 2 */}
        <GlassCard hoverable={true} className="cursor-pointer transition-all duration-300" onClick={() => toggleCard(2)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-accent/20 p-3 rounded-xl border border-accent/30 shrink-0">
                <UserCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Seller Reputation Profiling</h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  Interrogates seller profiles, indexing ratings, transaction volume, and review history. Unveils "sleeper stores" and newly created seller profiles with zero ratings that flood marketplaces with replica inventory.
                </p>
                <span className="text-xs font-semibold text-accent font-mono bg-accent/20 px-2.5 py-1 rounded">
                  Trust Database Mapping
                </span>
              </div>
            </div>
            {activeCard === 2 ? <ChevronUp className="w-5 h-5 text-muted shrink-0 mt-2" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0 mt-2" />}
          </div>

          {activeCard === 2 && (
            <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
              <h4 className="text-sm font-bold text-foreground mb-4">Search Trust Database</h4>
              <form onSubmit={handleSellerCheck} className="flex gap-2 mb-4">
                <input type="text" value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="e.g., 'Official Nike' or 'SneakerZ123'" className="flex-1 glass-input px-3 py-2 rounded-lg text-sm text-foreground bg-black/40 border-border focus:ring-1 focus:ring-accent outline-none" />
                <button type="submit" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition"><Search className="w-4 h-4" /></button>
              </form>

              {sellerResult !== 'none' && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${sellerResult === 'bad' ? 'bg-red-950/30 border border-red-900/50 text-red-400' : 'bg-green-950/30 border border-green-900/50 text-green-400'}`}>
                  {sellerResult === 'bad' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <div>
                    <div className="text-sm font-bold">{sellerResult === 'bad' ? 'Sleeper Store Warning' : 'Verified Seller'}</div>
                    <div className="text-xs opacity-80">{sellerResult === 'bad' ? 'Store is newly created with no transaction history.' : 'Seller has established trust metrics.'}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* Feature 3 */}
        <GlassCard hoverable={true} className="cursor-pointer transition-all duration-300" onClick={() => toggleCard(3)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-accent/20 p-3 rounded-xl border border-accent/30 shrink-0">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Platform Registry Auditing</h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  Validates e-commerce domains, SSL profiles, hosting registers, and Top-Level Domains. Discovers typosquatting attempts (e.g. `guccl.com`) and suspicious domain endings (e.g. `.ru`, `.xyz`) designed to impersonate brands.
                </p>
                <span className="text-xs font-semibold text-accent font-mono bg-accent/20 px-2.5 py-1 rounded">
                  Domain Registry Lookups
                </span>
              </div>
            </div>
            {activeCard === 3 ? <ChevronUp className="w-5 h-5 text-muted shrink-0 mt-2" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0 mt-2" />}
          </div>

          {activeCard === 3 && (
            <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
              <h4 className="text-sm font-bold text-foreground mb-4">Run DNS Lookup</h4>
              <form onSubmit={handleDomainCheck} className="flex gap-2 mb-4">
                <input type="text" value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g., 'amazon.com' or 'guccl.ru'" className="flex-1 glass-input px-3 py-2 rounded-lg text-sm text-foreground bg-black/40 border-border focus:ring-1 focus:ring-accent outline-none" />
                <button type="submit" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition"><Search className="w-4 h-4" /></button>
              </form>

              {domainResult !== 'none' && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${domainResult === 'bad' ? 'bg-red-950/30 border border-red-900/50 text-red-400' : 'bg-green-950/30 border border-green-900/50 text-green-400'}`}>
                  {domainResult === 'bad' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <div>
                    <div className="text-sm font-bold">{domainResult === 'bad' ? 'Suspicious Registry Detected' : 'Verified SSL Profile'}</div>
                    <div className="text-xs opacity-80">{domainResult === 'bad' ? 'Domain displays typosquatting or offshore hosting markers.' : 'Domain is officially registered and secured.'}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* Feature 4 */}
        <GlassCard hoverable={true} className="cursor-pointer transition-all duration-300" onClick={() => toggleCard(4)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-accent/20 p-3 rounded-xl border border-accent/30 shrink-0">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Brand Supply Chain Checks</h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  Evaluates the authorization level of the domain for the specific brand. Checks whether a luxury brand allows its products to be sold via open marketplaces, preventing users from falling for high-quality clones.
                </p>
                <span className="text-xs font-semibold text-accent font-mono bg-accent/20 px-2.5 py-1 rounded">
                  Supply Chain Auditing
                </span>
              </div>
            </div>
            {activeCard === 4 ? <ChevronUp className="w-5 h-5 text-muted shrink-0 mt-2" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0 mt-2" />}
          </div>

          {activeCard === 4 && (
            <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
              <h4 className="text-sm font-bold text-foreground mb-4">Query Authorization Ledger</h4>
              <form onSubmit={handleBrandCheck} className="flex gap-2 mb-4">
                <select value={brand} onChange={e => setBrand(e.target.value)} className="flex-1 glass-input px-3 py-2 rounded-lg text-sm text-foreground bg-black/40 border-border focus:ring-1 focus:ring-accent outline-none">
                  <option value="Gucci">Gucci</option>
                  <option value="Louis Vuitton">Louis Vuitton</option>
                  <option value="Rolex">Rolex</option>
                  <option value="Nike">Nike</option>
                  <option value="Adidas">Adidas</option>
                </select>
                <button type="submit" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition"><Search className="w-4 h-4" /></button>
              </form>

              {brandResult !== 'none' && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${brandResult === 'closed' ? 'bg-red-950/30 border border-red-900/50 text-red-400' : 'bg-green-950/30 border border-green-900/50 text-green-400'}`}>
                  {brandResult === 'closed' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <div>
                    <div className="text-sm font-bold">{brandResult === 'closed' ? 'Closed Ecosystem' : 'Open Retail Permitted'}</div>
                    <div className="text-xs opacity-80">{brandResult === 'closed' ? `${brand} strictly forbids sales on open 3rd-party marketplaces.` : `${brand} allows distribution via authorized 3rd-party retailers.`}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Workflow Showcase */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground mb-12 text-center font-mono">
          Security Consensus Decision Logic
        </h2>
        <GlassCard className="max-w-4xl mx-auto border-dashed border-accent/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
            <div className="text-center md:text-left md:max-w-md">
              <h4 className="text-lg font-bold text-foreground mb-2 flex items-center justify-center md:justify-start">
                <ShieldAlert className="w-5 h-5 mr-2 text-accent" />
                Multi-Signal Voting Protocol
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                To prevent false positives, TrueStyle employs a consensus-based decision model. A **High Risk Warning Alert** is only generated when **two or more** metrics are determined suspicious. Single deviations (e.g., an authentic seasonal clearance sale on an official domain) are marked as **Safe**.
              </p>
            </div>
            <div className="flex space-x-4 items-center bg-cyber-dark-bg p-4 rounded-xl border border-border select-none">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-red-950 text-red-400 flex items-center justify-center text-xs font-mono font-bold">2+</div>
                <span className="text-[10px] text-muted mt-1 uppercase tracking-wider">Flagged</span>
              </div>
              <div className="text-gray-600 font-mono">→</div>
              <div className="px-3 py-1.5 rounded bg-red-950/30 border border-red-900/30 text-xs text-red-400 font-bold uppercase tracking-wider">
                Counterfeit Alert
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
