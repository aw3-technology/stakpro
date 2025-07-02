-- Authentication and User System Setup for StakPro
-- Run this in your Supabase SQL Editor after the main schema

-- Enable RLS on auth.users (if not already enabled)
-- This is automatically managed by Supabase

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  avatar_url VARCHAR(500),
  bio TEXT,
  website VARCHAR(500),
  company VARCHAR(100),
  location VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved tools table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS saved_tools (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id BIGINT REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, tool_id)
);

-- Create tool collections table
CREATE TABLE IF NOT EXISTS tool_collections (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  cover_image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection tools table (many-to-many)
CREATE TABLE IF NOT EXISTS collection_tools (
  id BIGSERIAL PRIMARY KEY,
  collection_id BIGINT REFERENCES tool_collections(id) ON DELETE CASCADE NOT NULL,
  tool_id BIGINT REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_index INTEGER DEFAULT 0,
  UNIQUE(collection_id, tool_id)
);

-- Create user tool ratings table
CREATE TABLE IF NOT EXISTS user_tool_ratings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id BIGINT REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_tools_user_id ON saved_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_tools_tool_id ON saved_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_collections_user_id ON tool_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_tools_collection_id ON collection_tools(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_tools_tool_id ON collection_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_ratings_user_id ON user_tool_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_ratings_tool_id ON user_tool_ratings(tool_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_collections_updated_at BEFORE UPDATE ON tool_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tool_ratings_updated_at BEFORE UPDATE ON user_tool_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- User profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Saved tools
ALTER TABLE saved_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved tools" ON saved_tools
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved tools" ON saved_tools
    FOR ALL USING (auth.uid() = user_id);

-- Tool collections
ALTER TABLE tool_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections" ON tool_collections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public collections" ON tool_collections
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own collections" ON tool_collections
    FOR ALL USING (auth.uid() = user_id);

-- Collection tools
ALTER TABLE collection_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collection tools they own" ON collection_tools
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tool_collections 
            WHERE id = collection_id 
            AND (user_id = auth.uid() OR is_public = true)
        )
    );

CREATE POLICY "Users can manage their own collection tools" ON collection_tools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tool_collections 
            WHERE id = collection_id 
            AND user_id = auth.uid()
        )
    );

-- User tool ratings
ALTER TABLE user_tool_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON user_tool_ratings
    FOR SELECT TO anon, authenticated;

CREATE POLICY "Users can manage their own ratings" ON user_tool_ratings
    FOR ALL USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create some helpful views
CREATE OR REPLACE VIEW user_saved_tools_with_details AS
SELECT 
    st.*,
    t.name,
    t.description,
    t.category,
    t.pricing_type,
    t.rating,
    t.logo,
    t.logo_public_url,
    t.website,
    t.tags,
    t.features
FROM saved_tools st
JOIN tools t ON st.tool_id = t.id
WHERE t.status = 'approved';

CREATE OR REPLACE VIEW user_collections_with_stats AS
SELECT 
    tc.*,
    COUNT(ct.tool_id) as tool_count,
    up.username,
    up.full_name
FROM tool_collections tc
LEFT JOIN collection_tools ct ON tc.id = ct.collection_id
LEFT JOIN user_profiles up ON tc.user_id = up.id
GROUP BY tc.id, up.username, up.full_name;

-- Grant access to views
GRANT SELECT ON user_saved_tools_with_details TO anon, authenticated;
GRANT SELECT ON user_collections_with_stats TO anon, authenticated;

-- Function to get user's saved tools
CREATE OR REPLACE FUNCTION get_user_saved_tools(user_uuid UUID)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT,
    category VARCHAR,
    pricing_type VARCHAR,
    rating DECIMAL,
    logo VARCHAR,
    logo_public_url VARCHAR,
    website VARCHAR,
    tags TEXT[],
    features TEXT[],
    saved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.description,
        t.category,
        t.pricing_type,
        t.rating,
        t.logo,
        t.logo_public_url,
        t.website,
        t.tags,
        t.features,
        st.saved_at,
        st.notes
    FROM saved_tools st
    JOIN tools t ON st.tool_id = t.id
    WHERE st.user_id = user_uuid
    AND t.status = 'approved'
    ORDER BY st.saved_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's collections
CREATE OR REPLACE FUNCTION get_user_collections(user_uuid UUID)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT,
    is_public BOOLEAN,
    cover_image VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    tool_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.id,
        tc.name,
        tc.description,
        tc.is_public,
        tc.cover_image,
        tc.created_at,
        COUNT(ct.tool_id) as tool_count
    FROM tool_collections tc
    LEFT JOIN collection_tools ct ON tc.id = ct.collection_id
    WHERE tc.user_id = user_uuid
    GROUP BY tc.id, tc.name, tc.description, tc.is_public, tc.cover_image, tc.created_at
    ORDER BY tc.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;