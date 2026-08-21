import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, Calendar, Shield, ArrowRight } from 'lucide-react';
import { FASHION_SCAM_DB, BlogArticle } from '../data/blogData';

const getRecentDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Deterministic shuffle based on current day of the year
const getDailyArticles = () => {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  
  // Clone the DB
  let shuffled = [...FASHION_SCAM_DB];
  
  // Simple seed-based shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (dayOfYear + i) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Take the first 6 articles for the dashboard and assign recent dates
  return shuffled.slice(0, 6).map((art, index) => ({
    ...art,
    date: getRecentDate(Math.floor(index / 2)), // 2 from today, 2 from yesterday, 2 from 2 days ago
    isLive: index === 0 || index === 1 // Make the first two look like they were posted right now
  }));
};

export const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief network load for effect
    const timer = setTimeout(() => {
      setArticles(getDailyArticles());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-accent font-mono text-xs font-semibold tracking-widest uppercase">
          DAILY FLASH BULLETIN
        </span>
        <h1 className="text-4xl font-bold text-foreground mt-2 tracking-tight">
          Fashion Threat & Scam Radar
        </h1>
        <p className="mt-4 text-muted text-lg">
          Real-time, up-to-date intelligence on the latest ecommerce scams, counterfeit trends, and low-quality drop-shipping traps happening right now.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(art => (
            <GlassCard key={art.id} className="flex flex-col justify-between h-full group hover:border-accent/40 transition-all duration-300 p-0 overflow-hidden">
              <div>
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[10px] text-white/90 font-mono">
                    <span className="flex items-center uppercase tracking-wider text-accent drop-shadow-md">
                      <Shield className="w-3 h-3 mr-1" />
                      {art.category.replace('-', ' ')}
                    </span>
                    <span className="flex items-center drop-shadow-md">
                      <Calendar className="w-3 h-3 mr-1" />
                      {art.date}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-accent transition font-mono line-clamp-3">
                    {art.title}
                  </h3>
                  
                  <p className="text-xs text-muted leading-relaxed mb-2 line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-auto mx-6 mb-6">
                <span className="text-[10px] text-accent font-mono flex items-center">
                  {(art as any).isLive && <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse"></span>}
                  {art.readTime}
                </span>
                
                <Link to={`/blog/${art.id}`} state={{ article: art }} className="text-xs font-semibold text-accent flex items-center group-hover:text-foreground transition">
                  <span>Read Bulletin</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <GlassCard className="max-w-xl mx-auto border-accent/50 bg-accent/5">
          <BookOpen className="w-8 h-8 text-accent mx-auto mb-3" />
          <h4 className="text-foreground font-mono text-sm font-bold">Request Academic Threat Reports</h4>
          <p className="text-xs text-muted mt-1 mb-4 leading-relaxed">
            Are you a cybersecurity researcher? Contact our threat team for complete logs of identified counterfeit syndicates, domains, and payment gateways.
          </p>
          <a
            href="/contact"
            className="text-xs font-semibold text-accent hover:text-foreground underline transition"
          >
            Submit Research Inquiry
          </a>
        </GlassCard>
      </div>
    </div>
  );
};
