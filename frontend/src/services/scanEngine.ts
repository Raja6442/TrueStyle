import { ProductScan, RiskSignal } from '../types';
import { mockDb } from './mockDatabase';

interface ScanInputs {
  userId: string;
  brandName: string;
  productName: string;
  productUrl?: string;
  price: number;
  retailPrice: number;
  sellerName: string;
  sellerRating: number;
  sellerReviews: number;
  platformName: string;
}

// Extract domain from URL
export const extractDomain = (url?: string): string => {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url.replace('www.', '');
  }
};

export const runDetectionScan = (inputs: ScanInputs): Omit<ProductScan, 'id' | 'created_at'> => {
  const {
    userId,
    brandName,
    productName,
    productUrl,
    price,
    retailPrice,
    sellerName,
    sellerReviews,
    sellerRating,
    platformName
  } = inputs;

  const urlDomain = extractDomain(productUrl || platformName);
  const discountPct = retailPrice > 0 ? Math.round(((retailPrice - price) / retailPrice) * 100) : 0;

  // Retrieve brands and sellers from the database
  const brandsRegistry = mockDb.getBrands();
  const sellersRegistry = mockDb.getSellers();

  const brandObj = brandsRegistry.find(
    b => b.brand_name.toLowerCase() === brandName.toLowerCase()
  );
  
  const matchedSeller = sellersRegistry.find(
    s => s.seller_name.toLowerCase() === sellerName.toLowerCase()
  );

  // 1. Platform Authenticity Risk
  let platformSuspicious = false;
  let platformConfidence = 80;
  let platformExplanation = '';

  const isOfficialBrandDomain = brandObj?.official_domains.some(
    domain => urlDomain.toLowerCase().endsWith(domain.toLowerCase()) || domain.toLowerCase().endsWith(urlDomain.toLowerCase())
  );

  const isTrustedPlatform = sellersRegistry.some(
    s => s.status === 'trusted' && 
    (s.platform.toLowerCase().includes(urlDomain.toLowerCase()) || 
     urlDomain.toLowerCase().includes(s.platform.toLowerCase()))
  );

  if (isOfficialBrandDomain) {
    platformSuspicious = false;
    platformConfidence = 98;
    platformExplanation = `The domain "${urlDomain}" is an officially registered domain for ${brandName}.`;
  } else if (isTrustedPlatform) {
    platformSuspicious = false;
    platformConfidence = 90;
    platformExplanation = `The platform "${urlDomain}" is verified as a trusted online retailer.`;
  } else {
    // Check for suspicious TLDs
    const suspiciousTLDs = ['.ru', '.xyz', '.biz', '.cn', '.cc', '.cheap', '.outlet', '.vip', '.top', '.club', '.shop'];
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => urlDomain.toLowerCase().endsWith(tld));
    
    if (hasSuspiciousTLD) {
      platformSuspicious = true;
      platformConfidence = 95;
      platformExplanation = `CRITICAL: The domain "${urlDomain}" utilizes a high-risk TLD (${urlDomain.substring(urlDomain.lastIndexOf('.'))}) frequently associated with fraud networks.`;
    } else {
      platformSuspicious = true;
      platformConfidence = 70;
      platformExplanation = `WARNING: The domain "${urlDomain}" is not in our official brand registry or trusted seller index. Platform authenticity is unverified.`;
    }
  }

  // 2. Price Analysis Risk
  let priceSuspicious = false;
  let priceConfidence = 85;
  let priceExplanation = '';

  // Luxury luxury check: Gucci, LV, Rolex etc. never go on sale on open platforms
  const isLuxuryBrand = ['gucci', 'louis vuitton', 'rolex', 'prada', 'balenciaga'].includes(brandName.toLowerCase());

  if (discountPct >= 80) {
    if (isOfficialBrandDomain) {
      priceSuspicious = false; // Nike official store clearing stock
      priceConfidence = 90;
      priceExplanation = `Although the ${discountPct}% discount is extremely steep, it is safe as it is hosted on the official authenticated domain.`;
    } else {
      priceSuspicious = true;
      priceConfidence = 95;
      priceExplanation = `CRITICAL: An 80%+ discount (${discountPct}%) on ${brandName} from an unverified source is highly indicative of counterfeit stock.`;
    }
  } else if (discountPct >= 50) {
    if (isOfficialBrandDomain || isTrustedPlatform) {
      priceSuspicious = false;
      priceConfidence = 85;
      priceExplanation = `A steep ${discountPct}% discount is active, but is deemed safe because the seller is a verified trusted retail partner.`;
    } else {
      priceSuspicious = true;
      priceConfidence = 85;
      priceExplanation = `WARNING: A discount of ${discountPct}% on ${brandName} from an unverified seller exceeds standard promotional thresholds.`;
    }
  } else if (isLuxuryBrand && discountPct > 35) {
    priceSuspicious = true;
    priceConfidence = 90;
    priceExplanation = `WARNING: Luxury brand ${brandName} does not discount items by ${discountPct}% under official distribution rules.`;
  } else {
    priceSuspicious = false;
    priceConfidence = 75;
    priceExplanation = `The discount of ${discountPct}% is within typical seasonal retail promotional standards.`;
  }

  // 3. Seller Trust Score Risk
  let sellerSuspicious = false;
  let sellerConfidence = 80;
  let sellerExplanation = '';

  if (matchedSeller) {
    if (matchedSeller.status === 'trusted') {
      sellerSuspicious = false;
      sellerConfidence = 98;
      sellerExplanation = `Seller "${sellerName}" is an officially registered and verified trustworthy dealer.`;
    } else {
      sellerSuspicious = true;
      sellerConfidence = 95;
      sellerExplanation = `CRITICAL: Seller "${sellerName}" is flagged on our database blacklist for distributing counterfeit materials.`;
    }
  } else {
    // Unregistered seller heuristic
    if (sellerReviews > 150 && sellerRating >= 4.2) {
      sellerSuspicious = false;
      sellerConfidence = 80;
      sellerExplanation = `Seller has high user feedback volume (${sellerReviews} reviews) and an acceptable score (${sellerRating}/5).`;
    } else if (sellerReviews === 0) {
      sellerSuspicious = true;
      sellerConfidence = 90;
      sellerExplanation = `WARNING: Seller has zero history/reviews, which is characteristic of freshly deployed scam domains.`;
    } else if (sellerRating < 3.5) {
      sellerSuspicious = true;
      sellerConfidence = 85;
      sellerExplanation = `WARNING: Seller rating is critically low (${sellerRating}/5) with complaints about product quality.`;
    } else {
      sellerSuspicious = true;
      sellerConfidence = 65;
      sellerExplanation = `ALERT: Seller has low historical volume (${sellerReviews} reviews) making trust evaluations volatile.`;
    }
  }

  // 4. Brand Authenticity Risk (combines authorization logic)
  let brandSuspicious = false;
  let brandConfidence = 80;
  let brandExplanation = '';

  if (isOfficialBrandDomain) {
    brandSuspicious = false;
    brandConfidence = 99;
    brandExplanation = `${brandName} product is sold through their authenticated, direct brand channels.`;
  } else if (isLuxuryBrand) {
    // Luxury brands do not authorize sales on open platform marketplaces or random domains
    if (isTrustedPlatform) {
      brandSuspicious = false;
      brandConfidence = 85;
      brandExplanation = `${brandName} luxury products are carried by this authorized premium retailer.`;
    } else {
      brandSuspicious = true;
      brandConfidence = 90;
      brandExplanation = `ALERT: ${brandName} luxury items are strictly distributed. Sales on unauthorized domains carry near-certain counterfeit risk.`;
    }
  } else {
    // Non luxury brands
    if (isTrustedPlatform || sellerReviews > 200) {
      brandSuspicious = false;
      brandConfidence = 80;
      brandExplanation = `Authorized distribution network or high-reputation vendor verified.`;
    } else {
      brandSuspicious = true;
      brandConfidence = 70;
      brandExplanation = `Unverified supply chain. Distribution authorization could not be certified.`;
    }
  }

  // Compile individual signals
  const price_risk: RiskSignal = {
    status: priceSuspicious ? 'suspicious' : 'safe',
    confidence: priceConfidence,
    explanation: priceExplanation
  };

  const seller_risk: RiskSignal = {
    status: sellerSuspicious ? 'suspicious' : 'safe',
    confidence: sellerConfidence,
    explanation: sellerExplanation
  };

  const platform_risk: RiskSignal = {
    status: platformSuspicious ? 'suspicious' : 'safe',
    confidence: platformConfidence,
    explanation: platformExplanation
  };

  const brand_risk: RiskSignal = {
    status: brandSuspicious ? 'suspicious' : 'safe',
    confidence: brandConfidence,
    explanation: brandExplanation
  };

  // DECISION LOGIC: 
  // "Only when two or more signals are suspicious should the system display a Safe Shopping Alert."
  // Wait, "display a Safe Shopping Alert" is a bit ambiguous in the prompt:
  // "Only when two or more signals are suspicious should the system display a Safe Shopping Alert. 
  // Example: A Nike shoe with an 80% discount on Nike's official website should be marked as Safe, 
  // while a Nike shoe with an 80% discount from a new seller with zero reviews on an unknown website should display '⚠ High Risk: Possible Counterfeit Product.'"
  // Ah! "display a Safe Shopping Alert" means a warning alert (i.e. Counterfeit Alert). If 2 or more signals are suspicious, display the warning ("High Risk"). If 0 or 1 is suspicious, mark it as "Safe". Let's name the recommendations accordingly:
  // final_recommendation: 'safe' or 'danger'
  
  const suspiciousSignalsCount = [
    priceSuspicious,
    sellerSuspicious,
    platformSuspicious,
    brandSuspicious
  ].filter(Boolean).length;

  const isSuspicious = suspiciousSignalsCount >= 2;
  const final_recommendation = isSuspicious ? 'danger' : 'safe';

  // Calculate Overall Risk Score (0-100)
  let overall_score = 0;
  if (suspiciousSignalsCount === 0) {
    overall_score = Math.floor(Math.random() * 8) + 3; // 3% to 10%
  } else if (suspiciousSignalsCount === 1) {
    overall_score = Math.floor(Math.random() * 15) + 12; // 12% to 26% (Safe threshold)
  } else if (suspiciousSignalsCount === 2) {
    overall_score = Math.floor(Math.random() * 20) + 55; // 55% to 74% (Danger)
  } else if (suspiciousSignalsCount === 3) {
    overall_score = Math.floor(Math.random() * 10) + 78; // 78% to 87% (Danger)
  } else {
    overall_score = Math.floor(Math.random() * 8) + 91; // 91% to 98% (Danger)
  }

  // Explanation compilation
  let explanation = '';
  if (final_recommendation === 'danger') {
    explanation = `⚠ High Risk: Possible Counterfeit Product. A counterfeit alert is issued because ${suspiciousSignalsCount} cybersecurity risk signals were flagged: ` +
      [
        priceSuspicious ? 'Abnormal discount structures' : '',
        sellerSuspicious ? 'Low seller trust index' : '',
        platformSuspicious ? 'Suspicious platform domain hosting' : '',
        brandSuspicious ? 'Unauthorized brand supply path' : ''
      ].filter(Boolean).join(', ') + '.';
  } else {
    explanation = `✔ Safe Shopping. Although ${suspiciousSignalsCount === 1 ? 'one risk signal was noted' : 'some variables fluctuate'}, under our multi-signal consensus rule (requiring at least 2 flagged indicators), this transaction is considered safe.`;
  }

  return {
    user_id: userId,
    brand_name: brandName,
    product_name: productName,
    product_url: productUrl,
    price,
    discount_pct: discountPct,
    seller_name: sellerName,
    seller_reviews: sellerReviews,
    platform_name: platformName || urlDomain,
    price_risk,
    seller_risk,
    platform_risk,
    brand_risk,
    overall_score,
    final_recommendation,
    explanation
  };
};
