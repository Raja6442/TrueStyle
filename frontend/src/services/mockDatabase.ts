import { 
  Profile, 
  ProductScan, 
  FavoriteBrand, 
  BookmarkedProduct, 
  TrustedSeller, 
  OfficialBrand, 
  SupportTicket, 
  Feedback, 
  AuditLog, 
  UserPreferences,
  UserMetrics 
} from '../types';

// Helper to generate UUIDs
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Seed Data
const DEFAULT_BRANDS: OfficialBrand[] = [
  { id: 'brand-1', brand_name: 'Nike', official_domains: ['nike.com', 'nike.co.jp', 'nike.ae', 'nike.in', 'nike.co.in'], category: 'Sportswear', status: 'verified', updated_at: '2026-07-01T12:00:00Z' },
  { id: 'brand-2', brand_name: 'Gucci', official_domains: ['gucci.com', 'gucci.cn', 'gucci.in', 'gucci.co.in'], category: 'Luxury', status: 'verified', updated_at: '2026-07-02T12:00:00Z' },
  { id: 'brand-3', brand_name: 'Louis Vuitton', official_domains: ['louisvuitton.com', 'louisvuitton.in'], category: 'Luxury', status: 'verified', updated_at: '2026-07-03T12:00:00Z' },
  { id: 'brand-4', brand_name: 'Adidas', official_domains: ['adidas.com', 'adidas.co.uk', 'adidas.in', 'adidas.co.in'], category: 'Sportswear', status: 'verified', updated_at: '2026-07-04T12:00:00Z' },
  { id: 'brand-5', brand_name: 'Rolex', official_domains: ['rolex.com'], category: 'Luxury Watches', status: 'verified', updated_at: '2026-07-05T12:00:00Z' },
  { id: 'brand-6', brand_name: 'Prada', official_domains: ['prada.com'], category: 'Luxury', status: 'verified', updated_at: '2026-07-06T12:00:00Z' },
  { id: 'brand-7', brand_name: 'Off-White', official_domains: ['off---white.com'], category: 'Streetwear', status: 'verified', updated_at: '2026-07-07T12:00:00Z' },
  { id: 'brand-8', brand_name: 'Balenciaga', official_domains: ['balenciaga.com'], category: 'Luxury', status: 'verified', updated_at: '2026-07-08T12:00:00Z' }
];

const DEFAULT_SELLERS: TrustedSeller[] = [
  { id: 'seller-1', seller_name: 'Amazon Official', platform: 'Amazon', rating: 4.8, status: 'trusted', updated_at: '2026-07-10T12:00:00Z' },
  { id: 'seller-2', seller_name: 'Nike Store', platform: 'Nike Official', rating: 5.0, status: 'trusted', updated_at: '2026-07-11T12:00:00Z' },
  { id: 'seller-3', seller_name: 'Gucci Official Shop', platform: 'Gucci Portal', rating: 5.0, status: 'trusted', updated_at: '2026-07-12T12:00:00Z' },
  { id: 'seller-4', seller_name: 'Farfetch Luxury', platform: 'Farfetch', rating: 4.7, status: 'trusted', updated_at: '2026-07-13T12:00:00Z' },
  { id: 'seller-5', seller_name: 'Nordstrom Dept', platform: 'Nordstrom', rating: 4.6, status: 'trusted', updated_at: '2026-07-14T12:00:00Z' },
  { id: 'seller-6', seller_name: 'Cheap Luxury Steals', platform: 'Shopify Store', rating: 1.2, status: 'suspicious', updated_at: '2026-07-15T12:00:00Z' },
  { id: 'seller-7', seller_name: 'RepFashionHub', platform: 'Instagram DM', rating: 0.5, status: 'suspicious', updated_at: '2026-07-16T12:00:00Z' },
  { id: 'seller-8', seller_name: 'SuperLuxuryDiscounts', platform: 'Unknown Platform', rating: 2.1, status: 'suspicious', updated_at: '2026-07-17T12:00:00Z' },
  { id: 'seller-9', seller_name: 'HypebeastOutlet', platform: 'eBay', rating: 3.2, status: 'suspicious', updated_at: '2026-07-18T12:00:00Z' }
];

