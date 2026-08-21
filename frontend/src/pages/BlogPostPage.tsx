import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { FASHION_SCAM_DB, BlogArticle } from '../data/blogData';

// Generate dynamic recent dates to match BlogPage
const getRecentDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    // First try to load from navigation state (it will have the dynamically assigned dates and 'isLive' flag)
    if (location.state && location.state.article) {
      setArticle(location.state.article);
    } 
    // Fallback to static database search
    else if (id) {
      const found = FASHION_SCAM_DB.find(a => a.id === id);
      if (found) {
        // Assign a default date if loaded directly
        setArticle({ ...found, date: getRecentDate(0) });
      } else {
        navigate('/blog');
      }
    } else {
      navigate('/blog');
    }
  }, [id, navigate, location.state]);

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Back Button */}
      <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-muted hover:text-accent transition mb-12">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bulletins
      </Link>

      {/* Hero Section */}
      <div className="mb-16 text-center sm:text-left">
        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold tracking-widest uppercase mb-6">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-muted">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 opacity-70" />
            {article.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 opacity-70" />
            {article.readTime}
          </div>
          {article.isLive && (
            <div className="flex items-center text-accent animate-pulse font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5"></span>
              Live External Feed
            </div>
          )}
        </div>
      </div>

      {/* Content Rendering */}
      <GlassCard className="p-8 sm:p-12 mb-12 shadow-[0_0_50px_rgba(0,67,189,0.1)] overflow-hidden">
        {article.isLive ? (
          // Render Live HTML from RSS
          <div 
            className="prose prose-invert prose-accent max-w-none text-lg text-muted/90
                       prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
                       prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-xl prose-img:shadow-neon-blue prose-img:my-8 prose-img:w-full prose-img:object-cover
                       prose-p:leading-relaxed prose-p:mb-6"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }} 
          />
        ) : (
          // Render Static Block Arrays
          <div className="space-y-8">
            {article.content.map((block: any, idx: number) => {
              if (block.type === 'image') {
                return (
                  <div key={idx} className="w-full my-8 rounded-2xl overflow-hidden border border-border shadow-neon-blue">
                    <img src={block.src} alt={block.alt} className="w-full h-auto object-cover max-h-[500px]" />
                  </div>
                );
              }
              if (block.type === 'heading') {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-foreground mt-12 mb-4">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-muted leading-relaxed text-lg">
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'alert') {
                const Icon = block.variant === 'danger' ? ShieldAlert : block.variant === 'warning' ? AlertTriangle : CheckCircle2;
                const bgColor = block.variant === 'danger' ? 'bg-red-950/20 border-red-900/50' : block.variant === 'warning' ? 'bg-yellow-950/20 border-yellow-900/50' : 'bg-green-950/20 border-green-900/50';
                const textColor = block.variant === 'danger' ? 'text-red-400' : block.variant === 'warning' ? 'text-yellow-400' : 'text-green-400';

                return (
                  <div key={idx} className={`p-6 rounded-xl border ${bgColor} my-8`}>
                    <div className={`flex items-center font-bold mb-2 ${textColor}`}>
                      <Icon className="w-5 h-5 mr-2" />
                      {block.title}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </GlassCard>

      {/* Footer Actions */}
      <div className="flex justify-between items-center border-t border-border pt-8">
        <p className="text-sm text-muted font-mono">TrueStyle Threat Intelligence Team</p>
        <button className="flex items-center text-sm font-semibold text-foreground hover:text-accent transition">
          <Share2 className="w-4 h-4 mr-2" />
          Share Alert
        </button>
      </div>

    </div>
  );
};
