import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbRouter } from '../services/databaseRouter';
import { runDetectionScan, extractDomain } from '../services/scanEngine';
import { GlassCard } from '../components/GlassCard';
import { RiskMeter } from '../components/RiskMeter';
import { exportScanReportPDF } from '../utils/pdfGenerator';
import { ProductScan } from '../types';
import { 
  Fingerprint, 
  UploadCloud, 
  Link2, 
  FileText, 
  Bookmark, 
  BookmarkCheck,
  Star, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle,
  TrendingDown,
  Activity,
  Award
} from 'lucide-react';

export const ProductVerificationPage: React.FC = () => {
  const { user } = useAuth();
  
  // Scan parameters
  const [brandName, setBrandName] = useState('Nike');
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [retailPrice, setRetailPrice] = useState<number>(0);
  const [sellerName, setSellerName] = useState('');
  const [sellerRating, setSellerRating] = useState<number>(4.5);
  const [sellerReviews, setSellerReviews] = useState<number>(100);
  const [platformName, setPlatformName] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);

  // Scanning phase states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState<ProductScan | null>(null);
  
  // Bookmarking states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavBrand, setIsFavBrand] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    dbRouter.getBrands().then(list => setBrands(list));
  }, []);

  // Auto-fill standard retail prices based on brand to make testing easier
  useEffect(() => {
    const brandPrices: Record<string, number> = {
      'Nike': 120,
      'Gucci': 1800,
      'Louis Vuitton': 2200,
      'Adidas': 100,
      'Rolex': 9500,
      'Prada': 1500,
      'Off-White': 450,
      'Balenciaga': 950
    };
    if (brandPrices[brandName]) {
      setRetailPrice(brandPrices[brandName]);
      // set price as some default
      setPrice(Math.round(brandPrices[brandName] * 0.8)); 
    }
  }, [brandName]);

  // Extract domain and update platform on URL changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProductUrl(val);
    if (val) {
      const dom = extractDomain(val);
      setPlatformName(dom);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-load templates for testing
  const loadTemplate = (type: 'safe' | 'danger') => {
    setScanResult(null);
    if (type === 'safe') {
      setBrandName('Nike');
      setProductName('Air Force 1 Retro');
      setProductUrl('https://nike.com/products/af1');
      setPlatformName('nike.com');
      setPrice(24); // 80% discount
      setRetailPrice(120);
      setSellerName('Nike Store');
      setSellerRating(5.0);
      setSellerReviews(4200);
      setImageFile(null);
    } else {
      setBrandName('Gucci');
      setProductName('GG Marmont Crossbody Bag');
      setProductUrl('https://superdiscountbags.xyz/gucci-outlet');
      setPlatformName('superdiscountbags.xyz');
      setPrice(250); // 88% discount
      setRetailPrice(2100);
      setSellerName('Cheap Luxury Steals');
      setSellerRating(1.2);
      setSellerReviews(3);
      setImageFile(null);
    }
  };

  const startScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !price || !sellerName) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    setScanLogs([]);

    const logMessages = [
      'Initializing connection handshake with WHOIS registries...',
      'Analyzing domain registration details for SSL validation...',
      'Interrogating price indexes against luxury brand distribution covenants...',
      'Cross-referencing seller databases for historical rating index...',
      'Aggregating security signal consensus matrices...',
      'Writing threat evaluation records to PostgreSQL ledger...'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finalizeScan();
          return 100;
        }
        
        // Add logs as progress goes on
        const logTrigger = Math.floor(prev / 17);
        if (logTrigger === currentLogIndex && logMessages[currentLogIndex]) {
          setScanLogs(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${logMessages[currentLogIndex]}`]);
          currentLogIndex++;
        }
        
        return prev + 2;
      });
    }, 40);
  };

  const finalizeScan = async () => {
    if (!user) return;
    
    // Run detection logic
    const scanData = runDetectionScan({
      userId: user.id,
      brandName,
      productName,
      price,
      retailPrice,
      productUrl,
      sellerName,
      sellerRating,
      sellerReviews,
      platformName: platformName || extractDomain(productUrl)
    });

    // Write to persistent history
    const completedScan = await dbRouter.addScan({
      ...scanData,
      image_url: imageFile || ''
    });

    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'product_verification_scan',
      details: `Scanned ${brandName} ${productName}. Outcome: ${completedScan.final_recommendation.toUpperCase()} (Score: ${completedScan.overall_score}%)`,
      ip_address: '127.0.0.1'
    });

    setScanResult(completedScan);
    setIsScanning(false);
    
    // Check initial bookmarks & favorites
    const bookmarked = await dbRouter.isBookmarked(user.id, completedScan.id);
    const faved = await dbRouter.isFavorite(user.id, completedScan.brand_name);
    setIsBookmarked(bookmarked);
    setIsFavBrand(faved);
  };

  const toggleBookmark = async () => {
    if (!user || !scanResult) return;
    await dbRouter.toggleBookmark(user.id, scanResult.id);
    setIsBookmarked(prev => !prev);
  };

  const toggleFavoriteBrand = async () => {
    if (!user || !scanResult) return;
    await dbRouter.toggleFavorite(user.id, scanResult.brand_name);
    setIsFavBrand(prev => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 select-none">
        <div>
          <span className="text-cyber-blue-500 font-mono text-xs font-semibold tracking-widest uppercase">
            AUDIT NODE
          </span>
          <h1 className="text-3xl font-bold text-white mt-1 tracking-tight flex items-center font-mono">
            <Fingerprint className="w-8 h-8 text-cyber-blue-500 mr-2" />
            Product Verification
          </h1>
        </div>

        {/* Load Templates */}
        <div className="flex space-x-2 mt-4 md:mt-0 font-mono">
          <button
            onClick={() => loadTemplate('safe')}
            className="px-3 py-1.5 rounded bg-green-950/20 hover:bg-green-900/30 text-green-400 text-[10px] font-bold border border-green-900/30 transition flex items-center"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Load Mock Safe (Nike 80% Off)
          </button>
          <button
            onClick={() => loadTemplate('danger')}
            className="px-3 py-1.5 rounded bg-red-950/20 hover:bg-red-900/30 text-red-400 text-[10px] font-bold border border-red-900/30 transition flex items-center"
          >
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Load Mock Danger (Gucci 88% Off)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Inputs Form */}
        <div className="lg:col-span-1">
          <GlassCard hoverable={false} className="border-cyber-dark-border">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 border-b border-cyber-dark-border pb-2 flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-cyber-blue-500" />
              Scan Specifications
            </h3>

            <form onSubmit={startScan} className="space-y-4">
              {/* Image Upload Zone */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1.5">
                  Item Snapshot
                </label>
                <div className="relative group border border-dashed border-cyber-dark-border rounded-xl p-4 bg-cyber-dark-bg hover:border-cyber-blue-800 transition text-center cursor-pointer select-none">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imageFile ? (
                    <div className="flex flex-col items-center">
                      <img src={imageFile} alt="Preview" className="w-20 h-20 object-cover rounded border border-cyber-dark-border" />
                      <span className="text-[10px] text-cyber-blue-400 mt-2 hover:underline">Replace file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-cyber-blue-500 transition mb-1" />
                      <span className="text-[10px] text-gray-400 font-semibold">Drag snapshot file or click</span>
                      <span className="text-[8px] text-gray-600 mt-0.5">JPEG, PNG up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Selector */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1">
                  Luxury Brand
                </label>
                <select
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-lg text-xs text-white"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.brand_name} className="bg-cyber-dark-card text-white">
                      {b.brand_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1">
                  Product Name / Identifier
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Jordan 1 Retro, Neverfull MM"
                  className="w-full glass-input px-3 py-2 rounded-lg text-xs text-white"
                  required
                />
              </div>

              {/* Product URL */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1 flex items-center justify-between">
                  <span>Merchant Product URL</span>
                  <Link2 className="w-3 h-3 text-gray-600" />
                </label>
                <input
                  type="text"
                  value={productUrl}
                  onChange={handleUrlChange}
                  placeholder="e.g. https://cheapluxury.ru/nike-af1"
                  className="w-full glass-input px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>

              {/* Price Specifications */}
              <div className="grid grid-cols-2 gap-3 select-none">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1 flex items-center">
                    Offer Price ($)
                  </label>
                  <input
                    type="number"
                    value={price || ''}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full glass-input px-3 py-2 rounded-lg text-xs text-white"
                    placeholder="Offer price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1 flex items-center">
                    Retail Price ($)
                    <HelpCircle className="w-3 h-3 text-gray-600 ml-1" title="Average MSRP value" />
                  </label>
                  <input
                    type="number"
                    value={retailPrice || ''}
                    onChange={(e) => setRetailPrice(parseInt(e.target.value) || 0)}
                    className="w-full glass-input px-3 py-2 rounded-lg text-xs text-white"
                    placeholder="Typical MSRP"
                    required
                  />
                </div>
              </div>

              {/* Seller specifications */}
              <div className="p-3 bg-cyber-dark-bg border border-cyber-dark-border rounded-xl space-y-3 select-none">
                <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                  Seller Parameters (Crowd Metadata)
                </span>
                
                <div>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="Seller name (e.g., Nike Store)"
                    className="w-full glass-input px-2.5 py-1.5 rounded-md text-[11px] text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] text-gray-500 font-semibold mb-0.5">Rating (0-5 Stars)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={sellerRating || ''}
                      onChange={(e) => setSellerRating(parseFloat(e.target.value) || 0)}
                      className="w-full glass-input px-2 py-1 rounded-md text-[10px] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-500 font-semibold mb-0.5">Reviews Count</label>
                    <input
                      type="number"
                      value={sellerReviews || ''}
                      onChange={(e) => setSellerReviews(parseInt(e.target.value) || 0)}
                      className="w-full glass-input px-2 py-1 rounded-md text-[10px] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Platform specification */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono mb-1">
                  E-Commerce Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="e.g. Amazon, nike.com, unknown"
                  className="w-full glass-input px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3 rounded-lg bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning Threat Signals...' : 'Initiate Verification Scan'}</span>
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Scan Results Screen */}
        <div className="lg:col-span-2">
          {/* Scanning Progress Console Overlay */}
          {isScanning && (
            <GlassCard hoverable={false} className="h-full flex flex-col justify-center border-cyber-blue-900 shadow-neon-blue select-none">
              <div className="text-center max-w-md mx-auto space-y-6 py-12">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-cyber-blue-900 opacity-20"></div>
                  <div className="absolute inset-0 rounded-full border-t-4 border-l-4 border-cyber-blue-500 animate-spin"></div>
                  <Fingerprint className="w-10 h-10 text-cyber-blue-400 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-mono text-sm font-bold uppercase tracking-wider">
                    Analyzing Threat Matrices... {scanProgress}%
                  </h4>
                  <div className="w-full bg-cyber-dark-bg h-1.5 rounded-full overflow-hidden border border-cyber-dark-border">
                    <div className="bg-cyber-blue-600 h-full rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </div>

                {/* Console Log display */}
                <div className="bg-[#050608] border border-cyber-dark-border p-3.5 rounded-lg text-left h-36 overflow-y-auto font-mono text-[9px] text-gray-500 space-y-1.5 scrollbar-thin">
                  {scanLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed truncate">
                      <span className="text-cyber-blue-500">&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Idle screen state */}
          {!isScanning && !scanResult && (
            <GlassCard hoverable={false} className="h-full flex flex-col items-center justify-center py-16 border-dashed border-cyber-dark-border select-none">
              <div className="text-center max-w-sm space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-cyber-dark-card border border-cyber-dark-border flex items-center justify-center text-gray-500">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Awaiting Threat Scan</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter e-commerce links, snapshots, and seller metrics in the left panel to execute our multi-signal security verification check.
                </p>
              </div>
            </GlassCard>
          )}

          {/* Verification Results Display */}
          {!isScanning && scanResult && (
            <div className="space-y-6">
              {/* Overall Risk Score & Recommendation header */}
              <GlassCard hoverable={false} className={`border ${scanResult.final_recommendation === 'danger' ? 'border-red-900 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-950/5' : 'border-cyber-blue-900/50 shadow-[0_0_15px_rgba(0,67,189,0.15)] bg-cyber-blue-950/5'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1">
                    <RiskMeter score={scanResult.overall_score} />
                  </div>
                  
                  <div className="md:col-span-2 space-y-4 select-none">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border uppercase ${
                        scanResult.final_recommendation === 'danger' 
                          ? 'bg-red-950/50 text-red-400 border-red-900/30' 
                          : 'bg-cyber-blue-950 text-cyber-blue-400 border-cyber-blue-700/30'
                      }`}>
                        {scanResult.final_recommendation === 'danger' ? 'COUNTERFEIT WARN' : 'VERIFIED SAFE'}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">NODE ID: {scanResult.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white font-mono leading-snug">
                        {scanResult.brand_name} - {scanResult.product_name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        {scanResult.explanation}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => exportScanReportPDF(scanResult)}
                        className="px-3 py-1.5 rounded bg-cyber-dark-card hover:bg-cyber-dark-border border border-cyber-dark-border text-xs text-gray-300 hover:text-white transition flex items-center"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-cyber-blue-500" />
                        Export PDF Report
                      </button>
                      <button
                        onClick={toggleBookmark}
                        className="px-3 py-1.5 rounded bg-cyber-dark-card hover:bg-cyber-dark-border border border-cyber-dark-border text-xs text-gray-300 hover:text-white transition flex items-center"
                      >
                        {isBookmarked ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 mr-1 text-cyber-blue-500 animate-in zoom-in" />
                            Bookmarked
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 mr-1 text-gray-500" />
                            Bookmark
                          </>
                        )}
                      </button>
                      <button
                        onClick={toggleFavoriteBrand}
                        className="px-3 py-1.5 rounded bg-cyber-dark-card hover:bg-cyber-dark-border border border-cyber-dark-border text-xs text-gray-300 hover:text-white transition flex items-center font-mono"
                      >
                        {isFavBrand ? (
                          <span className="text-cyber-blue-500 flex items-center">
                            <Star className="w-3.5 h-3.5 fill-cyber-blue-500 text-cyber-blue-500 mr-1" />
                            Faved Brand
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-400">
                            <Star className="w-3.5 h-3.5 mr-1 text-gray-500" />
                            Fav Brand
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Coloured AI Analysis Signal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                {/* 1. Price Risk */}
                <div className={`p-5 rounded-xl border ${
                  scanResult.price_risk.status === 'suspicious' 
                    ? 'border-red-950 bg-red-950/10' 
                    : 'border-cyber-dark-border bg-cyber-dark-card/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-1 text-cyber-blue-500" />
                      Price Risk Audit
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      scanResult.price_risk.status === 'suspicious' ? 'bg-red-950 text-red-400' : 'bg-green-950/50 text-green-400'
                    }`}>
                      {scanResult.price_risk.status.toUpperCase()} ({scanResult.price_risk.confidence}%)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{scanResult.price_risk.explanation}</p>
                </div>

                {/* 2. Seller Reputation */}
                <div className={`p-5 rounded-xl border ${
                  scanResult.seller_risk.status === 'suspicious' 
                    ? 'border-red-950 bg-red-950/10' 
                    : 'border-cyber-dark-border bg-cyber-dark-card/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1 text-cyber-blue-500" />
                      Seller Reputation
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      scanResult.seller_risk.status === 'suspicious' ? 'bg-red-950 text-red-400' : 'bg-green-950/50 text-green-400'
                    }`}>
                      {scanResult.seller_risk.status.toUpperCase()} ({scanResult.seller_risk.confidence}%)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{scanResult.seller_risk.explanation}</p>
                </div>

                {/* 3. Platform Verification */}
                <div className={`p-5 rounded-xl border ${
                  scanResult.platform_risk.status === 'suspicious' 
                    ? 'border-red-950 bg-red-950/10' 
                    : 'border-cyber-dark-border bg-cyber-dark-card/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyber-blue-500" />
                      Platform Verification
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      scanResult.platform_risk.status === 'suspicious' ? 'bg-red-950 text-red-400' : 'bg-green-950/50 text-green-400'
                    }`}>
                      {scanResult.platform_risk.status.toUpperCase()} ({scanResult.platform_risk.confidence}%)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{scanResult.platform_risk.explanation}</p>
                </div>

                {/* 4. Brand Authenticity */}
                <div className={`p-5 rounded-xl border ${
                  scanResult.brand_risk.status === 'suspicious' 
                    ? 'border-red-950 bg-red-950/10' 
                    : 'border-cyber-dark-border bg-cyber-dark-card/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1 text-cyber-blue-500" />
                      Brand Distribution
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      scanResult.brand_risk.status === 'suspicious' ? 'bg-red-950 text-red-400' : 'bg-green-950/50 text-green-400'
                    }`}>
                      {scanResult.brand_risk.status.toUpperCase()} ({scanResult.brand_risk.confidence}%)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{scanResult.brand_risk.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