const MOCK_USER_ID = 'user-uuid-2222';
const MOCK_ADMIN_ID = 'admin-uuid-1111';

const DEFAULT_PROFILES: Profile[] = [
  { id: MOCK_USER_ID, full_name: 'Jane Doe', email: 'user@truestyle.security', role: 'user', created_at: '2026-06-01T10:00:00Z' },
  { id: MOCK_ADMIN_ID, full_name: 'Security Admin', email: 'admin@truestyle.security', role: 'admin', created_at: '2026-06-01T09:00:00Z' }
];

const DEFAULT_PREFERENCES: UserPreferences[] = [
  { user_id: MOCK_USER_ID, email_notifications: true, security_alerts: true, weekly_digest: false, theme: 'dark' },
  { user_id: MOCK_ADMIN_ID, email_notifications: true, security_alerts: true, weekly_digest: true, theme: 'dark' }
];

const DEFAULT_SCANS: ProductScan[] = [
  {
    id: 'scan-1',
    user_id: MOCK_USER_ID,
    brand_name: 'Nike',
    product_name: 'Air Jordan 1 Retro High',
    product_url: 'https://nike.com/air-jordan-1',
    image_url: '',
    price: 180,
    discount_pct: 10,
    seller_name: 'Nike Store',
    seller_reviews: 450,
    platform_name: 'nike.com',
    price_risk: { status: 'safe', confidence: 98, explanation: 'The 10% discount is typical for official members programs.' },
    seller_risk: { status: 'safe', confidence: 100, explanation: 'Seller is Nike Store, a verified official dealer.' },
    platform_risk: { status: 'safe', confidence: 100, explanation: 'The domain matches verified official Nike domains.' },
    brand_risk: { status: 'safe', confidence: 95, explanation: 'Nike products on official domains are authenticated.' },
    overall_score: 5,
    final_recommendation: 'safe',
    explanation: 'Nike Air Jordan 1 sold directly on Nike.com. Zero security threats detected.',
    created_at: '2026-07-10T14:30:00Z'
  },
  {
    id: 'scan-2',
    user_id: MOCK_USER_ID,
    brand_name: 'Gucci',
    product_name: 'GG Marmont Shoulder Bag',
    product_url: 'https://cheapluxurybags.ru/gucci-marmont',
    image_url: '',
    price: 250,
    discount_pct: 88,
    seller_name: 'Cheap Luxury Steals',
    seller_reviews: 3,
    platform_name: 'cheapluxurybags.ru',
    price_risk: { status: 'suspicious', confidence: 95, explanation: 'An 88% discount on an item retailing for ₹2,100 is highly abnormal.' },
    seller_risk: { status: 'suspicious', confidence: 90, explanation: 'Seller has only 3 reviews with an average rating of 1.2/5.' },
    platform_risk: { status: 'suspicious', confidence: 99, explanation: 'The platform domain cheapluxurybags.ru is unverified and has high security vulnerability warnings.' },
    brand_risk: { status: 'suspicious', confidence: 92, explanation: 'Gucci does not authorize extreme discount sales on Russian domains.' },
    overall_score: 94,
    final_recommendation: 'danger',
    explanation: '⚠ High Risk: Counterfeit Alert. Multiple suspicious signals were identified: price markdown is extreme (88%), the seller is unrated, and the domain is unauthorized.',
    created_at: '2026-07-12T16:45:00Z'
  },
  {
    id: 'scan-3',
    user_id: MOCK_USER_ID,
    brand_name: 'Louis Vuitton',
    product_name: 'LV Neverfull MM Bag',
    product_url: 'https://ebay.com/itm/neverfull-lv',
    image_url: '',
    price: 600,
    discount_pct: 70,
    seller_name: 'HypebeastOutlet',
    seller_reviews: 12,
    platform_name: 'ebay.com',
    price_risk: { status: 'suspicious', confidence: 85, explanation: '70% discount on a luxury bag that never goes on sale is a massive red flag.' },
    seller_risk: { status: 'suspicious', confidence: 80, explanation: 'Seller has only 12 reviews, some indicating shipping delays and item discrepancies.' },
    platform_risk: { status: 'safe', confidence: 88, explanation: 'eBay is an established platform, but is a third-party open marketplace subject to seller fraud.' },
    brand_risk: { status: 'suspicious', confidence: 85, explanation: 'Louis Vuitton does not offer wholesale or discounted sales on open platforms.' },
    overall_score: 83,
    final_recommendation: 'danger',
    explanation: '⚠ High Risk: Possible Counterfeit Product. A 70% discount on Louis Vuitton by an unrated reseller on eBay is extremely suspicious.',
    created_at: '2026-07-18T08:15:00Z'
  },
  {
    id: 'scan-4',
    user_id: MOCK_USER_ID,
    brand_name: 'Adidas',
    product_name: 'Ultraboost Light Running Shoes',
    product_url: 'https://nordstrom.com/adidas-ultraboorst',
    image_url: '',
    price: 90,
    discount_pct: 50,
    seller_name: 'Nordstrom Dept',
    seller_reviews: 1800,
    platform_name: 'nordstrom.com',
    price_risk: { status: 'suspicious', confidence: 40, explanation: '50% discount is high, but common for clearance sales.' },
    seller_risk: { status: 'safe', confidence: 99, explanation: 'Nordstrom is a trusted departmental retail chain.' },
    platform_risk: { status: 'safe', confidence: 100, explanation: 'Nordstrom.com is a verified authentic platform.' },
    brand_risk: { status: 'safe', confidence: 95, explanation: 'Adidas authorizes Nordstrom as a official retailer.' },
    overall_score: 18,
    final_recommendation: 'safe',
    explanation: 'This purchase is Safe. Although the price discount is substantial, the seller and marketplace are officially verified and authorized.',
    created_at: '2026-07-22T11:20:00Z'
  },
  {
    id: 'scan-5',
    user_id: MOCK_USER_ID,
    brand_name: 'Nike',
    product_name: 'Air Force 1 Sneakers',
    product_url: 'https://nike.com/air-force-1',
    image_url: '',
    price: 22,
    discount_pct: 80,
    seller_name: 'Nike Store',
    seller_reviews: 4500,
    platform_name: 'nike.com',
    price_risk: { status: 'suspicious', confidence: 75, explanation: 'An 80% discount on Nike Air Force 1 is unusually high, but not impossible during exclusive clearance events.' },
    seller_risk: { status: 'safe', confidence: 100, explanation: 'Seller is the official Nike corporate store.' },
    platform_risk: { status: 'safe', confidence: 100, explanation: 'Domain is verified as nike.com (the official brand portal).' },
    brand_risk: { status: 'safe', confidence: 100, explanation: 'Official distribution is secure.' },
    overall_score: 15,
    final_recommendation: 'safe',
    explanation: 'This transaction is marked Safe. Under our decision criteria: even with a suspicious price drop (80%), since the platform and seller are verified Nike official properties, shopping is authenticated.',
    created_at: '2026-07-24T15:40:00Z'
  }
];

