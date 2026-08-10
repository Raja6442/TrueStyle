import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, Lock, Key, EyeOff } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white tracking-tight font-mono">
          Privacy Policy
        </h1>
        <p className="mt-2 text-gray-500 text-xs font-mono">Effective Date: July 28, 2026</p>
      </div>

      <GlassCard hoverable={false} className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Lock className="w-5 h-5 text-cyber-blue-500 mr-2" />
            1. Cryptographic Security Standards
          </h2>
          <p>
            At TrueStyle, privacy is treated as a core security vector. All transaction data, user authentication records, and product scan audits are encrypted in transit using TLS 1.3 and at rest using AES-256 standard encryption keys.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Key className="w-5 h-5 text-cyber-blue-500 mr-2" />
            2. Collected Datasets & Audit Trails
          </h2>
          <p>
            When utilizing TrueStyle, we capture specific diagnostic metrics to evaluate counterfeit status, including:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4 text-xs text-gray-400">
            <li>Account credentials (Full name, Email address, JWT login details)</li>
            <li>E-commerce submission tokens (Scanned URLs, merchant names, pricing logs)</li>
            <li>System access details (Secured audit logs, browser client parameters, and masked IP logs)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center">
            <EyeOff className="w-5 h-5 text-cyber-blue-500 mr-2" />
            3. Row-Level Database Security (RLS)
          </h2>
          <p>
            We implement strict PostgreSQL Row-Level Security (RLS) on Supabase. This ensures that your scan logs and account configurations are only visible to you. Administrative accounts have restricted elevated rights audited in immutable ledger logs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center">
            <ShieldCheck className="w-5 h-5 text-cyber-blue-500 mr-2" />
            4. User Autonomy & Deletion Rights
          </h2>
          <p>
            In compliance with international data regulations (GDPR, CCPA), users have full rights to request complete purging of their scan history and profiles. You may trigger account deletion in the Dashboard panel or by submitting a secure ticket.
          </p>
        </section>
      </GlassCard>
    </div>
  );
};
