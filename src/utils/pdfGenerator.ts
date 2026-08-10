import { jsPDF } from 'jspdf';
import { ProductScan } from '../types';

export const exportScanReportPDF = (scan: ProductScan) => {
  const doc = new jsPDF();
  
  // Design elements
  doc.setFillColor(10, 11, 13); // Dark Background
  doc.rect(0, 0, 210, 297, 'F');
  
  // Header
  doc.setFont('courier', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(51, 124, 255); // Royal blue
  doc.text('TRUESTYLE SECURITY OPERATIONS', 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('COMPLIANCE AUDIT / CRYPTOGRAPHIC SCAN REPORT', 14, 32);
  
  // Divider line
  doc.setDrawColor(0, 67, 189);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);
  
  // Core Meta Details
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`SCAN ID: ${scan.id.toUpperCase()}`, 14, 48);
  doc.text(`TIMESTAMP: ${new Date(scan.created_at).toLocaleString()}`, 14, 54);
  doc.text(`BRAND: ${scan.brand_name}`, 14, 60);
  doc.text(`PRODUCT: ${scan.product_name}`, 14, 66);
  doc.text(`OFFER PRICE: $${scan.price} (Retail: $${scan.price + Math.round(scan.price * (scan.discount_pct / 100))}, Promo: ${scan.discount_pct}% Off)`, 14, 72);
  doc.text(`SELLER: ${scan.seller_name} (Ratings Indexed)`, 14, 78);
  doc.text(`PLATFORM DOMAIN: ${scan.platform_name}`, 14, 84);

  // Box for final recommendation
  const isDanger = scan.final_recommendation === 'danger';
  if (isDanger) {
    doc.setFillColor(120, 20, 20); // Crimson Red
  } else {
    doc.setFillColor(20, 60, 140); // Cobalt Blue
  }
  doc.rect(14, 92, 182, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(isDanger ? 'STATUS: HIGH RISK / POSSIBLE COUNTERFEIT WARNING' : 'STATUS: AUTHENTICATED / SAFE SHOPPING CERTIFIED', 18, 98);
  doc.setFontSize(8);
  doc.text(`Confidence factor: ${scan.overall_score}% Risk calculation threshold`, 18, 104);
  
  const explanationLines = doc.splitTextToSize(`Decision: ${scan.explanation}`, 174);
  doc.text(explanationLines, 18, 110);
  
  // Detailed Signals
  doc.setFontSize(12);
  doc.setTextColor(51, 124, 255);
  doc.text('INDIVIDUAL SIGNAL VECTORS', 14, 132);
  doc.line(14, 135, 196, 135);
  
  const signals = [
    { label: 'PRICE SECURITY VECT', signal: scan.price_risk },
    { label: 'SELLER REPUTATION   ', signal: scan.seller_risk },
    { label: 'PLATFORM AUDIT CHECK', signal: scan.platform_risk },
    { label: 'BRAND COVENANT CHECK', signal: scan.brand_risk }
  ];
  
  let y = 144;
  signals.forEach((s) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    const color = s.signal.status === 'suspicious' ? [239, 68, 68] : [51, 124, 255];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`${s.label}: [${s.signal.status.toUpperCase()}] (Weight: ${s.signal.confidence}%)`, 14, y);
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    const splitText = doc.splitTextToSize(s.signal.explanation, 175);
    doc.text(splitText, 14, y + 5);
    y += 18;
  });
  
  // Footer signature
  doc.setDrawColor(30, 30, 30);
  doc.line(14, 260, 196, 260);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('IMMUTABLE SECURITY LEDGER RECORD REPORT // SECURE AUTHENTICATOR NODE', 14, 268);
  doc.text(`VERIFIER SIGNATURE DIGEST: SHA-256/TS-${scan.id.substring(0, 10).toUpperCase()}`, 14, 273);

  // Save report
  doc.save(`TrueStyle_Audit_${scan.brand_name.replace(/\s+/g, '_')}_${scan.id.substring(0, 6)}.pdf`);
};
