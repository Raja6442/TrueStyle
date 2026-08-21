import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Award, ShieldAlert, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbRouter } from '../services/databaseRouter';
import { ProductScan } from '../types';

export const ReviewRatePage: React.FC = () => {
  const { user } = useAuth();
  const [truePoints, setTruePoints] = useState(parseInt(localStorage.getItem('truePoints') || '0'));
  const [reportUrl, setReportUrl] = useState('');
  const [reportPlatform, setReportPlatform] = useState('amazon');
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [communityReports, setCommunityReports] = useState<ProductScan[]>([]);

  const fetchReports = async () => {
    const reports = await dbRouter.getCommunityReports();
    setCommunityReports(reports);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportUrl.trim()) return;
    
    const newPoints = truePoints + 50;
    setTruePoints(newPoints);
    localStorage.setItem('truePoints', newPoints.toString());

    if (user) {
      try {
        await dbRouter.addScan({
          user_id: user.id,
          brand_name: 'Community Report',
          product_name: 'Reported Fake',
          product_url: reportUrl,
          image_url: '',
          price: 0,
          discount_pct: 0,
          seller_name: 'Reported Seller',
          seller_reviews: 0,
          platform_name: reportPlatform,
          price_risk: { status: 'suspicious', confidence: 100, explanation: 'User reported fake.' },
          seller_risk: { status: 'suspicious', confidence: 100, explanation: 'User reported fake.' },
          platform_risk: { status: 'suspicious', confidence: 100, explanation: 'User reported fake.' },
          brand_risk: { status: 'suspicious', confidence: 100, explanation: 'User reported fake.' },
          overall_score: 100,
          final_recommendation: 'danger',
          explanation: reportReason || 'User manually reported this URL as a counterfeit/fake product.'
        });
        fetchReports(); // Refresh feed
      } catch (err) {
        console.error("Failed to save report to history", err);
      }
    }
    
    setReportSuccess(true);
    setReportUrl('');
    
    setTimeout(() => {
      setReportSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-accent font-mono text-xs font-semibold tracking-widest uppercase">
          COMMUNITY WATCH
        </span>
        <h1 className="text-4xl font-bold text-foreground mt-2 tracking-tight">
          Review & <span className="text-purple-400">Rate</span>
        </h1>
        <p className="mt-4 text-muted text-lg leading-relaxed">
          Report suspicious URLs to help us keep the platform clean. Earn points for every confirmed fake product you identify.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Points Display */}
        <GlassCard className="flex flex-col items-center justify-center text-center p-8 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <Award className="w-16 h-16 text-purple-400 mb-4" />
          <h2 className="text-xl font-bold text-foreground font-mono uppercase">True Rewards Balance</h2>
          <div className="text-5xl font-extrabold text-foreground font-mono mt-4 mb-2 tracking-tighter">
            {truePoints} <span className="text-sm font-semibold text-muted tracking-normal">pts</span>
          </div>
          <p className="text-xs text-muted max-w-xs mt-2">
            Earn 50 points for every verified fake product you report. Points can be redeemed for discounts on your True Pro subscription!
          </p>
        </GlassCard>

        {/* Report Form */}
        <GlassCard className="border-purple-500/30">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border flex items-center">
            <ShieldAlert className="w-4 h-4 text-red-500 mr-2" />
            Report a Fake Product
          </h3>
          
          {reportSuccess ? (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center animate-in zoom-in">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-foreground">Report Submitted!</h4>
              <p className="text-xs text-green-400 mt-1">+50 True Points added to your balance.</p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Suspicious Product URL</label>
                <input
                  type="url"
                  value={reportUrl}
                  onChange={(e) => setReportUrl(e.target.value)}
                  placeholder="https://amazon.in/fake-shoes..."
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground bg-black/40 border-border focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Platform</label>
                <select 
                  value={reportPlatform}
                  onChange={(e) => setReportPlatform(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground bg-black/40 border-border focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="amazon">Amazon</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="myntra">Myntra</option>
                  <option value="meesho">Meesho</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Why do you think it's fake?</label>
                <textarea
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Suspiciously low price, fake reviews, etc..."
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground bg-black/40 border-border focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition uppercase tracking-wider"
              >
                Submit Threat Report
              </button>
            </form>
          )}
        </GlassCard>
      </div>

      {/* Community Feed Section */}
      <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150">
        <div className="flex items-center mb-6 border-b border-border/50 pb-4">
          <Globe className="w-6 h-6 text-purple-400 mr-3" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Community Threat Feed</h2>
          <span className="ml-auto text-xs font-mono bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
            Live Updates
          </span>
        </div>
        
        {communityReports.length === 0 ? (
          <GlassCard className="p-12 text-center border-dashed">
            <p className="text-muted">No community reports yet. Be the first to report a threat!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityReports.map((report) => (
              <GlassCard key={report.id} className="p-6 border-red-500/20 hover:border-red-500/40 transition flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50 group-hover:bg-red-500 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-3 pl-2">
                  <span className="text-[10px] font-bold tracking-wider text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    {report.platform_name}
                  </span>
                  <span className="text-[10px] text-muted">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h4 className="text-sm font-semibold text-foreground mb-2 pl-2 line-clamp-2">
                  {report.explanation}
                </h4>
                
                <div className="mt-auto pt-4 pl-2">
                  <a 
                    href={report.product_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    View Suspicious Link
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
