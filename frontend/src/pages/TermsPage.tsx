import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground tracking-tight font-mono">
          Terms of Service
        </h1>
        <p className="mt-2 text-muted text-xs font-mono">Last Updated: July 28, 2026</p>
      </div>

      <GlassCard hoverable={false} className="space-y-6 text-sm text-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center">
            <Scale className="w-5 h-5 text-accent mr-2" />
            1. User Engagement Covenant
          </h2>
          <p>
            By accessing the TrueStyle website and signing up for an account, you agree to comply with our security covenants, terms, and conditions. These terms govern the use of our product validation tools, dashboard panels, and API connectors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center">
            <CheckCircle2 className="w-5 h-5 text-accent mr-2" />
            2. Scanning & Rate Limits
          </h2>
          <p>
            Users are granted permissions to submit product URLs and seller metadata under fair-use guidelines. Automated script crawling, DDoS testing, or spamming queries to our scan engine will result in instantaneous API rate-limiting or firewall blocklistings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center">
            <AlertTriangle className="w-5 h-5 text-accent mr-2" />
            3. Disclaimer of Liability
          </h2>
          <p>
            TrueStyle provides automated heuristic warnings based on multi-signal calculations. Risk scores and counterfeit determinations represent statistical probabilities and do not constitute absolute legal claims of brand authenticity. Users must use their own discretion when finalizing transactions.
          </p>
        </section>
      </GlassCard>
    </div>
  );
};
