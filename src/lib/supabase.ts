import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface DatabaseTool {
  id: number;
  name: string;
  description: string;
  website: string;
  category: string;
  pricing_type: 'free' | 'freemium' | 'paid';
  starting_price?: number;
  currency?: string;
  billing_period?: 'month' | 'year' | 'one-time';
  features: string[];
  tags: string[];
  compatibility: string[];
  logo?: string;
  github_url?: string;
  documentation?: string;
  rating: number;
  review_count: number;
  status: 'pending' | 'approved' | 'rejected';
  submitter_name: string;
  submitter_email: string;
  submission_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ToolSubmission {
  name: string;
  description: string;
  website: string;
  category: string;
  pricing_type: 'free' | 'freemium' | 'paid';
  starting_price?: number;
  currency?: string;
  billing_period?: 'month' | 'year' | 'one-time';
  features: string[];
  tags: string[];
  compatibility: string[];
  logo?: string;
  github_url?: string;
  documentation?: string;
  submitter_name: string;
  submitter_email: string;
  submission_notes?: string;
}