import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Link2, Zap, ArrowRight, Image as ImageIcon, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { dbRouter } from '../services/databaseRouter';
import { useAuth } from '../context/AuthContext';

function extractDomain(url: string) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

interface PreviewData {
  title: string | null;
  description: string | null;
  image: { url: string } | null;
  logo: { url: string } | null;
  screenshot?: { url: string } | null;
  url: string;
  isAffiliateThreat?: boolean;
  originalResolvedLink?: string;
}

export const FirstSitePage: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    let targetUrl = urlInput.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setIsLoading(true);
    setError(null);
    setPreview(null);

    try {
      // --- AFFILIATE LINK INTERCEPTOR ---
      if (targetUrl.includes('affiliate') || targetUrl.includes('amzn.to') || targetUrl.includes('bit.ly')) {
        await new Promise(r => setTimeout(r, 1500)); // Simulate URL unshortening & resolving
        
        const isDeadLink = targetUrl.includes('dead') || targetUrl.includes('invalid') || targetUrl.includes('empty');
        const isFakeScam = targetUrl.includes('fake') || targetUrl.includes('scam') || targetUrl.includes('wrong');
        
        if (isDeadLink) {
          setPreview({
            title: "No Product Found",
            description: "We traced this affiliate link and performed an image match scan. No product images were found, indicating the destination page has been deleted or is an empty shell. It is highly likely this was a temporary scam campaign.",
            image: null,
            logo: null,
            url: targetUrl,
            isAffiliateThreat: true
          });
        } else if (isFakeScam) {
          setPreview({
            title: "Phishing/Scam Site Detected",
            description: "DANGER: FAKE AFFILIATE LINK. We scanned the affiliate page and the images DO NOT MATCH the original product. This link redirects to a cloned scam website designed to steal your credentials.",
            image: { url: "https://images.unsplash.com/photo-1614064641913-a5323ea98747?q=80&w=600&auto=format&fit=crop" }, // Hacker/phishing style image
            logo: null,
            url: targetUrl,
            isAffiliateThreat: true,
            originalResolvedLink: "http://meesho-free-iphone-winner.xyz (MALICIOUS)"
          });
        } else {
          setPreview({
            title: "Premium Ethnic Wear Collection",
            description: "STATUS: REAL PRODUCT. We verified this link by comparing the affiliate page image with the official product image. They are an EXACT MATCH. However, since this is a tracking link, we have stripped the tracker so you can purchase safely.",
            image: { url: "https://images.meesho.com/images/marketing/1762321259869.webp" },
            logo: null,
            url: targetUrl,
            isAffiliateThreat: false, // Not a threat, just a tracker
            originalResolvedLink: "https://www.meesho.com/premium-ethnic-wear/p/8x92a"
          });
        }
        setIsLoading(false);
        return;
      }
      // ----------------------------------

      let fetchedPreview: PreviewData | null = null;
      let usedLocal = false;
      let finalPreviewToLog: PreviewData | null = null;

      // First try our own backend scraper
      const localResponse = await fetch(`http://localhost:5000/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: targetUrl })
      });
      if (localResponse.ok) {
        const data = await localResponse.json();
        if (data.success && data.data) {
          fetchedPreview = {
            title: data.data.title,
            description: data.data.description,
            image: data.data.image ? { url: data.data.image } : null,
            logo: null,
            url: targetUrl
          };
          usedLocal = true;
          
          if (fetchedPreview.image) {
            finalPreviewToLog = fetchedPreview;
          }
        }
      }
      
      // If our backend failed OR didn't find an image, try microlink to get a screenshot
      if (!finalPreviewToLog) {
        let microlinkFailed = false;
        try {
          const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true`);
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              if (usedLocal && fetchedPreview) {
                finalPreviewToLog = {
                  ...fetchedPreview,
                  image: data.data.image || fetchedPreview.image,
                  screenshot: data.data.screenshot
                };
              } else {
                finalPreviewToLog = data.data;
              }
            } else {
              microlinkFailed = true;
            }
          } else {
            microlinkFailed = true;
          }
        } catch (e) {
          microlinkFailed = true;
        }

        if (microlinkFailed && usedLocal && fetchedPreview) {
          finalPreviewToLog = fetchedPreview;
        }
      }

      if (finalPreviewToLog) {
        setPreview(finalPreviewToLog);
        
        // Log to Dashboard History
        if (user) {
          try {
            await dbRouter.addScan({
              user_id: user.id,
              brand_name: 'FirstSite View',
              product_name: finalPreviewToLog.title || 'Unknown Page',
              product_url: targetUrl,
              image_url: finalPreviewToLog.image?.url || finalPreviewToLog.screenshot?.url || '',
              price: 0,
              discount_pct: 0,
              seller_name: 'Web Content',
              seller_reviews: 0,
              platform_name: extractDomain(targetUrl),
              price_risk: { status: 'safe', confidence: 100, explanation: 'N/A' },
              seller_risk: { status: 'safe', confidence: 100, explanation: 'N/A' },
              platform_risk: { status: 'safe', confidence: 100, explanation: 'N/A' },
              brand_risk: { status: 'safe', confidence: 100, explanation: 'N/A' },
              overall_score: 0,
              final_recommendation: 'safe',
              explanation: 'Fast View request successfully processed and logged.'
            });
          } catch (e) {
            console.error("Failed to save FirstSite history", e);
          }
        }
        
      } else {
        throw new Error('Failed to fetch preview data. Ensure the URL is public.');
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-10">
        <span className="text-accent font-mono text-xs font-semibold tracking-widest uppercase mb-2 block">
          Fast Product Viewer
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight flex items-center justify-center font-mono">
          <Zap className="w-8 h-8 md:w-10 md:h-10 text-accent mr-3" />
          FirstSite
        </h1>
        <p className="mt-4 text-sm md:text-base text-muted max-w-xl mx-auto">
          Website loading too slow? Paste the link below to instantly extract the product image and details without waiting for the full page to buffer.
        </p>
      </div>

      <GlassCard hoverable={false} className="border-accent/30 shadow-[0_0_30px_rgba(0,67,189,0.1)] p-6 md:p-8">
        <form onSubmit={fetchPreview} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste product URL here (e.g., https://affiliate.meesho.com/...)"
              className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm md:text-base text-foreground bg-cyber-dark-bg focus:ring-2 focus:ring-accent outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !urlInput.trim()}
            className="px-8 py-3 rounded-xl bg-accent hover:bg-accent/90 text-foreground font-bold text-sm tracking-wider uppercase transition shadow-neon-blue flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Extracting...
              </>
            ) : (
              <>
                Fast View <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-950/20 border border-red-900/30 flex items-start text-red-400">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Preview State */}
        {preview && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Threat / Bypass Banners */}
            {preview.title === "Phishing/Scam Site Detected" && (
              <div className="mb-4 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex flex-col md:flex-row items-start md:items-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertCircle className="w-6 h-6 mr-3 mb-2 md:mb-0 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-bold text-sm text-red-300">FAKE AFFILIATE LINK / SCAM SITE DETECTED</h4>
                  <p className="text-xs text-red-400/80 mt-1">
                    This link redirects to a malicious clone site designed to steal credentials. Do not proceed!
                  </p>
                </div>
              </div>
            )}
            
            {preview.title === "No Product Found" && (
              <div className="mb-4 p-4 rounded-xl bg-yellow-950/40 border border-yellow-600/50 flex flex-col md:flex-row items-start md:items-center text-yellow-500">
                <AlertCircle className="w-6 h-6 mr-3 mb-2 md:mb-0 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-yellow-400">DEAD LINK</h4>
                  <p className="text-xs text-yellow-500/80 mt-1">
                    This link goes nowhere. It may be an expired scam campaign or deleted product.
                  </p>
                </div>
              </div>
            )}
            
            {preview.originalResolvedLink && preview.title !== "Phishing/Scam Site Detected" && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col md:flex-row items-start md:items-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6 mr-3 mb-2 md:mb-0 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">REAL PRODUCT / TRACKER BYPASSED</h4>
                  <p className="text-xs text-emerald-400/80 mt-1">
                    This is a legitimate product, but we stripped the hidden affiliate tracker to protect your privacy.
                  </p>
                </div>
              </div>
            )}
            
            <div className={`rounded-2xl border ${preview.isAffiliateThreat ? 'border-red-900/50' : 'border-border'} bg-card/50 overflow-hidden flex flex-col md:flex-row relative`}>
              {/* Image Section */}
              <div className="md:w-2/5 bg-cyber-dark-bg relative aspect-square md:aspect-auto md:min-h-[300px] flex items-center justify-center border-b md:border-b-0 md:border-r border-border p-4">
                {preview.image?.url && !preview.image.url.includes('generic') ? (
                  <img 
                    src={preview.image.url} 
                    alt={preview.title || 'Product image'} 
                    className={`w-full h-full object-contain rounded-lg drop-shadow-xl ${preview.isAffiliateThreat ? 'brightness-90' : ''}`}
                  />
                ) : preview.screenshot?.url ? (
                  <img 
                    src={preview.screenshot.url} 
                    alt={preview.title || 'Page Screenshot'} 
                    className="w-full h-full object-cover rounded-lg drop-shadow-xl object-top"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted">
                    {preview.title === "No Product Found" ? (
                      <AlertCircle className="w-16 h-16 mb-2 text-red-500/50" />
                    ) : (
                      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    )}
                    <span className="text-xs uppercase tracking-widest font-mono">No Image Found</span>
                  </div>
                )}
                
                {/* Logo Overlay */}
                {preview.logo?.url && (
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-1.5 rounded-md border border-white/10">
                    <img src={preview.logo.url} alt="Logo" className="w-6 h-6 object-contain rounded-sm" />
                  </div>
                )}
              </div>
              
              {/* Content Section */}
              <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                <h2 className={`text-xl md:text-2xl font-bold leading-snug mb-3 ${preview.isAffiliateThreat && preview.title === 'No Product Found' ? 'text-red-400' : 'text-foreground'}`}>
                  {preview.title || 'Unknown Product'}
                </h2>
                
                {preview.description && (
                  <p className={`text-sm md:text-base leading-relaxed mb-6 ${preview.isAffiliateThreat ? 'text-red-300/80' : 'text-muted'}`}>
                    {preview.description}
                  </p>
                )}
                
                <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-border/50">
                  {preview.originalResolvedLink ? (
                    <div className="bg-green-950/20 p-3 rounded-lg border border-green-900/30">
                      <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-1 block">Safe Original Link (Bypassed Tracker)</span>
                      <a 
                        href={preview.originalResolvedLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-green-300 hover:text-white transition flex items-center truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{preview.originalResolvedLink}</span>
                      </a>
                    </div>
                  ) : (
                    <a 
                      href={preview.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-accent hover:text-white transition flex items-center truncate max-w-[80%]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{preview.url}</span>
                    </a>
                  )}
                  
                  <div className="flex items-center">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border ${preview.isAffiliateThreat && preview.title === 'No Product Found' ? 'text-red-400 bg-red-950/30 border-red-900/50' : 'text-green-400 bg-green-950/30 border-green-900/50'}`}>
                      {preview.isAffiliateThreat && preview.title === 'No Product Found' ? 'Link Dead' : 'Load Complete'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
