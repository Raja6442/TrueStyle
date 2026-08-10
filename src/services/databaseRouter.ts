import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mockDb } from './mockDatabase';
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
  UserPreferences 
} from '../types';

// Helper to determine if a Supabase error is due to missing tables/relations (PG code 42P01)
const handleDbError = (error: any, fallbackMessage: string) => {
  console.warn(`Supabase Database Alert: ${fallbackMessage}. Details:`, error.message);
  if (error.code === '42P01') {
    console.error("CRITICAL ERROR: Tables do not exist in Supabase! Please copy the contents of the 'schema.sql' file and run it inside your Supabase project's SQL Editor.");
  }
  return true; // Indicates we should fall back
};

export const dbRouter = {
  // profiles CRUD
  getProfiles: async (): Promise<Profile[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        return data as Profile[];
      } catch (e) {
        handleDbError(e, "getProfiles failed. Falling back to local cache.");
      }
    }
    return mockDb.getProfiles();
  },

  getProfileById: async (id: string): Promise<Profile | undefined> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) throw error;
        return data as Profile;
      } catch (e) {
        handleDbError(e, `getProfileById (${id}) failed. Falling back to local cache.`);
      }
    }
    return mockDb.getProfileById(id);
  },

  getProfileByEmail: async (email: string): Promise<Profile | undefined> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email.toLowerCase()).maybeSingle();
        if (error) throw error;
        return data as Profile || undefined;
      } catch (e) {
        handleDbError(e, `getProfileByEmail (${email}) failed. Falling back to local cache.`);
      }
    }
    return mockDb.getProfileByEmail(email);
  },

  saveProfile: async (profile: Profile): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('profiles').upsert(profile);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, "saveProfile failed. Commit saved to local storage fallback.");
      }
    }
    mockDb.saveProfile(profile);
  },

  // product_scans CRUD
  getScans: async (userId?: string): Promise<ProductScan[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('product_scans').select('*').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data as ProductScan[];
      } catch (e) {
        handleDbError(e, "getScans failed. Loading history logs from local storage.");
      }
    }
    return mockDb.getScans(userId);
  },

  addScan: async (scan: Omit<ProductScan, 'id' | 'created_at'>): Promise<ProductScan> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('product_scans').insert(scan).select().single();
        if (error) throw error;
        return data as ProductScan;
      } catch (e) {
        handleDbError(e, "addScan failed. Scan logged to local cache.");
      }
    }
    return mockDb.addScan(scan);
  },

  deleteScan: async (scanId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('product_scans').delete().eq('id', scanId);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, `deleteScan (${scanId}) failed. Action routed to local storage.`);
      }
    }
    mockDb.deleteScan(scanId);
  },

  // official_brands CRUD
  getBrands: async (): Promise<OfficialBrand[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('official_brands').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data as OfficialBrand[];
        }
      } catch (e) {
        handleDbError(e, "getBrands failed. Reading cached brands database.");
      }
    }
    return mockDb.getBrands();
  },

  addBrand: async (brand: Omit<OfficialBrand, 'id' | 'updated_at'>): Promise<OfficialBrand> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('official_brands').insert(brand).select().single();
        if (error) throw error;
        return data as OfficialBrand;
      } catch (e) {
        handleDbError(e, "addBrand failed. Directing write to local state.");
      }
    }
    return mockDb.addBrand(brand);
  },

  updateBrand: async (brand: OfficialBrand): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('official_brands').update({
          brand_name: brand.brand_name,
          official_domains: brand.official_domains,
          category: brand.category,
          status: brand.status,
          updated_at: new Date().toISOString()
        }).eq('id', brand.id);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, "updateBrand failed. Routed modifications to local state.");
      }
    }
    mockDb.updateBrand(brand);
  },

  deleteBrand: async (brandId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('official_brands').delete().eq('id', brandId);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, `deleteBrand (${brandId}) failed. Routing delete to local state.`);
      }
    }
    mockDb.deleteBrand(brandId);
  },

  // trusted_sellers CRUD
  getSellers: async (): Promise<TrustedSeller[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('trusted_sellers').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data as TrustedSeller[];
        }
      } catch (e) {
        handleDbError(e, "getSellers failed. Reading cached vendor index.");
      }
    }
    return mockDb.getSellers();
  },

  addSeller: async (seller: Omit<TrustedSeller, 'id' | 'updated_at'>): Promise<TrustedSeller> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('trusted_sellers').insert(seller).select().single();
        if (error) throw error;
        return data as TrustedSeller;
      } catch (e) {
        handleDbError(e, "addSeller failed. Directing write to local state.");
      }
    }
    return mockDb.addSeller(seller);
  },

  updateSeller: async (seller: TrustedSeller): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('trusted_sellers').update({
          seller_name: seller.seller_name,
          platform: seller.platform,
          rating: seller.rating,
          status: seller.status,
          updated_at: new Date().toISOString()
        }).eq('id', seller.id);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, "updateSeller failed. Routed modification to local storage.");
      }
    }
    mockDb.updateSeller(seller);
  },

  deleteSeller: async (sellerId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('trusted_sellers').delete().eq('id', sellerId);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, `deleteSeller (${sellerId}) failed. Executing local delete fallback.`);
      }
    }
    mockDb.deleteSeller(sellerId);
  },

  // favorite_brands CRUD
  getFavorites: async (userId: string): Promise<FavoriteBrand[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('favorite_brands').select('*').eq('user_id', userId);
        if (error) throw error;
        return data as FavoriteBrand[];
      } catch (e) {
        handleDbError(e, "getFavorites failed. Pulling from local cache.");
      }
    }
    return mockDb.getFavorites(userId);
  },

  isFavorite: async (userId: string, brandName: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('favorite_brands')
          .select('id')
          .eq('user_id', userId)
          .ilike('brand_name', brandName)
          .maybeSingle();
        if (error) throw error;
        return !!data;
      } catch (e) {
        handleDbError(e, "isFavorite check failed.");
      }
    }
    return mockDb.isFavorite(userId, brandName);
  },

  toggleFavorite: async (userId: string, brandName: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('favorite_brands')
          .select('id')
          .eq('user_id', userId)
          .ilike('brand_name', brandName)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          await supabase.from('favorite_brands').delete().eq('id', data.id);
        } else {
          await supabase.from('favorite_brands').insert({ user_id: userId, brand_name: brandName });
        }
        return;
      } catch (e) {
        handleDbError(e, "toggleFavorite failed. Commitment saved locally.");
      }
    }
    mockDb.toggleFavorite(userId, brandName);
  },

  // bookmarked_products CRUD
  getBookmarks: async (userId: string): Promise<BookmarkedProduct[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookmarked_products').select('*').eq('user_id', userId);
        if (error) throw error;
        return data as BookmarkedProduct[];
      } catch (e) {
        handleDbError(e, "getBookmarks failed.");
      }
    }
    return mockDb.getBookmarks(userId);
  },

  isBookmarked: async (userId: string, scanId: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookmarked_products')
          .select('id')
          .eq('user_id', userId)
          .eq('scan_id', scanId)
          .maybeSingle();
        if (error) throw error;
        return !!data;
      } catch (e) {
        handleDbError(e, "isBookmarked check failed.");
      }
    }
    return mockDb.isBookmarked(userId, scanId);
  },

  toggleBookmark: async (userId: string, scanId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookmarked_products')
          .select('id')
          .eq('user_id', userId)
          .eq('scan_id', scanId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          await supabase.from('bookmarked_products').delete().eq('id', data.id);
        } else {
          await supabase.from('bookmarked_products').insert({ user_id: userId, scan_id: scanId });
        }
        return;
      } catch (e) {
        handleDbError(e, "toggleBookmark failed.");
      }
    }
    mockDb.toggleBookmark(userId, scanId);
  },

  // support_tickets CRUD
  getTickets: async (userId?: string): Promise<SupportTicket[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data as SupportTicket[];
      } catch (e) {
        handleDbError(e, "getTickets failed.");
      }
    }
    return mockDb.getTickets(userId);
  },

  addTicket: async (ticket: Omit<SupportTicket, 'id' | 'status' | 'created_at'>): Promise<SupportTicket> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('support_tickets').insert(ticket).select().single();
        if (error) throw error;
        return data as SupportTicket;
      } catch (e) {
        handleDbError(e, "addTicket failed.");
      }
    }
    return mockDb.addTicket(ticket);
  },

  updateTicketStatus: async (ticketId: string, status: 'open' | 'in_progress' | 'resolved'): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, "updateTicketStatus failed.");
      }
    }
    mockDb.updateTicketStatus(ticketId, status);
  },

  // audit_logs CRUD
  getLogs: async (): Promise<AuditLog[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data as AuditLog[];
      } catch (e) {
        handleDbError(e, "getLogs failed.");
      }
    }
    return mockDb.getLogs();
  },

  addLog: async (log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('system_logs').insert(log).select().single();
        if (error) throw error;
        return data as AuditLog;
      } catch (e) {
        handleDbError(e, "addLog failed.");
      }
    }
    return mockDb.addLog(log);
  },

  // feedback CRUD
  getFeedback: async (): Promise<Feedback[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data as Feedback[];
      } catch (e) {
        handleDbError(e, "getFeedback failed.");
      }
    }
    return mockDb.getFeedback();
  },

  addFeedback: async (feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<Feedback> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('feedback').insert(feedback).select().single();
        if (error) throw error;
        return data as Feedback;
      } catch (e) {
        handleDbError(e, "addFeedback failed.");
      }
    }
    return mockDb.addFeedback(feedback);
  },

  // preferences CRUD
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single();
        if (error) throw error;
        return data as UserPreferences;
      } catch (e) {
        handleDbError(e, "getPreferences failed.");
      }
    }
    return mockDb.getPreferences(userId);
  },

  updatePreferences: async (userId: string, updates: Partial<UserPreferences>): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('user_preferences').update(updates).eq('user_id', userId);
        if (error) throw error;
        return;
      } catch (e) {
        handleDbError(e, "updatePreferences failed.");
      }
    }
    mockDb.updatePreferences(userId, updates);
  }
};
