// Core types for AI-Native Software Tool Discovery & Management Platform

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  preferences: UserPreferences;
  subscription: SubscriptionTier;
  organization?: Organization;
}

export type UserRole = 
  | 'individual' 
  | 'team_leader' 
  | 'it_admin' 
  | 'finance_manager' 
  | 'developer';

export interface UserProfile {
  industry: string;
  company_size: CompanySize;
  job_title: string;
  department: string;
  experience_level: ExperienceLevel;
  primary_use_cases: string[];
  current_tool_stack: string[];
}

export type CompanySize = 
  | 'startup' 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'enterprise';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface UserPreferences {
  budget_range: BudgetRange;
  preferred_pricing_models: PricingModel[];
  required_integrations: string[];
  security_requirements: SecurityRequirement[];
  deployment_preferences: DeploymentType[];
  notification_settings: NotificationSettings;
}

export type BudgetRange = 
  | 'under_100' 
  | '100_500' 
  | '500_1000' 
  | '1000_5000' 
  | '5000_plus' 
  | 'enterprise';

export type PricingModel = 'free' | 'freemium' | 'subscription' | 'one_time' | 'usage_based';

export type SecurityRequirement = 
  | 'soc2' 
  | 'gdpr' 
  | 'hipaa' 
  | 'iso27001' 
  | 'pci_dss';

export type DeploymentType = 'cloud' | 'on_premise' | 'hybrid';

export interface NotificationSettings {
  trial_reminders: boolean;
  renewal_alerts: boolean;
  new_recommendations: boolean;
  budget_warnings: boolean;
  security_updates: boolean;
}

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  domain: string;
  size: CompanySize;
  industry: string;
  budget_limit: number;
  approval_workflows: ApprovalWorkflow[];
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  trigger_amount: number;
  approvers: string[];
  auto_approve_under: number;
}

// Enhanced Tool Model
export interface AIEnhancedTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  subcategory: string;
  vendor: Vendor;
  
  // Pricing & Licensing
  pricing: EnhancedPricing;
  licensing: LicensingInfo;
  
  // Features & Capabilities
  features: ToolFeature[];
  ai_capabilities: AICatalogueCapabilities;
  integrations: Integration[];
  apis: APIInfo[];
  
  // Quality & Trust Metrics
  ratings: RatingDetails;
  reviews: Review[];
  certifications: Certification[];
  security_score: number;
  performance_metrics: PerformanceMetrics;
  
  // AI Analysis
  ai_summary: string;
  ai_score: AIScore;
  trend_data: TrendData;
  competitive_analysis: CompetitiveAnalysis;
  
  // Metadata
  created_at: string;
  updated_at: string;
  verification_status: VerificationStatus;
  popularity_score: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  parent_id?: string;
  description: string;
  icon: string;
  ai_keywords: string[];
}

export interface Vendor {
  id: string;
  name: string;
  website: string;
  support_email: string;
  founded_year: number;
  headquarters: string;
  employee_count: CompanySize;
  funding_status: FundingStatus;
  trust_score: number;
}

export type FundingStatus = 
  | 'bootstrapped' 
  | 'seed' 
  | 'series_a' 
  | 'series_b' 
  | 'series_c' 
  | 'public' 
  | 'acquired';

export interface EnhancedPricing {
  model: PricingModel;
  tiers: PricingTier[];
  free_tier?: FreeTierDetails;
  enterprise_pricing: boolean;
  cost_calculator: CostCalculator;
}

export interface PricingTier {
  name: string;
  price: number;
  billing_period: BillingPeriod;
  currency: string;
  features: string[];
  limits: UsageLimits;
  popular: boolean;
}

export type BillingPeriod = 'monthly' | 'annually' | 'one_time' | 'usage_based';

export interface FreeTierDetails {
  available: boolean;
  limitations: string[];
  upgrade_triggers: string[];
}

export interface CostCalculator {
  variables: CostVariable[];
  formula: string;
  discounts: Discount[];
}

export interface CostVariable {
  name: string;
  type: 'users' | 'storage' | 'requests' | 'features';
  unit_cost: number;
  min_value: number;
  max_value?: number;
}

export interface Discount {
  type: 'volume' | 'annual' | 'early_bird' | 'enterprise';
  threshold: number;
  percentage: number;
  description: string;
}

export interface UsageLimits {
  users?: number;
  storage?: string;
  requests?: number;
  features?: string[];
}

