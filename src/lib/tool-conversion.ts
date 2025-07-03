import { AIEnhancedTool, PricingModel, VerificationStatus } from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

/**
 * Converts a SoftwareToolModel to AIEnhancedTool for AI platform features
 */
export function convertToAIEnhancedTool(tool: SoftwareToolModel & { id: number }): AIEnhancedTool {
  // Map pricing type to our PricingModel
  const pricingModel: PricingModel = tool.pricing.type === 'free' ? 'free' : 
                                   tool.pricing.type === 'freemium' ? 'freemium' : 
                                   'subscription';

  return {
    id: tool.id.toString(),
    name: tool.name,
    description: tool.description,
    category: {
      id: tool.category.toLowerCase().replace(/\s+/g, '-'),
      name: tool.category,
      description: `${tool.category} tools and software`,
      icon: 'folder',
      ai_keywords: tool.tags
    },
    subcategory: tool.category, // Use category as subcategory for now
    vendor: {
      id: `vendor-${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: tool.name,
      website: tool.website,
      support_email: '',
      founded_year: 2020, // Default value
      headquarters: 'Unknown',
      employee_count: 'medium',
      funding_status: 'public',
      trust_score: tool.rating / 5 * 100
    },
    pricing: {
      model: pricingModel,
      tiers: [{
        name: 'Standard',
        price: tool.pricing.startingPrice || 0,
        billing_period: tool.pricing.billingPeriod === 'month' ? 'monthly' : 
                       tool.pricing.billingPeriod === 'year' ? 'annually' : 'monthly',
        currency: tool.pricing.currency || 'USD',
        features: tool.features,
        limits: {},
        popular: false
      }],
      enterprise_pricing: false,
      cost_calculator: {
        variables: [],
        formula: '',
        discounts: []
      }
    },
    licensing: {
      type: 'per_user',
      terms: 'Standard Terms',
      auto_renewal: true,
      cancellation_policy: 'Cancel anytime',
      refund_policy: 'No refunds',
      data_retention: '30 days'
    },
    features: tool.features.map((feature, index) => ({
      id: `feature-${index}`,
      name: feature,
      description: feature,
      category: 'core',
      availability: 'all_tiers',
      ai_relevance_score: 0.8
    })),
    ai_capabilities: {
      has_ai: false,
      ai_features: [],
      ai_maturity_level: 'basic',
      ai_use_cases: []
    },
    integrations: [],
    apis: [],
    ratings: {
      overall: tool.rating,
      ease_of_use: tool.rating,
      features: tool.rating,
      value_for_money: tool.rating,
      customer_support: tool.rating,
      total_reviews: tool.reviewCount,
      rating_distribution: {
        five_star: Math.floor(tool.reviewCount * 0.6),
        four_star: Math.floor(tool.reviewCount * 0.25),
        three_star: Math.floor(tool.reviewCount * 0.1),
        two_star: Math.floor(tool.reviewCount * 0.03),
        one_star: Math.floor(tool.reviewCount * 0.02)
      }
    },
    reviews: [],
    certifications: [],
    security_score: 85, // Default security score
    performance_metrics: {
      uptime: 99.9,
      response_time: 200,
      error_rate: 0.1,
      last_updated: tool.lastUpdated,
      data_source: 'internal'
    },
    ai_summary: `${tool.name} is a ${tool.category.toLowerCase()} tool with ${tool.features.length} key features.`,
    ai_score: {
      overall: tool.rating * 20, // Convert 5-star to 100-point scale
      relevance: 80,
      quality: tool.rating * 20,
      value: tool.rating * 20,
      fit_score: 75,
      confidence: 0.85,
      explanation: `Based on ${tool.reviewCount} reviews and feature analysis`,
      factors: []
    },
    trend_data: {
      popularity_trend: [],
      search_volume: [],
      adoption_rate: 0.15,
      growth_rate: 0.05,
      market_position: 'established'
    },
    competitive_analysis: {
      main_competitors: [],
      differentiation: tool.features.slice(0, 3),
      market_share: 0.1,
      competitive_advantages: tool.features.slice(0, 2),
      weaknesses: []
    },
    created_at: tool.lastUpdated,
    updated_at: tool.lastUpdated,
    verification_status: 'verified' as VerificationStatus,
    popularity_score: tool.reviewCount / 1000 // Normalize review count to popularity score
  };
}

/**
 * Converts an AIEnhancedTool back to SoftwareToolModel format
 */
export function convertFromAIEnhancedTool(tool: AIEnhancedTool): SoftwareToolModel & { id: number } {
  const pricingTier = tool.pricing.tiers[0];
  
  return {
    id: parseInt(tool.id),
    name: tool.name,
    category: tool.category.name,
    logo: `/icons/${tool.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
    pricing: {
      type: tool.pricing.model === 'free' ? 'free' : 
            tool.pricing.model === 'freemium' ? 'freemium' : 'paid',
      startingPrice: pricingTier?.price,
      currency: pricingTier?.currency,
      billingPeriod: pricingTier?.billing_period === 'monthly' ? 'month' : 
                    pricingTier?.billing_period === 'annually' ? 'year' : 'month'
    },
    description: tool.description,
    features: tool.features.map(f => f.name),
    rating: tool.ratings.overall,
    reviewCount: tool.ratings.total_reviews,
    website: tool.vendor.website,
    tags: tool.category.ai_keywords,
    compatibility: ['Web', 'Desktop'], // Default compatibility
    lastUpdated: tool.updated_at
  };
}