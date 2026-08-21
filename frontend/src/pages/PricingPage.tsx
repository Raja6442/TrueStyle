import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PaymentModal } from '../components/PaymentModal';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-accent font-mono text-xs font-semibold tracking-widest uppercase">
          SERVICE TIERS
        </span>
        <h1 className="text-4xl font-bold text-foreground mt-2 tracking-tight font-mono">
          Pricing Plans
        </h1>
        <p className="mt-4 text-muted text-lg">
          Protect your inventory audits and online transactions with our responsive security modules.
        </p>

        {/* Switcher */}
        <div className="inline-flex items-center mt-8 p-1 bg-card border border-border rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
              billingCycle === 'monthly' ? 'bg-accent text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
              billingCycle === 'annual' ? 'bg-accent text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            Annual (-20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <GlassCard hoverable={true} className="flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground font-mono uppercase tracking-wide">True Core</h3>
              <p className="text-xs text-muted mt-1">Essential verification protocols for everyday shoppers.</p>
              <div className="mt-4 flex items-baseline text-foreground">
                <span className="text-4xl font-extrabold font-mono tracking-tight">₹0</span>
                <span className="ml-1 text-sm font-semibold text-muted">/ forever</span>
              </div>
            </div>
            
            <ul className="space-y-3.5 mb-8">
              {[
                '5 multi-signal scans per month',
                'Basic price risk analytics',
                'Global brand registry search',
                'Community FAQ access',
                'Light / Dark theme dashboard'
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs text-muted">
                  <Check className="w-4.5 h-4.5 text-accent mr-2 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Link
            to="/register"
            className="w-full text-center py-2.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-border text-xs font-semibold transition"
          >
            Deploy Free Core
          </Link>
        </GlassCard>

        {/* Premium Plan */}
        <GlassCard hoverable={true} className="relative flex flex-col justify-between border-accent shadow-neon-blue">
          <div className="absolute -top-3.5 right-6 px-3 py-1 bg-accent border border-accent rounded-full text-[10px] font-bold text-foreground uppercase tracking-widest font-mono">
            RECOMMENDED
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground font-mono uppercase tracking-wide flex items-center">
                True Pro
                <ShieldCheck className="w-5 h-5 text-accent ml-2 animate-pulse" />
              </h3>
              <p className="text-xs text-muted mt-1 font-mono">Advanced threat engine scans for boutiques and curators.</p>
              <div className="mt-4 flex items-baseline text-foreground">
                <span className="text-4xl font-extrabold font-mono tracking-tight">
                  {billingCycle === 'monthly' ? '₹99' : '₹79'}
                </span>
                <span className="ml-1 text-sm font-semibold text-muted">/ month</span>
              </div>
              {billingCycle === 'annual' && <span className="text-[10px] text-green-500 mt-1 font-mono block">Billed annually (₹948)</span>}
            </div>

            <ul className="space-y-3.5 mb-8">
              {[
                'Unlimited multi-signal AI scans',
                'Deep domain registry TLD checking',
                'Export PDF compliance scan reports',
                'Instant Email OTP and SMS notifications',
                'Add unlimited bookmark assets & custom brands',
                '24/7 dedicated support ticket response SLA',
                'API endpoints for automated platform verification'
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs text-muted">
                  <Check className="w-4.5 h-4.5 text-accent mr-2 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full text-center py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-foreground text-xs font-bold shadow-neon-blue transition"
          >
            Deploy True Pro
          </button>
        </GlassCard>
      </div>

      <div className="text-center mt-12 text-xs text-gray-600 flex items-center justify-center space-x-2">
        <HelpCircle className="w-4 h-4 text-gray-700" />
        <span>All transactions processed via secure SSL and AES-256 gateways. Need custom enterprise volume? <Link to="/contact" className="text-accent hover:underline">Contact sales</Link></span>
      </div>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName="True Pro"
        price={billingCycle === 'monthly' ? 99 : 948}
        billingCycle={billingCycle}
      />
    </div>
  );
};
