-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    true_points INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read/write own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. product_scans
CREATE TABLE product_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    brand_name TEXT,
    product_name TEXT,
    product_url TEXT,
    image_url TEXT,
    price DECIMAL(10, 2),
    discount_pct DECIMAL(5, 2),
    seller_name TEXT,
    seller_reviews INT,
    platform_name TEXT,
    price_risk JSONB, 
    seller_risk JSONB,
    platform_risk JSONB,
    brand_risk JSONB,
    overall_score INT, 
    final_recommendation TEXT, 
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE product_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own scans" ON product_scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all scans" ON product_scans FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. favorite_brands
CREATE TABLE favorite_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE favorite_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorite brands" ON favorite_brands FOR ALL USING (auth.uid() = user_id);

-- 4. bookmarked_products
CREATE TABLE bookmarked_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scan_id UUID NOT NULL REFERENCES product_scans(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE bookmarked_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON bookmarked_products FOR ALL USING (auth.uid() = user_id);

-- 5. trusted_sellers
CREATE TABLE trusted_sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    rating DECIMAL(3, 2),
    status TEXT DEFAULT 'trusted',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE trusted_sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read trusted sellers" ON trusted_sellers FOR SELECT USING (true);
CREATE POLICY "Only admins can write trusted sellers" ON trusted_sellers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. official_brands
CREATE TABLE official_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL,
    official_domains JSONB, 
    category TEXT,
    status TEXT DEFAULT 'verified',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE official_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read official brands" ON official_brands FOR SELECT USING (true);
CREATE POLICY "Only admins can write official brands" ON official_brands FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. support_tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, 
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open', 
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create tickets" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage tickets" ON support_tickets FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 8. feedbacks
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INT NOT NULL,
    comments TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create feedback" ON feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage feedback" ON feedbacks FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 9. audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL REFERENCES profiles(id),
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage audit logs" ON audit_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 10. user_preferences
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    security_alerts BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    theme TEXT DEFAULT 'light'
);
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- 11. user_metrics
CREATE TABLE user_metrics (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    total_scan_queries INT DEFAULT 0,
    threat_alerts_triggered INT DEFAULT 0,
    security_check_ratios DECIMAL(5,2) DEFAULT 0,
    active_subscription TEXT DEFAULT 'SHIELD FREE CORE',
    scan_threat_ratios TEXT DEFAULT '0/0',
    product_ratio TEXT DEFAULT '0',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own metrics" ON user_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON user_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own metrics" ON user_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