const DEFAULT_FAVORITES: FavoriteBrand[] = [
  { id: 'fav-1', user_id: MOCK_USER_ID, brand_name: 'Nike', created_at: '2026-07-10T14:32:00Z' },
  { id: 'fav-2', user_id: MOCK_USER_ID, brand_name: 'Gucci', created_at: '2026-07-12T16:47:00Z' }
];

const DEFAULT_BOOKMARKS: BookmarkedProduct[] = [
  { id: 'book-1', user_id: MOCK_USER_ID, scan_id: 'scan-1', created_at: '2026-07-10T14:35:00Z' },
  { id: 'book-2', user_id: MOCK_USER_ID, scan_id: 'scan-2', created_at: '2026-07-12T16:50:00Z' }
];

const DEFAULT_TICKETS: SupportTicket[] = [
  { id: 'ticket-1', user_id: MOCK_USER_ID, name: 'Jane Doe', email: 'user@truestyle.security', subject: 'Inquiry regarding Russian domains', message: 'I scanned cheapluxurybags.ru and it flagged as dangerous, is this correct?', status: 'open', created_at: '2026-07-13T10:00:00Z' },
  { id: 'ticket-2', user_id: MOCK_USER_ID, name: 'Jane Doe', email: 'user@truestyle.security', subject: 'PDF report failed to load', message: 'I tried exporting a PDF report and it failed, can you help?', status: 'resolved', created_at: '2026-07-14T09:00:00Z' }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', actor_id: MOCK_ADMIN_ID, actor_name: 'Security Admin', action: 'database_seed', details: 'Initialized mock database seeds for TrueStyle release.', ip_address: '192.168.1.1', created_at: '2026-07-28T10:00:00Z' },
  { id: 'log-2', actor_id: MOCK_USER_ID, actor_name: 'Jane Doe', action: 'user_registration', details: 'Registered a user profile in persistent mock DB.', ip_address: '192.168.1.5', created_at: '2026-07-28T10:05:00Z' },
  { id: 'log-3', actor_id: MOCK_USER_ID, actor_name: 'Jane Doe', action: 'otp_verification', details: 'Completed simulated OTP email verification process.', ip_address: '192.168.1.5', created_at: '2026-07-28T10:06:00Z' }
];