export interface LicensingInfo {
  type: LicenseType;
  terms: string;
  auto_renewal: boolean;
  cancellation_policy: string;
  refund_policy: string;
  data_retention: string;
}

export type LicenseType = 
  | 'per_user' 
  | 'per_device' 
  | 'site_license' 
  | 'concurrent' 
  | 'usage_based';

export interface ToolFeature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  availability: FeatureAvailability;
  ai_relevance_score: number;
}

export type FeatureCategory = 
  | 'core' 
  | 'collaboration' 
  | 'security' 
  | 'integration' 
  | 'analytics' 
  | 'automation' 
  | 'ai_ml';

export type FeatureAvailability = 'all_tiers' | 'paid_only' | 'enterprise_only';

export interface AICatalogueCapabilities {
  has_ai: boolean;
  ai_features: AIFeature[];
  ai_maturity_level: AIMaturityLevel;
  ai_use_cases: string[];
}

export interface AIFeature {
  name: string;
  description: string;
  type: AIFeatureType;
  confidence_score: number;
}

export type AIFeatureType = 
  | 'nlp' 
  | 'computer_vision' 
  | 'predictive_analytics' 
  | 'automation' 
  | 'recommendations' 
  | 'sentiment_analysis';

export type AIMaturityLevel = 'basic' | 'intermediate' | 'advanced' | 'cutting_edge';

export interface Integration {
  id: string;
  target_tool: string;
  type: IntegrationType;
  method: IntegrationMethod;
  setup_complexity: ComplexityLevel;
  data_sync: DataSyncType;
  cost: IntegrationCost;
  reliability_score: number;
}

export type IntegrationType = 
  | 'native' 
  | 'third_party' 
  | 'api' 
  | 'webhook' 
  | 'zapier' 
  | 'custom';

export type IntegrationMethod = 'real_time' | 'batch' | 'manual' | 'scheduled';

export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'expert_required';

export type DataSyncType = 'bidirectional' | 'unidirectional' | 'read_only' | 'write_only';

export interface IntegrationCost {
  setup_cost: number;
  ongoing_cost: number;
  included_in_plan: boolean;
}

export interface APIInfo {
  version: string;
  type: APIType;
  documentation_url: string;
  rate_limits: RateLimit[];
  authentication: AuthenticationType[];
  reliability_score: number;
}

export type APIType = 'rest' | 'graphql' | 'soap' | 'webhook';

export type AuthenticationType = 'api_key' | 'oauth2' | 'basic_auth' | 'jwt';

export interface RateLimit {
  tier: string;
  requests_per_hour: number;
  burst_limit: number;
}

export interface RatingDetails {
  overall: number;
  ease_of_use: number;
  features: number;
  value_for_money: number;
  customer_support: number;
  total_reviews: number;
  rating_distribution: RatingDistribution;
}

export interface RatingDistribution {
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  use_case: string;
  company_size: CompanySize;
  verified: boolean;
  helpful_votes: number;
  created_at: string;
  ai_sentiment: SentimentAnalysis;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  key_themes: string[];
  emotional_tone: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  type: CertificationType;
  valid_until?: string;
  verification_url?: string;
}

export type CertificationType = 
  | 'security' 
  | 'privacy' 
  | 'compliance' 
  | 'quality' 
  | 'environmental';

export interface PerformanceMetrics {
  uptime: number;
  response_time: number;
  error_rate: number;
  last_updated: string;
  data_source: string;
}

export interface AIScore {
  overall: number;
  relevance: number;
  quality: number;
  value: number;
  fit_score: number;
  confidence: number;
  explanation: string;
  factors: ScoringFactor[];
}

export interface ScoringFactor {
  factor: string;
  weight: number;
  score: number;
  explanation: string;
}

export interface TrendData {
  popularity_trend: TrendPoint[];
  search_volume: TrendPoint[];
  adoption_rate: number;
  growth_rate: number;
  market_position: MarketPosition;
}

