import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Tag, UserCheck, Globe, ShieldAlert, Award, FileText } from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
          DETECTION SUITE
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 tracking-tight">
          Verify Features
        </h1>
        <p className="mt-4 text-gray-400 text-lg leading-relaxed">
          TrueStyle operates on a distributed threat engine that inspects transactions from four primary dimensions, generating instant verification reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature 1 */}
        <GlassCard>
          <div className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-3 rounded-xl border border-cyber-blue-700/30 shrink-0">
              <Tag className="w-6 h-6 text-cyber-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Price Risk Indexing</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Scans pricing matrices to identify deviations from typical MSRP retail thresholds. By modeling seasonal sales averages, it detects discounts (e.g. 70%+) that are commercially impossible for authentic luxury distribution.
              </p>
              <span className="text-xs font-semibold text-cyber-blue-500 font-mono bg-cyber-blue-900/20 px-2.5 py-1 rounded">
                Active Heuristic Vector
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Feature 2 */}
        <GlassCard>
          <div className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-3 rounded-xl border border-cyber-blue-700/30 shrink-0">
              <UserCheck className="w-6 h-6 text-cyber-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Seller Reputation Profiling</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Interrogates seller profiles, indexing ratings, transaction volume, and review history. Unveils "sleeper stores" and newly created seller profiles with zero ratings that flood marketplaces with replica inventory.
              </p>
              <span className="text-xs font-semibold text-cyber-blue-500 font-mono bg-cyber-blue-900/20 px-2.5 py-1 rounded">
                Trust Database Mapping
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Feature 3 */}
        <GlassCard>
          <div className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-3 rounded-xl border border-cyber-blue-700/30 shrink-0">
              <Globe className="w-6 h-6 text-cyber-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Platform Registry Auditing</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Validates e-commerce domains, SSL profiles, hosting registers, and Top-Level Domains. Discovers typosquatting attempts (e.g. `guccl.com`) and suspicious domain endings (e.g. `.ru`, `.xyz`) designed to impersonate brands.
              </p>
              <span className="text-xs font-semibold text-cyber-blue-500 font-mono bg-cyber-blue-900/20 px-2.5 py-1 rounded">
                Domain Registry Lookups
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Feature 4 */}
        <GlassCard>
          <div className="flex items-start space-x-4">
            <div className="bg-cyber-blue-700/20 p-3 rounded-xl border border-cyber-blue-700/30 shrink-0">
              <Award className="w-6 h-6 text-cyber-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Brand Supply Chain Checks</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Evaluates the authorization level of the domain for the specific brand. Checks whether a luxury brand allows its products to be sold via open marketplaces, preventing users from falling for high-quality clones.
              </p>
              <span className="text-xs font-semibold text-cyber-blue-500 font-mono bg-cyber-blue-900/20 px-2.5 py-1 rounded">
                Supply Chain Auditing
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Workflow Showcase */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-white mb-12 text-center font-mono">
          Security Consensus Decision Logic
        </h2>
        <GlassCard className="max-w-4xl mx-auto border-dashed border-cyber-blue-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
            <div className="text-center md:text-left md:max-w-md">
              <h4 className="text-lg font-bold text-white mb-2 flex items-center justify-center md:justify-start">
                <ShieldAlert className="w-5 h-5 mr-2 text-cyber-blue-500" />
                Multi-Signal Voting Protocol
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                To prevent false positives, TrueStyle employs a consensus-based decision model. A **High Risk Warning Alert** is only generated when **two or more** metrics are determined suspicious. Single deviations (e.g., an authentic seasonal clearance sale on an official domain) are marked as **Safe**.
              </p>
            </div>
            <div className="flex space-x-4 items-center bg-cyber-dark-bg p-4 rounded-xl border border-cyber-dark-border select-none">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-red-950 text-red-400 flex items-center justify-center text-xs font-mono font-bold">2+</div>
                <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Flagged</span>
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
