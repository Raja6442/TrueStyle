export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface RiskSignal {
  status: 'safe' | 'suspicious';
  confidence: number;
  explanation: string;
}

export interface ProductScan {
  id: string;
  user_id: string;
  brand_name: string;
  product_name: string;
  product_url?: string;
  image_url?: string;
  price: number;
  discount_pct: number;
  seller_name: string;
  seller_reviews: number;
  platform_name: string;
  price_risk: RiskSignal;
  seller_risk: RiskSignal;
  platform_risk: RiskSignal;
  brand_risk: RiskSignal;
  overall_score: number; // 0 (Safe) to 100 (Suspicious)
  final_recommendation: 'safe' | 'danger';
  explanation: string;
  created_at: string;
}

export interface FavoriteBrand {
  id: string;
  user_id: string;
  brand_name: string;
  created_at: string;
}

export interface BookmarkedProduct {
  id: string;
  user_id: string;
  scan_id: string;
  created_at: string;
}

export interface TrustedSeller {
  id: string;
  seller_name: string;
  platform: string;
  rating: number; // 0 to 5
  status: 'trusted' | 'suspicious';
  updated_at: string;
}

export interface OfficialBrand {
  id: string;
  brand_name: string;
  official_domains: string[];
  category: string;
  status: 'verified' | 'flagged';
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  rating: number; // 1 to 5
  comments: string;
  category: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  email_notifications: boolean;
  security_alerts: boolean;
  weekly_digest: boolean;
  theme: 'light' | 'dark';
}

export interface UserMetrics {
  user_id: string;
  total_scan_queries: number;
  threat_alerts_triggered: number;
  security_check_ratios: number; // percentage
  active_subscription: string;
  scan_threat_ratios: string;
  product_ratio: string;
  updated_at: string;
}
