-- Database Schema for StakPro Tool Directory
-- Run this in your Supabase SQL Editor

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  website VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL,
  pricing_type VARCHAR(20) NOT NULL CHECK (pricing_type IN ('free', 'freemium', 'paid')),
  starting_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  billing_period VARCHAR(20) CHECK (billing_period IN ('month', 'year', 'one-time')),
  features TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  compatibility TEXT[] NOT NULL DEFAULT '{}',
  logo VARCHAR(500),
  github_url VARCHAR(500),
  documentation VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_name VARCHAR(100) NOT NULL,
  submitter_email VARCHAR(255) NOT NULL,
  submission_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_pricing_type ON tools(pricing_type);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved tools
CREATE POLICY "Anyone can view approved tools" ON tools
    FOR SELECT USING (status = 'approved');

-- Allow anyone to insert new tool submissions
CREATE POLICY "Anyone can submit tools" ON tools
    FOR INSERT WITH CHECK (status = 'pending');

-- Only authenticated users can update tools (for admin functionality)
-- You can modify this based on your auth requirements
CREATE POLICY "Authenticated users can update tools" ON tools
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO tools (
  name, description, website, category, pricing_type, features, tags, compatibility,
  submitter_name, submitter_email, status, rating, review_count
) VALUES 
(
  'Visual Studio Code',
  'Lightweight but powerful source code editor with built-in support for JavaScript, TypeScript and Node.js.',
  'https://code.visualstudio.com',
  'Code Editor',
  'free',
  ARRAY['IntelliSense', 'Git Integration', 'Extensions', 'Debugging', 'Terminal'],
  ARRAY['editor', 'microsoft', 'open-source'],
  ARRAY['Windows', 'macOS', 'Linux'],
  'Microsoft',
  'contact@microsoft.com',
  'approved',
  4.8,
  25000
),
(
  'Figma',
  'Collaborative interface design tool with real-time collaboration features.',
  'https://figma.com',
  'Design Tool',
  'freemium',
  ARRAY['Real-time Collaboration', 'Vector Editing', 'Prototyping', 'Design Systems'],
  ARRAY['design', 'ui/ux', 'collaboration'],
  ARRAY['Web', 'Desktop'],
  'Figma Inc',
  'contact@figma.com',
  'approved',
  4.7,
  18000
),
(
  'Docker',
  'Platform for developing, shipping, and running applications in containers.',
  'https://docker.com',
  'DevOps',
  'freemium',
  ARRAY['Containerization', 'Cross-platform', 'Scalable deployments'],
  ARRAY['containers', 'devops', 'deployment'],
  ARRAY['Windows', 'macOS', 'Linux'],
  'Docker Inc',
  'contact@docker.com',
  'approved',
  4.6,
  22000
) ON CONFLICT DO NOTHING;