import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
          SERVICE TIERS
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 tracking-tight font-mono">
          Pricing Plans
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          Protect your inventory audits and online transactions with our responsive security modules.
        </p>

        {/* Switcher */}
        <div className="inline-flex items-center mt-8 p-1 bg-cyber-dark-card border border-cyber-dark-border rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
              billingCycle === 'monthly' ? 'bg-cyber-blue-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
              billingCycle === 'annual' ? 'bg-cyber-blue-700 text-white' : 'text-gray-400 hover:text-white'
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
              <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">Shield Core</h3>
              <p className="text-xs text-gray-500 mt-1">Essential verification protocols for everyday shoppers.</p>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-extrabold font-mono tracking-tight">$0</span>
                <span className="ml-1 text-sm font-semibold text-gray-500">/ forever</span>
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
                <li key={idx} className="flex items-start text-xs text-gray-400">
                  <Check className="w-4.5 h-4.5 text-cyber-blue-500 mr-2 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Link
            to="/register"
            className="w-full text-center py-2.5 rounded-lg border border-cyber-dark-border text-gray-300 hover:text-white hover:bg-cyber-dark-border text-xs font-semibold transition"
          >
            Deploy Free Core
          </Link>
        </GlassCard>

        {/* Premium Plan */}
        <GlassCard hoverable={true} className="relative flex flex-col justify-between border-cyber-blue-700 shadow-neon-blue">
          <div className="absolute -top-3.5 right-6 px-3 py-1 bg-cyber-blue-700 border border-cyber-blue-500 rounded-full text-[10px] font-bold text-white uppercase tracking-widest font-mono">
            RECOMMENDED
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide flex items-center">
                Shield Pro
                <ShieldCheck className="w-5 h-5 text-cyber-blue-500 ml-2 animate-pulse" />
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">Advanced threat engine scans for boutiques and curators.</p>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-extrabold font-mono tracking-tight">
                  {billingCycle === 'monthly' ? '$29' : '$23'}
                </span>
                <span className="ml-1 text-sm font-semibold text-gray-500">/ month</span>
              </div>
              {billingCycle === 'annual' && <span className="text-[10px] text-green-500 mt-1 font-mono block">Billed annually ($276)</span>}
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
                <li key={idx} className="flex items-start text-xs text-gray-300">
                  <Check className="w-4.5 h-4.5 text-cyber-blue-500 mr-2 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full text-center py-2.5 rounded-lg bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white text-xs font-semibold shadow-neon-blue transition"
          >
            Initialize Premium Shield
          </Link>
        </GlassCard>
      </div>

      <div className="text-center mt-12 text-xs text-gray-600 flex items-center justify-center space-x-2">
        <HelpCircle className="w-4 h-4 text-gray-700" />
        <span>All transactions processed via secure SSL and AES-256 gateways. Need custom enterprise volume? <Link to="/contact" className="text-cyber-blue-500 hover:underline">Contact sales</Link></span>
      </div>
    </div>
  );
};
