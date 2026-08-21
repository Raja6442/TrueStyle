import { mockDb } from './mockDatabase';
import { supabase } from '../supabaseClient';
import { 
  Profile, ProductScan, FavoriteBrand, BookmarkedProduct, 
  TrustedSeller, OfficialBrand, SupportTicket, Feedback, 
  AuditLog, UserPreferences, UserMetrics
} from '../types';

const handleDbError = (error: any, fallbackMessage: string) => {
  console.warn(`Supabase Database Alert: ${fallbackMessage}. Details:`, error.message);
  return true;
};

export const dbRouter = {
  // profiles CRUD
  getProfiles: async (): Promise<Profile[]> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data as Profile[];
    } catch (e) {
      handleDbError(e, "getProfiles failed");
    }
    return mockDb.getProfiles();
  },

  getProfileById: async (id: string): Promise<Profile | undefined> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
      if (data) return data as Profile;
    } catch (e) {
      handleDbError(e, `getProfileById failed`);
    }
    return mockDb.getProfileById(id);
  },
  
  getProfileByEmail: async (email: string): Promise<Profile | undefined> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').ilike('email', email).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data as Profile;
    } catch (e) {
      handleDbError(e, `getProfileByEmail failed`);
    }
    return mockDb.getProfileByEmail(email);
  },

  getProfile: async (id: string): Promise<Profile | undefined> => {
    return dbRouter.getProfileById(id);
  },

  saveProfile: async (profile: Profile): Promise<void> => {
    try {
      const { error } = await supabase.from('profiles').upsert(profile);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "saveProfile failed");
    }
    mockDb.saveProfile(profile);
  },

  // product_scans CRUD
  getScans: async (userId?: string): Promise<ProductScan[]> => {
    let supabaseScans: ProductScan[] = [];
    try {
      let query = supabase.from('product_scans').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data) supabaseScans = data as ProductScan[];
    } catch (e) {
      handleDbError(e, "getScans failed");
    }
    
    // Merge with mockDB
    const localScans = mockDb.getScans(userId);
    const allScans = [...supabaseScans, ...localScans];
    const uniqueById = Array.from(new Map(allScans.map(s => [s.id, s])).values());
    const uniqueScans = Array.from(new Map(uniqueById.map(s => 
      [`${s.brand_name}-${s.product_name}-${s.platform_name}`, s]
    )).values());
    
    return uniqueScans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getCommunityReports: async (): Promise<ProductScan[]> => {
    try {
      const { data, error } = await supabase
        .from('product_scans')
        .select('*')
        .eq('brand_name', 'Community Report')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      if (data) return data as ProductScan[];
    } catch (e) {
      console.warn("Failed to get community reports", e);
    }
    
    // Fallback to local scans
    const allScans = mockDb.getScans('any');
    return allScans
      .filter(s => s.brand_name === 'Community Report')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20);
  },

  addScan: async (scan: Omit<ProductScan, 'id' | 'created_at'>): Promise<ProductScan> => {
    try {
      // Remove any undefined keys since Supabase does not support them
      const docData = { ...scan };
      Object.keys(docData).forEach(key => (docData as any)[key] === undefined && delete (docData as any)[key]);
      
      const { data, error } = await supabase.from('product_scans').insert(docData).select().single();
      if (error) throw error;
      
      // Update the user's metrics in the database
      if (scan.user_id) {
        await dbRouter.syncUserMetrics(scan.user_id);
      }
      
      return data as ProductScan;
    } catch (e) {
      handleDbError(e, "addScan failed");
    }
    return mockDb.addScan(scan);
  },

  deleteScan: async (scanId: string): Promise<void> => {
    try {
      const { data } = await supabase.from('product_scans').select('user_id').eq('id', scanId).single();
      const userId = data?.user_id;

      const { error } = await supabase.from('product_scans').delete().eq('id', scanId);
      if (error) throw error;

      if (userId) {
        await dbRouter.syncUserMetrics(userId);
      }
    } catch (e) {
      handleDbError(e, "deleteScan failed");
    }
    mockDb.deleteScan(scanId);
  },

  // official_brands CRUD
  getBrands: async (): Promise<OfficialBrand[]> => {
    try {
      const { data, error } = await supabase.from('official_brands').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data as OfficialBrand[];
    } catch (e) {
      handleDbError(e, "getBrands failed");
    }
    return mockDb.getBrands();
  },

  addBrand: async (brand: Omit<OfficialBrand, 'id' | 'updated_at'>): Promise<OfficialBrand> => {
    try {
      const { data, error } = await supabase.from('official_brands').insert(brand).select().single();
      if (error) throw error;
      return data as OfficialBrand;
    } catch (e) {
      handleDbError(e, "addBrand failed");
    }
    return mockDb.addBrand(brand);
  },

  updateBrand: async (brand: OfficialBrand): Promise<void> => {
    try {
      const { error } = await supabase.from('official_brands').update({ ...brand, updated_at: new Date().toISOString() }).eq('id', brand.id);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "updateBrand failed");
    }
    mockDb.updateBrand(brand);
  },

  deleteBrand: async (brandId: string): Promise<void> => {
    try {
      const { error } = await supabase.from('official_brands').delete().eq('id', brandId);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "deleteBrand failed");
    }
    mockDb.deleteBrand(brandId);
  },

  // trusted_sellers CRUD
  getSellers: async (): Promise<TrustedSeller[]> => {
    try {
      const { data, error } = await supabase.from('trusted_sellers').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data as TrustedSeller[];
    } catch (e) {
      handleDbError(e, "getSellers failed");
    }
    return mockDb.getSellers();
  },

  addSeller: async (seller: Omit<TrustedSeller, 'id' | 'updated_at'>): Promise<TrustedSeller> => {
    try {
      const { data, error } = await supabase.from('trusted_sellers').insert(seller).select().single();
      if (error) throw error;
      return data as TrustedSeller;
    } catch (e) {
      handleDbError(e, "addSeller failed");
    }
    return mockDb.addSeller(seller);
  },

  updateSeller: async (seller: TrustedSeller): Promise<void> => {
    try {
      const { error } = await supabase.from('trusted_sellers').update({ ...seller, updated_at: new Date().toISOString() }).eq('id', seller.id);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "updateSeller failed");
    }
    mockDb.updateSeller(seller);
  },

  deleteSeller: async (sellerId: string): Promise<void> => {
    try {
      const { error } = await supabase.from('trusted_sellers').delete().eq('id', sellerId);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "deleteSeller failed");
    }
    mockDb.deleteSeller(sellerId);
  },

  // favorites CRUD
  getFavorites: async (userId: string): Promise<FavoriteBrand[]> => {
    try {
      const { data, error } = await supabase.from('favorite_brands').select('*').eq('user_id', userId);
      if (error) throw error;
      if (data && data.length > 0) return data as FavoriteBrand[];
    } catch (e) {
      handleDbError(e, "getFavorites failed");
    }
    return mockDb.getFavorites(userId);
  },

  isFavorite: async (userId: string, brandName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('favorite_brands').select('id').eq('user_id', userId).eq('brand_name', brandName);
      if (error) throw error;
      return data && data.length > 0;
    } catch (e) {
      handleDbError(e, "isFavorite failed");
    }
    return mockDb.isFavorite(userId, brandName);
  },

  toggleFavorite: async (userId: string, brandName: string): Promise<void> => {
    try {
      const isFav = await dbRouter.isFavorite(userId, brandName);
      if (isFav) {
        await supabase.from('favorite_brands').delete().eq('user_id', userId).eq('brand_name', brandName);
      } else {
        await supabase.from('favorite_brands').insert({ user_id: userId, brand_name: brandName });
      }
    } catch (e) {
      handleDbError(e, "toggleFavorite failed");
    }
    mockDb.toggleFavorite(userId, brandName);
  },

  // bookmarks CRUD
  getBookmarks: async (userId: string): Promise<BookmarkedProduct[]> => {
    try {
      const { data, error } = await supabase.from('bookmarked_products').select('*').eq('user_id', userId);
      if (error) throw error;
      if (data && data.length > 0) return data as BookmarkedProduct[];
    } catch (e) {
      handleDbError(e, "getBookmarks failed");
    }
    return mockDb.getBookmarks(userId);
  },

  isBookmarked: async (userId: string, scanId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('bookmarked_products').select('id').eq('user_id', userId).eq('scan_id', scanId);
      if (error) throw error;
      return data && data.length > 0;
    } catch (e) {
      handleDbError(e, "isBookmarked failed");
    }
    return mockDb.isBookmarked(userId, scanId);
  },

  toggleBookmark: async (userId: string, scanId: string): Promise<void> => {
    try {
      const isBook = await dbRouter.isBookmarked(userId, scanId);
      if (isBook) {
        await supabase.from('bookmarked_products').delete().eq('user_id', userId).eq('scan_id', scanId);
      } else {
        await supabase.from('bookmarked_products').insert({ user_id: userId, scan_id: scanId });
      }
    } catch (e) {
      handleDbError(e, "toggleBookmark failed");
    }
    mockDb.toggleBookmark(userId, scanId);
  },

  // support_tickets CRUD
  getTickets: async (): Promise<SupportTicket[]> => {
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data as SupportTicket[];
    } catch (e) {
      handleDbError(e, "getTickets failed");
    }
    return mockDb.getTickets();
  },

  addTicket: async (ticket: Omit<SupportTicket, 'id' | 'status' | 'created_at'>): Promise<SupportTicket> => {
    try {
      const { data, error } = await supabase.from('support_tickets').insert({ ...ticket, status: 'open' }).select().single();
      if (error) throw error;
      return data as SupportTicket;
    } catch (e) {
      handleDbError(e, "addTicket failed");
    }
    return mockDb.addTicket(ticket);
  },

  updateTicketStatus: async (ticketId: string, status: 'open' | 'in_progress' | 'resolved'): Promise<void> => {
    try {
      const { error } = await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "updateTicketStatus failed");
    }
    mockDb.updateTicketStatus(ticketId, status);
  },

  // audit_logs CRUD
  getLogs: async (): Promise<AuditLog[]> => {
    try {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data as AuditLog[];
    } catch (e) {
      handleDbError(e, "getLogs failed");
    }
    return mockDb.getLogs();
  },

  addLog: async (log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> => {
    try {
      const { data, error } = await supabase.from('audit_logs').insert(log).select().single();
      if (error) throw error;
      return data as AuditLog;
    } catch (e) {
      handleDbError(e, "addLog failed");
    }
    return mockDb.addLog(log);
  },

  // feedback CRUD
  getFeedback: async (): Promise<Feedback[]> => {
    try {
      const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data as Feedback[];
    } catch (e) {
      handleDbError(e, "getFeedback failed");
    }
    return mockDb.getFeedback();
  },

  addFeedback: async (feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<Feedback> => {
    try {
      const { data, error } = await supabase.from('feedbacks').insert(feedback).select().single();
      if (error) throw error;
      return data as Feedback;
    } catch (e) {
      handleDbError(e, "addFeedback failed");
    }
    return mockDb.addFeedback(feedback);
  },

  // preferences CRUD
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data as UserPreferences;
      
      const defaultPrefs = { user_id: userId, email_notifications: true, security_alerts: true, weekly_digest: false, theme: 'dark' as const };
      await supabase.from('user_preferences').insert(defaultPrefs);
      return defaultPrefs;
    } catch (e) {
      handleDbError(e, "getPreferences failed");
    }
    return mockDb.getPreferences(userId);
  },

  updatePreferences: async (userId: string, updates: Partial<UserPreferences>): Promise<void> => {
    try {
      const { error } = await supabase.from('user_preferences').update(updates).eq('user_id', userId);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "updatePreferences failed");
    }
    mockDb.updatePreferences(userId, updates);
  },

  // user metrics CRUD
  getUserMetrics: async (userId: string): Promise<UserMetrics> => {
    try {
      const { data, error } = await supabase.from('user_metrics').select('*').eq('user_id', userId).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data as UserMetrics;
      
      const defaultMetrics = {
        user_id: userId,
        total_scan_queries: 0,
        threat_alerts_triggered: 0,
        security_check_ratios: 0,
        active_subscription: 'SHIELD FREE CORE',
        scan_threat_ratios: '0/0',
        product_ratio: '0'
      };
      await supabase.from('user_metrics').insert(defaultMetrics);
      return defaultMetrics as UserMetrics;
    } catch (e) {
      handleDbError(e, "getUserMetrics failed");
    }
    return mockDb.getUserMetrics(userId);
  },

  syncUserMetrics: async (userId: string): Promise<void> => {
    try {
      const scans = await dbRouter.getScans(userId);
      const totalScans = scans.length;
      const counterfeitScans = scans.filter(s => s.final_recommendation === 'danger' || s.overall_score >= 50).length;
      const totalRiskScore = scans.reduce((acc, curr) => acc + curr.overall_score, 0);
      const averageRisk = totalScans > 0 ? Math.round(totalRiskScore / totalScans) : 0;
      
      const metrics = await dbRouter.getUserMetrics(userId);
      metrics.total_scan_queries = totalScans;
      metrics.threat_alerts_triggered = counterfeitScans;
      metrics.security_check_ratios = averageRisk;
      metrics.scan_threat_ratios = `${counterfeitScans}/${totalScans}`;
      
      await dbRouter.saveUserMetrics(metrics);
    } catch (e) {
      console.error("Failed to sync metrics", e);
    }
  },

  saveUserMetrics: async (metrics: UserMetrics): Promise<void> => {
    try {
      const { error } = await supabase.from('user_metrics').upsert(metrics);
      if (error) throw error;
    } catch (e) {
      handleDbError(e, "saveUserMetrics failed");
    }
    mockDb.saveUserMetrics(metrics);
  }
};
