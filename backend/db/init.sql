-- ═══════════════════════════════════════════════════════════════
-- 🎯 DATABASE SCHEMA - VIRAL ENGINE PRO
-- Built: December 13, 2025
-- Company: RJ Business Solutions
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────
-- USERS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    username VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    plan VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    stripe_customer_id VARCHAR(255),
    credits_remaining INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- ───────────────────────────────────────────────────────────
-- SOCIAL ACCOUNTS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255),
    platform_username VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- ───────────────────────────────────────────────────────────
-- VIDEOS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    template_id VARCHAR(100),
    template_name VARCHAR(255),
    category VARCHAR(100),
    duration INTEGER,
    video_url TEXT,
    thumbnail_url TEXT,
    file_size BIGINT,
    resolution VARCHAR(50),
    status VARCHAR(50) DEFAULT 'processing',
    viral_score INTEGER,
    generated_script TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- POSTS TABLE (Published Videos)
-- ───────────────────────────────────────────────────────────
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_post_id VARCHAR(255),
    platform_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- ANALYTICS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    watch_time_seconds INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, date)
);

-- ───────────────────────────────────────────────────────────
-- TEMPLATES TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    viral_score INTEGER,
    usage_count INTEGER DEFAULT 0,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- PAYMENTS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    plan VARCHAR(50),
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- WEBHOOKS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- INDEXES
-- ───────────────────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_posts_video_id ON posts(video_id);
CREATE INDEX idx_posts_platform ON posts(platform);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_analytics_post_id ON analytics(post_id);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- ───────────────────────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ───────────────────────────────────────────────────────────

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ───────────────────────────────────────────────────────────
-- SEED DATA (Sample Templates)
-- ───────────────────────────────────────────────────────────
INSERT INTO templates (id, name, category, description, viral_score, config) VALUES
('mot-001', '7-Figure Mindset Shift', 'motivational', 'Transform from broke to millionaire mindset', 95, '{"duration": 45, "style": "epic"}'),
('wealth-001', 'Passive Income Breakdown', 'money', 'How to build 7 income streams', 96, '{"duration": 45, "style": "luxury"}'),
('biz-001', 'Business Ideas 2025', 'business', 'Profitable business ideas to start today', 94, '{"duration": 48, "style": "corporate"}');

-- ═══════════════════════════════════════════════════════════════
-- COMPLETED
-- ═══════════════════════════════════════════════════════════════
