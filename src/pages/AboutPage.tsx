import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, Cpu, Database, Eye } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
          SECURE ORIGINS
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 tracking-tight">
          About True<span className="text-cyber-blue-500">Style</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg leading-relaxed">
          TrueStyle was born from the intersection of luxury commerce and modern digital forensics. We apply enterprise-grade threat modeling and multi-signal AI diagnostics to verify product integrity in the e-commerce supply chain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <GlassCard>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-cyber-blue-700/20 p-3 rounded-xl border border-cyber-blue-700/30">
              <ShieldCheck className="w-6 h-6 text-cyber-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Our Mission</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every year, counterfeit fashion transactions drain billions from the global economy, funding illicit syndicates and deceiving buyers. TrueStyle aims to put a cybersecurity-grade scanner in the pocket of every online fashion shopper. By checking URLs, price discrepancies, and seller ratings, we empower consumers with instant, reliable data.
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-cyber-blue-700/20 p-3 rounded-xl border border-cyber-blue-700/30">
              <Cpu className="w-6 h-6 text-cyber-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Technology Paradigm</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Rather than relying solely on visual inspectability, our scan engine runs multi-vector checks. We crawl domain registries, analyze historical pricing distributions, index user ratings, and check verified brand distribution lists. If a merchant operates on questionable servers or breaks wholesale pricing agreements, our neural threat models immediately identify the anomaly.
          </p>
        </GlassCard>
      </div>

      {/* Pillars of TrueStyle */}
      <h2 className="text-2xl font-bold text-white mb-8 text-center font-mono">
        The Four Pillars of Digital Verification
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: 'Multi-Signal Heuristics',
            desc: 'We cross-reference price, seller credentials, and registry status before issuing an alert.'
          },
          {
            icon: Database,
            title: 'Trusted Vendor Registry',
            desc: 'A crowd-vetted and admin-curated database tracking registered sellers and brand channels.'
          },
          {
            icon: Eye,
            title: 'Real-Time Scraping',
            desc: 'Extracting metadata, reviews, and domain parameters instantly upon query submission.'
          },
          {
            icon: Cpu,
            title: 'Role-Based Supervision',
            desc: 'Ensuring data integrity through a ledger monitored by certified cybersecurity administrators.'
          }
        ].map((item, idx) => (
          <GlassCard key={idx} hoverable={true} className="flex flex-col items-center text-center">
            <div className="bg-cyber-dark-bg p-3 rounded-full mb-4 border border-cyber-dark-border">
              <item.icon className="w-5 h-5 text-cyber-blue-500" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
