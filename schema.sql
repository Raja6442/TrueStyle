-- ====================================================
-- TRUESTYLE CYBERSECURITY DATABASE SCHEMA SETTINGS
-- COPY AND EXECUTE THIS IN THE SUPABASE SQL EDITOR
-- ====================================================

-- 1. ENABLE UUID GENERATION EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE DATABASE TABLES

-- Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    security_alerts BOOLEAN DEFAULT TRUE NOT NULL,
    weekly_digest BOOLEAN DEFAULT FALSE NOT NULL,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')) NOT NULL
);

-- Official Brand Registries
CREATE TABLE IF NOT EXISTS public.official_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT UNIQUE NOT NULL,
    official_domains TEXT[] NOT NULL,
    category TEXT NOT NULL DEFAULT 'Luxury',
    status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'flagged')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trusted and Suspicious Sellers Database
CREATE TABLE IF NOT EXISTS public.trusted_sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_name TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.0 NOT NULL,
    status TEXT NOT NULL DEFAULT 'trusted' CHECK (status IN ('trusted', 'suspicious')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Verification Scan Records
CREATE TABLE IF NOT EXISTS public.product_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_url TEXT,
    image_url TEXT,
    price NUMERIC NOT NULL,
    discount_pct NUMERIC NOT NULL,
    seller_name TEXT NOT NULL,
    seller_reviews NUMERIC NOT NULL,
    platform_name TEXT NOT NULL,
    price_risk JSONB NOT NULL,
    seller_risk JSONB NOT NULL,
    platform_risk JSONB NOT NULL,
    brand_risk JSONB NOT NULL,
    overall_score NUMERIC NOT NULL,
    final_recommendation TEXT NOT NULL CHECK (final_recommendation IN ('safe', 'danger')),
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookmarked Products
CREATE TABLE IF NOT EXISTS public.bookmarked_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scan_id UUID NOT NULL REFERENCES public.product_scans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_scan_bookmark UNIQUE (user_id, scan_id)
);

-- Favorite Brands
CREATE TABLE IF NOT EXISTS public.favorite_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_brand_favorite UNIQUE (user_id, brand_name)
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cybersecurity Audit Logs
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT DEFAULT '127.0.0.1' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================
-- 3. AUTOMATED PROFILE TRIGGER FOR NEW SIGNUPS
-- ====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Insert profile metadata
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
        new.email,
        CASE WHEN new.email LIKE '%admin%' THEN 'admin' ELSE 'user' END
    );

    -- Insert preferences record
    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users insertions
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================
-- 4. ENABLE ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================

ALTER TABLE public.profiles ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.official_brands ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.trusted_sellers ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.product_scans ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.bookmarked_products ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.favorite_brands ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW-LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW-LEVEL SECURITY;

-- --- Profiles Policies ---
CREATE POLICY "Users can read own profiles." ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles." ON public.profiles 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- --- Preferences Policies ---
CREATE POLICY "Users can manage own preferences." ON public.user_preferences 
    FOR ALL USING (auth.uid() = user_id);

-- --- Official Brands Policies ---
CREATE POLICY "Public read for official brands." ON public.official_brands 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage official brands." ON public.official_brands 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- --- Trusted Sellers Policies ---
CREATE POLICY "Public read for trusted sellers." ON public.trusted_sellers 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage trusted sellers." ON public.trusted_sellers 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- --- Scans Policies ---
CREATE POLICY "Users manage own product scans." ON public.product_scans 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins view all scans." ON public.product_scans 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- --- Bookmarks Policies ---
CREATE POLICY "Users manage own bookmarks." ON public.bookmarked_products 
    FOR ALL USING (auth.uid() = user_id);

-- --- Favorites Policies ---
CREATE POLICY "Users manage own favorites." ON public.favorite_brands 
    FOR ALL USING (auth.uid() = user_id);

-- --- Tickets Policies ---
CREATE POLICY "Users can select own tickets." ON public.support_tickets 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create tickets." ON public.support_tickets 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view and update tickets." ON public.support_tickets 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- --- Feedback Policies ---
CREATE POLICY "Anyone can create feedback." ON public.feedback 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read feedback." ON public.feedback 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- --- Audit Logs Policies ---
CREATE POLICY "Anyone can write system logs." ON public.system_logs 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view audit logs." ON public.system_logs 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ====================================================
-- 5. SEED INITIAL BASE DATABASE RECORDS
-- ====================================================

INSERT INTO public.official_brands (brand_name, official_domains, category, status) VALUES
('Nike', ARRAY['nike.com', 'nike.co.jp', 'nike.ae'], 'Sportswear', 'verified'),
('Gucci', ARRAY['gucci.com', 'gucci.cn'], 'Luxury', 'verified'),
('Louis Vuitton', ARRAY['louisvuitton.com'], 'Luxury', 'verified'),
('Adidas', ARRAY['adidas.com', 'adidas.co.uk'], 'Sportswear', 'verified'),
('Rolex', ARRAY['rolex.com'], 'Watches', 'verified'),
('Prada', ARRAY['prada.com'], 'Luxury', 'verified'),
('Off-White', ARRAY['off---white.com'], 'Streetwear', 'verified'),
('Balenciaga', ARRAY['balenciaga.com'], 'Luxury', 'verified')
ON CONFLICT (brand_name) DO UPDATE 
SET official_domains = EXCLUDED.official_domains, category = EXCLUDED.category;

INSERT INTO public.trusted_sellers (seller_name, platform, rating, status) VALUES
('Amazon Official', 'Amazon', 4.80, 'trusted'),
('Nike Store', 'Nike Official', 5.00, 'trusted'),
('Gucci Official Shop', 'Gucci Portal', 5.00, 'trusted'),
('Farfetch Luxury', 'Farfetch', 4.70, 'trusted'),
('Nordstrom Dept', 'Nordstrom', 4.60, 'trusted'),
('Cheap Luxury Steals', 'Shopify Store', 1.20, 'suspicious'),
('RepFashionHub', 'Instagram DM', 0.50, 'suspicious'),
('SuperLuxuryDiscounts', 'Unknown Platform', 2.10, 'suspicious'),
('HypebeastOutlet', 'eBay', 3.20, 'suspicious')
ON CONFLICT (seller_name) DO UPDATE 
SET platform = EXCLUDED.platform, rating = EXCLUDED.rating, status = EXCLUDED.status;