const DEFAULT_FEEDBACK: Feedback[] = [
  { id: 'feed-1', user_id: MOCK_USER_ID, rating: 5, comments: 'TrueStyle saved me from buying fake Air Force 1s. The detection workflow is incredibly detailed!', category: 'Accuracy', created_at: '2026-07-25T12:00:00Z' }
];

const DEFAULT_USER_METRICS: UserMetrics[] = [
  {
    user_id: MOCK_USER_ID,
    total_scan_queries: 4,
    threat_alerts_triggered: 1,
    security_check_ratios: 25.0,
    active_subscription: 'SHIELD FREE CORE',
    scan_threat_ratios: '3/1',
    product_ratio: '4',
    updated_at: '2026-08-13T10:00:00Z'
  }
];

// LocalStorage Database implementation
class MockDatabase {
  private getStorage<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(`truestyle_db_${key}`);
    if (!data) {
      this.setStorage(key, defaultValue);
      return defaultValue;
    }
    return JSON.parse(data) as T;
  }

  private setStorage<T>(key: string, value: T): void {
    localStorage.setItem(`truestyle_db_${key}`, JSON.stringify(value));
  }

  // Initialize DB with seeds
  public initialize() {
    this.getStorage<OfficialBrand[]>('brands', DEFAULT_BRANDS);
    this.getStorage<TrustedSeller[]>('sellers', DEFAULT_SELLERS);
    this.getStorage<Profile[]>('profiles', DEFAULT_PROFILES);
    this.getStorage<ProductScan[]>('scans', DEFAULT_SCANS);
    this.getStorage<FavoriteBrand[]>('favorites', DEFAULT_FAVORITES);
    this.getStorage<BookmarkedProduct[]>('bookmarks', DEFAULT_BOOKMARKS);
    this.getStorage<SupportTicket[]>('tickets', DEFAULT_TICKETS);
    this.getStorage<AuditLog[]>('logs', DEFAULT_AUDIT_LOGS);
    this.getStorage<Feedback[]>('feedback', DEFAULT_FEEDBACK);
    this.getStorage<UserPreferences[]>('preferences', DEFAULT_PREFERENCES);

    // Hotfix: Ensure regional domains (like .in, .co.in) are patched into existing storage
    const brands = this.getStorage<OfficialBrand[]>('brands', DEFAULT_BRANDS);
    let updatedBrands = false;
    
    const nike = brands.find(b => b.brand_name === 'Nike');
    if (nike) {
      if (!nike.official_domains.includes('nike.in')) { nike.official_domains.push('nike.in'); updatedBrands = true; }
      if (!nike.official_domains.includes('nike.co.in')) { nike.official_domains.push('nike.co.in'); updatedBrands = true; }
    }
    
    const adidas = brands.find(b => b.brand_name === 'Adidas');
    if (adidas) {
      if (!adidas.official_domains.includes('adidas.in')) { adidas.official_domains.push('adidas.in'); updatedBrands = true; }
      if (!adidas.official_domains.includes('adidas.co.in')) { adidas.official_domains.push('adidas.co.in'); updatedBrands = true; }
    }

    if (updatedBrands) {
      this.setStorage('brands', brands);
    }
  }

  // Clear / Reset DB
  public reset() {
    this.setStorage('brands', DEFAULT_BRANDS);
    this.setStorage('sellers', DEFAULT_SELLERS);
    this.setStorage('profiles', DEFAULT_PROFILES);
    this.setStorage('scans', DEFAULT_SCANS);
    this.setStorage('favorites', DEFAULT_FAVORITES);
    this.setStorage('bookmarks', DEFAULT_BOOKMARKS);
    this.setStorage('tickets', DEFAULT_TICKETS);
    this.setStorage('logs', DEFAULT_AUDIT_LOGS);
    this.setStorage('feedback', DEFAULT_FEEDBACK);
    this.setStorage('preferences', DEFAULT_PREFERENCES);
  }

  // profiles Table Methods
  public getProfiles(): Profile[] {
    return this.getStorage<Profile[]>('profiles', DEFAULT_PROFILES);
  }
  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }
  public getProfileByEmail(email: string): Profile | undefined {
    return this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  }
  public saveProfile(profile: Profile): void {
    const list = this.getProfiles();
    const index = list.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      list[index] = profile;
    } else {
      list.push(profile);
    }
    this.setStorage('profiles', list);
  }

  // product_scans Table Methods
  public getScans(userId?: string): ProductScan[] {
    let all = this.getStorage<ProductScan[]>('scans', DEFAULT_SCANS);
    if (userId) {
      let userScans = all.filter(s => s.user_id === userId);
      return userScans;
    }
    return all;
  }
  public addScan(scan: Omit<ProductScan, 'id' | 'created_at'>): ProductScan {
    const newScan: ProductScan = {
      ...scan,
      id: `scan-${generateUUID()}`,
      created_at: new Date().toISOString()
    };
    const list = this.getScans();
    list.unshift(newScan); // Prepend so it shows first in history
    this.setStorage('scans', list);
    return newScan;
  }
  public deleteScan(scanId: string): void {
    const list = this.getScans();
    const filtered = list.filter(s => s.id !== scanId);
    this.setStorage('scans', filtered);
  }

  // official_brands Table Methods
  public getBrands(): OfficialBrand[] {
    return this.getStorage<OfficialBrand[]>('brands', DEFAULT_BRANDS);
  }
  public addBrand(brand: Omit<OfficialBrand, 'id' | 'updated_at'>): OfficialBrand {
    const newBrand: OfficialBrand = {
      ...brand,
      id: `brand-${generateUUID()}`,
      updated_at: new Date().toISOString()
    };
    const list = this.getBrands();
    list.push(newBrand);
    this.setStorage('brands', list);
    return newBrand;
  }
  public updateBrand(brand: OfficialBrand): void {
    const list = this.getBrands();
    const index = list.findIndex(b => b.id === brand.id);
    if (index >= 0) {
      list[index] = { ...brand, updated_at: new Date().toISOString() };
      this.setStorage('brands', list);
    }
  }
  public deleteBrand(brandId: string): void {
    const list = this.getBrands();
    const filtered = list.filter(b => b.id !== brandId);
    this.setStorage('brands', filtered);
  }

  // trusted_sellers Table Methods
  public getSellers(): TrustedSeller[] {
    return this.getStorage<TrustedSeller[]>('sellers', DEFAULT_SELLERS);
  }
  public addSeller(seller: Omit<TrustedSeller, 'id' | 'updated_at'>): TrustedSeller {
    const newSeller: TrustedSeller = {
      ...seller,
      id: `seller-${generateUUID()}`,
      updated_at: new Date().toISOString()
    };
    const list = this.getSellers();
    list.push(newSeller);
    this.setStorage('sellers', list);
    return newSeller;
  }
  public updateSeller(seller: TrustedSeller): void {
    const list = this.getSellers();
    const index = list.findIndex(s => s.id === seller.id);
    if (index >= 0) {
      list[index] = { ...seller, updated_at: new Date().toISOString() };
      this.setStorage('sellers', list);
    }
  }
  public deleteSeller(sellerId: string): void {
    const list = this.getSellers();
    const filtered = list.filter(s => s.id !== sellerId);
    this.setStorage('sellers', filtered);
  }

  // favorite_brands Methods
  public getFavorites(userId: string): FavoriteBrand[] {
    let all = this.getStorage<FavoriteBrand[]>('favorites', DEFAULT_FAVORITES);
    let userFavs = all.filter(f => f.user_id === userId);
    return userFavs;
  }
  public isFavorite(userId: string, brandName: string): boolean {
    return this.getFavorites(userId).some(f => f.brand_name.toLowerCase() === brandName.toLowerCase());
  }
  public toggleFavorite(userId: string, brandName: string): void {
    const all = this.getStorage<FavoriteBrand[]>('favorites', DEFAULT_FAVORITES);
    const index = all.findIndex(f => f.user_id === userId && f.brand_name.toLowerCase() === brandName.toLowerCase());
    if (index >= 0) {
      all.splice(index, 1);
    } else {
      all.push({
        id: `fav-${generateUUID()}`,
        user_id: userId,
        brand_name: brandName,
        created_at: new Date().toISOString()
      });
    }
    this.setStorage('favorites', all);
  }

  // bookmarked_products Methods
  public getBookmarks(userId: string): BookmarkedProduct[] {
    let all = this.getStorage<BookmarkedProduct[]>('bookmarks', DEFAULT_BOOKMARKS);
    let userMarks = all.filter(b => b.user_id === userId);
    return userMarks;
  }
  public isBookmarked(userId: string, scanId: string): boolean {
    return this.getBookmarks(userId).some(b => b.scan_id === scanId);
  }
  public toggleBookmark(userId: string, scanId: string): void {
    const all = this.getStorage<BookmarkedProduct[]>('bookmarks', DEFAULT_BOOKMARKS);
    const index = all.findIndex(b => b.user_id === userId && b.scan_id === scanId);
    if (index >= 0) {
      all.splice(index, 1);
    } else {
      all.push({
        id: `book-${generateUUID()}`,
        user_id: userId,
        scan_id: scanId,
        created_at: new Date().toISOString()
      });
    }
    this.setStorage('bookmarks', all);
  }

  // support_tickets Methods
  public getTickets(userId?: string): SupportTicket[] {
    const all = this.getStorage<SupportTicket[]>('tickets', DEFAULT_TICKETS);
    if (userId) {
      return all.filter(t => t.user_id === userId);
    }
    return all;
  }
  public addTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'created_at'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket-${generateUUID()}`,
      status: 'open',
      created_at: new Date().toISOString()
    };
    const list = this.getTickets();
    list.unshift(newTicket);
    this.setStorage('tickets', list);
    return newTicket;
  }
  public updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved'): void {
    const list = this.getTickets();
    const index = list.findIndex(t => t.id === ticketId);
    if (index >= 0) {
      list[index].status = status;
      this.setStorage('tickets', list);
    }
  }

  // audit_logs Methods
  public getLogs(): AuditLog[] {
    return this.getStorage<AuditLog[]>('logs', DEFAULT_AUDIT_LOGS);
  }
  public addLog(log: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `log-${generateUUID()}`,
      created_at: new Date().toISOString()
    };
    const list = this.getLogs();
    list.unshift(newLog);
    this.setStorage('logs', list);
    return newLog;
  }

  // feedback Methods
  public getFeedback(): Feedback[] {
    return this.getStorage<Feedback[]>('feedback', DEFAULT_FEEDBACK);
  }
  public addFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Feedback {
    const newFeedback: Feedback = {
      ...feedback,
      id: `feed-${generateUUID()}`,
      created_at: new Date().toISOString()
    };
    const list = this.getFeedback();
    list.unshift(newFeedback);
    this.setStorage('feedback', list);
    return newFeedback;
  }

  // user preferences Methods
  public getPreferences(userId: string): UserPreferences {
    const prefs = this.getStorage<UserPreferences[]>('preferences', DEFAULT_PREFERENCES);
    const userPref = prefs.find(p => p.user_id === userId);
    if (userPref) return userPref;
    
    // Create default preferences if not found
    const newPref: UserPreferences = {
      user_id: userId,
      email_notifications: true,
      security_alerts: true,
      weekly_digest: false,
      theme: 'dark'
    };
    prefs.push(newPref);
    this.setStorage('preferences', prefs);
    return newPref;
  }
  public updatePreferences(userId: string, updates: Partial<UserPreferences>): void {
    const prefs = this.getStorage<UserPreferences[]>('preferences', DEFAULT_PREFERENCES);
    const index = prefs.findIndex(p => p.user_id === userId);
    if (index >= 0) {
      prefs[index] = { ...prefs[index], ...updates };
      this.setStorage('preferences', prefs);
    }
  }

  public savePreferences(prefs: UserPreferences): void {
    const list = this.getStorage<UserPreferences[]>('preferences', DEFAULT_PREFERENCES);
    const updated = list.map(p => p.user_id === prefs.user_id ? prefs : p);
    if (!list.find(p => p.user_id === prefs.user_id)) updated.push(prefs);
    this.setStorage('preferences', updated);
  }

  // user metrics Methods
  public getUserMetrics(userId: string): UserMetrics {
    const metricsList = this.getStorage<UserMetrics[]>('user_metrics', DEFAULT_USER_METRICS);
    const userMetric = metricsList.find(m => m.user_id === userId);
    if (userMetric) return userMetric;
    
    const newMetric: UserMetrics = {
      user_id: userId,
      total_scan_queries: 0,
      threat_alerts_triggered: 0,
      security_check_ratios: 0,
      active_subscription: 'SHIELD FREE CORE',
      scan_threat_ratios: '0/0',
      product_ratio: '0',
      updated_at: new Date().toISOString()
    };
    metricsList.push(newMetric);
    this.setStorage('user_metrics', metricsList);
    return newMetric;
  }
  public saveUserMetrics(metrics: UserMetrics): void {
    const list = this.getStorage<UserMetrics[]>('user_metrics', DEFAULT_USER_METRICS);
    const updated = list.map(m => m.user_id === metrics.user_id ? metrics : m);
    if (!list.find(m => m.user_id === metrics.user_id)) updated.push(metrics);
    this.setStorage('user_metrics', updated);
  }
}

export const mockDb = new MockDatabase();
mockDb.initialize();