export interface TrendPoint {
  date: string;
  value: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export type MarketPosition = 
  | 'emerging' 
  | 'growing' 
  | 'established' 
  | 'mature' 
  | 'declining';

export interface CompetitiveAnalysis {
  main_competitors: Competitor[];
  differentiation: string[];
  market_share: number;
  competitive_advantages: string[];
  weaknesses: string[];
}

export interface Competitor {
  tool_id: string;
  name: string;
  similarity_score: number;
  comparison_summary: string;
}

export type VerificationStatus = 
  | 'verified' 
  | 'pending' 
  | 'unverified' 
  | 'flagged';

// Search & Discovery Types
export interface SearchQuery {
  text: string;
  filters: SearchFilters;
  context: SearchContext;
  intent: SearchIntent;
}

export interface SearchFilters {
  categories: string[];
  pricing_models: PricingModel[];
  budget_range: BudgetRange;
  integrations: string[];
  features: string[];
  security_requirements: SecurityRequirement[];
  deployment_types: DeploymentType[];
  company_size: CompanySize[];
  ai_capabilities: boolean;
  rating_threshold: number;
}

export interface SearchContext {
  user_profile: UserProfile;
  current_tools: string[];
  recent_searches: string[];
  browsing_history: BrowsingEvent[];
}

export interface BrowsingEvent {
  tool_id: string;
  action: BrowsingAction;
  timestamp: string;
  duration?: number;
}

export type BrowsingAction = 
  | 'view' 
  | 'compare' 
  | 'save' 
  | 'trial' 
  | 'purchase' 
  | 'review';

export type SearchIntent = 
  | 'discovery' 
  | 'comparison' 
  | 'evaluation' 
  | 'replacement' 
  | 'integration';

export interface SearchResult {
  tools: AIEnhancedTool[];
  total_count: number;
  ai_insights: SearchInsights;
  recommended_filters: RecommendedFilter[];
  related_searches: string[];
  trending_alternatives: AIEnhancedTool[];
}

export interface SearchInsights {
  query_understanding: string;
  result_summary: string;
  suggestions: string[];
  market_insights: string[];
}

export interface RecommendedFilter {
  filter_type: keyof SearchFilters;
  suggested_values: string[];
  rationale: string;
}

// Recommendation System Types
export interface RecommendationRequest {
  user_id: string;
  context: RecommendationContext;
  limit: number;
  exclude_tools: string[];
}

export interface RecommendationContext {
  intent: RecommendationIntent;
  current_tools: string[];
  pain_points: string[];
  goals: string[];
  timeline: string;
  budget: BudgetRange;
}

export type RecommendationIntent = 
  | 'discover_new' 
  | 'replace_existing' 
  | 'consolidate_stack' 
  | 'optimize_workflow' 
  | 'scale_team';

export interface RecommendationResult {
  tools: RecommendedTool[];
  insights: RecommendationInsights;
  optimization_suggestions: OptimizationSuggestion[];
}

export interface RecommendedTool {
  tool: AIEnhancedTool;
  recommendation_score: number;
  rationale: string;
  use_case_fit: string;
  implementation_effort: ComplexityLevel;
  expected_roi: ROIEstimate;
}

export interface ROIEstimate {
  time_savings: string;
  cost_savings: number;
  productivity_gain: number;
  confidence_level: number;
}

export interface RecommendationInsights {
  stack_analysis: StackAnalysis;
  gap_analysis: GapAnalysis;
  trend_insights: string[];
  budget_optimization: BudgetOptimization;
}

export interface StackAnalysis {
  current_tools: ToolAnalysis[];
  redundancies: Redundancy[];
  coverage_gaps: string[];
  integration_opportunities: string[];
}

export interface ToolAnalysis {
  tool_id: string;
  usage_score: number;
  value_score: number;
  replacement_suggestions: string[];
}

export interface Redundancy {
  tools: string[];
  overlap_percentage: number;
  consolidation_suggestion: string;
  potential_savings: number;
}

export interface GapAnalysis {
  missing_capabilities: string[];
  workflow_bottlenecks: string[];
  integration_gaps: string[];
  security_gaps: string[];
  automation_opportunities: string[];
}

export interface BudgetOptimization {
  current_spend: number;
  optimized_spend: number;
  potential_savings: number;
  recommendations: BudgetRecommendation[];
}

export interface BudgetRecommendation {
  type: 'downgrade' | 'cancel' | 'consolidate' | 'annual_switch';
  tools: string[];
  savings: number;
  rationale: string;
}

export interface OptimizationSuggestion {
  type: OptimizationType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: ComplexityLevel;
  tools_involved: string[];
}

export type OptimizationType = 
  | 'cost_reduction' 
  | 'productivity_boost' 
  | 'security_enhancement' 
  | 'integration_improvement' 
  | 'workflow_automation';