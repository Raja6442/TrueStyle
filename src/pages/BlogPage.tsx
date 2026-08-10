import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, Calendar, Shield, ArrowRight } from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'threat-intel' | 'cybersec' | 'guides';
}

const ARTICLES: BlogArticle[] = [
  {
    id: 'art-1',
    title: 'Anatomy of Typosquatting Luxury Brands: The .xyz Network',
    excerpt: 'How botnets registry spoofing domains copy brand styles to siphon credit card data and distribute AAA grade replicas.',
    date: 'July 26, 2026',
    readTime: '6 min read',
    category: 'threat-intel'
  },
  {
    id: 'art-2',
    title: 'Why SSL Locks Mean Nothing: Certificate Hijacking in Fake E-Commerce',
    excerpt: 'An investigation into how fraudulent shop templates secure automated Let\'s Encrypt certificates to gain shopper confidence.',
    date: 'July 18, 2026',
    readTime: '8 min read',
    category: 'cybersec'
  },
  {
    id: 'art-3',
    title: 'The Multi-Signal Rule: Reducing False Positives in Counterfeit Audits',
    excerpt: 'Technical brief describing why single-signal models fail and how TrueStyle applies a 2-signal minimum consensus voting protocol.',
    date: 'July 05, 2026',
    readTime: '4 min read',
    category: 'guides'
  }
];

export const BlogPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
          INTELLIGENCE FEED
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 tracking-tight">
          Security Blog & Threat Bulletins
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          Stay informed with research, reports, and threat modeling from the TrueStyle cybersecurity team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTICLES.map(art => (
          <GlassCard key={art.id} className="flex flex-col justify-between h-full group hover:border-cyber-blue-500/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mb-4">
                <span className="flex items-center uppercase tracking-wider text-cyber-blue-400">
                  <Shield className="w-3 h-3 mr-1" />
                  {art.category.replace('-', ' ')}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {art.date}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyber-blue-400 transition font-mono">
                {art.title}
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                {art.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-cyber-dark-border pt-4 mt-auto">
              <span className="text-[10px] text-gray-500 font-mono">{art.readTime}</span>
              <button className="text-xs font-semibold text-cyber-blue-400 flex items-center group-hover:text-white transition">
                <span>View Bulletin</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-16 text-center">
        <GlassCard className="max-w-xl mx-auto border-cyber-blue-900/50 bg-cyber-blue-950/5">
          <BookOpen className="w-8 h-8 text-cyber-blue-500 mx-auto mb-3" />
          <h4 className="text-white font-mono text-sm font-bold">Request Academic Threat Reports</h4>
          <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
            Are you a cybersecurity researcher? Contact our threat team for complete logs of identified counterfeit syndicates, domains, and payment gateways.
          </p>
          <a
            href="/contact"
            className="text-xs font-semibold text-cyber-blue-400 hover:text-white underline transition"
          >
            Submit Research Inquiry
          </a>
        </GlassCard>
      </div>
    </div>
  );
};
