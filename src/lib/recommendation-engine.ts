import {
  UserProfile,
  AIEnhancedTool,
  RecommendedTool,
  RecommendationContext,
  BudgetRange,
  ComplexityLevel,
  CompanySize
} from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { convertToAIEnhancedTool } from '@/lib/tool-conversion';

export interface UserBehavior {
  viewed_tools: string[];
  saved_tools: string[];
  search_history: string[];
  time_spent_per_category: Record<string, number>;
  feature_preferences: string[];
  price_sensitivity: number; // 0-1 scale
  integration_importance: number; // 0-1 scale
}

export interface RecommendationInput {
  user_profile: UserProfile;
  user_behavior: UserBehavior;
  current_tools: string[];
  context: RecommendationContext;
  available_tools: (SoftwareToolModel & { id: number })[];
}

export interface ScoredRecommendation {
  tool: AIEnhancedTool;
  score: number;
  reasons: string[];
  confidence: number;
  fit_factors: {
    profile_match: number;
    behavior_match: number;
    integration_fit: number;
    price_fit: number;
    feature_fit: number;
  };
}

export class PersonalizedRecommendationEngine {
  private readonly categoryWeights: Record<string, Record<string, number>> = {
    'startup': {
      'productivity': 0.9,
      'communication': 0.8,
      'project-management': 0.7,
      'design': 0.6,
      'development': 0.5
    },
    'small': {
      'project-management': 0.9,
      'communication': 0.8,
      'productivity': 0.7,
      'security': 0.6,
      'analytics': 0.5
    },
    'medium': {
      'security': 0.9,
      'analytics': 0.8,
      'project-management': 0.7,
      'communication': 0.6,
      'integration': 0.7
    },
    'large': {
      'security': 1.0,
      'compliance': 0.9,
      'analytics': 0.8,
      'enterprise': 0.8,
      'integration': 0.7
    },
    'enterprise': {
      'security': 1.0,
      'compliance': 1.0,
      'analytics': 0.9,
      'enterprise': 0.9,
      'integration': 0.8
    }
  };

  private readonly industryPreferences: Record<string, string[]> = {
    'technology': ['development', 'project-management', 'communication', 'analytics'],
    'marketing': ['marketing', 'analytics', 'design', 'communication'],
    'finance': ['analytics', 'security', 'compliance', 'project-management'],
    'healthcare': ['security', 'compliance', 'communication', 'analytics'],
    'education': ['communication', 'productivity', 'collaboration', 'content'],
    'retail': ['marketing', 'analytics', 'inventory', 'customer-service']
  };

  /**
   * Generate personalized tool recommendations using ML-like scoring
   */
  async generatePersonalizedRecommendations(input: RecommendationInput): Promise<RecommendedTool[]> {
    // Step 1: Filter out tools already in use
    const availableTools = input.available_tools.filter(tool => 
      !input.current_tools.includes(tool.name.toLowerCase())
    );

    // Step 2: Score each tool based on multiple factors
    const scoredRecommendations = await Promise.all(
      availableTools.map(tool => this.scoreToolForUser(tool, input))
    );

    // Step 3: Sort by score and apply diversity filtering
    const sortedRecommendations = scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Top 50 for diversity filtering

    // Step 4: Apply diversity filtering to avoid category clustering
    const diverseRecommendations = this.applyDiversityFiltering(sortedRecommendations, 20);

    // Step 5: Convert to RecommendedTool format with explanations
    return diverseRecommendations.map(scored => this.convertToRecommendedTool(scored, input));
  }

  private async scoreToolForUser(
    tool: SoftwareToolModel & { id: number },
    input: RecommendationInput
  ): Promise<ScoredRecommendation> {
    const enhancedTool = convertToAIEnhancedTool(tool);
    
    // Calculate individual scoring factors
    const profileMatch = this.calculateProfileMatch(tool, input.user_profile);
    const behaviorMatch = this.calculateBehaviorMatch(tool, input.user_behavior);
    const integrationFit = this.calculateIntegrationFit(tool, input.current_tools);
    const priceFit = this.calculatePriceFit(tool, input.user_profile, input.user_behavior);
    const featureFit = this.calculateFeatureFit(tool, input.user_profile, input.user_behavior);

    // Apply weighting based on user context
    const weights = this.getContextualWeights(input);
    
    const weightedScore = (
      profileMatch * weights.profile +
      behaviorMatch * weights.behavior +
      integrationFit * weights.integration +
      priceFit * weights.price +
      featureFit * weights.features
    );

    // Apply context-specific boosters
    const contextBoost = this.calculateContextBoost(tool, input.context);
    const finalScore = Math.min(weightedScore + contextBoost, 1.0);

    // Generate reasoning
    const reasons = this.generateRecommendationReasons(tool, input, {
      profileMatch,
      behaviorMatch,
      integrationFit,
      priceFit,
      featureFit
    });

    return {
      tool: enhancedTool,
      score: finalScore,
      reasons,
      confidence: this.calculateConfidence(finalScore, input),
      fit_factors: {
        profile_match: profileMatch,
        behavior_match: behaviorMatch,
        integration_fit: integrationFit,
        price_fit: priceFit,
        feature_fit: featureFit
      }
    };
  }

  private calculateProfileMatch(
    tool: SoftwareToolModel & { id: number },
    profile: UserProfile
  ): number {
    let score = 0;

    // Company size relevance
    const categoryWeight = this.categoryWeights[profile.company_size]?.[
      tool.category.toLowerCase().replace(/\s+/g, '-')
    ] || 0.3;
    score += categoryWeight * 0.3;

    // Industry relevance
    const industryCategories = this.industryPreferences[profile.industry] || [];
    const industryMatch = industryCategories.some(cat => 
      tool.category.toLowerCase().includes(cat) || 
      tool.tags.some(tag => tag.toLowerCase().includes(cat))
    );
    if (industryMatch) score += 0.2;

    // Department relevance
    if (tool.category.toLowerCase().includes(profile.department) || 
        tool.tags.some(tag => tag.toLowerCase().includes(profile.department))) {
      score += 0.2;
    }

    // Experience level considerations
    const complexityBonus = this.getComplexityBonus(tool, profile.experience_level);
    score += complexityBonus * 0.15;

    // Use case alignment
    const useCaseMatch = profile.primary_use_cases.some(useCase =>
      tool.description.toLowerCase().includes(useCase.toLowerCase()) ||
      tool.features.some(feature => feature.toLowerCase().includes(useCase.toLowerCase()))
    );
    if (useCaseMatch) score += 0.15;

    return Math.min(score, 1.0);
  }

  private calculateBehaviorMatch(
    tool: SoftwareToolModel & { id: number },
    behavior: UserBehavior
  ): number {
    let score = 0;

    // Category time spent correlation
    const toolCategory = tool.category.toLowerCase().replace(/\s+/g, '-');
    const timeSpent = behavior.time_spent_per_category[toolCategory] || 0;
    const maxTimeSpent = Math.max(...Object.values(behavior.time_spent_per_category), 1);
    score += (timeSpent / maxTimeSpent) * 0.3;

    // Feature preference matching
    const featureMatches = behavior.feature_preferences.filter(pref =>
      tool.features.some(feature => feature.toLowerCase().includes(pref.toLowerCase()))
    ).length;
    score += (featureMatches / Math.max(behavior.feature_preferences.length, 1)) * 0.2;

    // Search history relevance
    const searchMatches = behavior.search_history.filter(search =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    ).length;
    score += Math.min(searchMatches / 10, 0.3); // Cap at 0.3

    // Similar tool viewing behavior
    const viewedSimilarTools = behavior.viewed_tools.filter(viewedTool =>
      // This would typically use a more sophisticated similarity algorithm
      tool.category.toLowerCase().includes(viewedTool.toLowerCase())
    ).length;
    score += Math.min(viewedSimilarTools / 5, 0.2); // Cap at 0.2

    return Math.min(score, 1.0);
  }

  private calculateIntegrationFit(
    tool: SoftwareToolModel & { id: number },
    currentTools: string[]
  ): number {
    if (currentTools.length === 0) return 0.5; // Neutral if no current tools

    let score = 0;
    const knownIntegrations = this.getKnownIntegrations(tool.name);
    
    // Check if tool integrates with current stack
    const integrationMatches = currentTools.filter(currentTool =>
      knownIntegrations.some(integration => 
        integration.toLowerCase().includes(currentTool.toLowerCase()) ||
        currentTool.toLowerCase().includes(integration.toLowerCase())
      )
    ).length;

    score += (integrationMatches / currentTools.length) * 0.7;

    // Bonus for popular integration ecosystems
    const hasPopularIntegrations = knownIntegrations.some(integration =>
      ['slack', 'google', 'microsoft', 'zapier', 'api'].some(popular =>
        integration.toLowerCase().includes(popular)
      )
    );
    if (hasPopularIntegrations) score += 0.3;

    return Math.min(score, 1.0);
  }

  private calculatePriceFit(
    tool: SoftwareToolModel & { id: number },
    profile: UserProfile,
    behavior: UserBehavior
  ): number {
    let score = 0;

    // Budget alignment based on company size
    const budgetConstraints = this.getBudgetConstraints(profile.company_size);
    
    if (tool.pricing.type === 'free') {
      score += budgetConstraints.freeBonus;
    } else if (tool.pricing.type === 'freemium') {
      score += budgetConstraints.freemiumBonus;
    } else if (tool.pricing.startingPrice) {
      const priceScore = this.calculatePriceScore(
        tool.pricing.startingPrice,
        budgetConstraints.maxPrice
      );
      score += priceScore * 0.6;
    }

    // User price sensitivity consideration
    const sensitivityAdjustment = (1 - behavior.price_sensitivity) * 0.2;
    if (tool.pricing.type === 'free' || tool.pricing.type === 'freemium') {
      score += behavior.price_sensitivity * 0.2;
    } else {
      score += sensitivityAdjustment;
    }

    // Rating quality bonus (higher rated tools justify higher prices)
    const qualityBonus = (tool.rating / 5) * 0.2;
    score += qualityBonus;

    return Math.min(score, 1.0);
  }

  private calculateFeatureFit(
    tool: SoftwareToolModel & { id: number },
    profile: UserProfile,
    behavior: UserBehavior
  ): number {
    let score = 0;

    // Feature richness vs simplicity based on experience
    const featureCount = tool.features.length;
    const experienceMultiplier = this.getFeatureComplexityMultiplier(profile.experience_level);
    
    if (featureCount >= 5 && profile.experience_level !== 'beginner') {
      score += 0.3 * experienceMultiplier;
    } else if (featureCount <= 3 && profile.experience_level === 'beginner') {
      score += 0.3;
    }

    // Specific feature matching
    const requiredFeatures = this.getRequiredFeatures(profile);
    const featureMatches = requiredFeatures.filter(required =>
      tool.features.some(feature => 
        feature.toLowerCase().includes(required.toLowerCase())
      )
    ).length;
    score += (featureMatches / Math.max(requiredFeatures.length, 1)) * 0.4;

    // Innovation bonus for advanced users
    if (profile.experience_level === 'expert' && tool.tags.includes('innovative')) {
      score += 0.2;
    }

    // User behavior feature preference alignment
    const behaviorFeatureMatch = behavior.feature_preferences.filter(pref =>
      tool.features.some(feature => feature.toLowerCase().includes(pref.toLowerCase()))
    ).length;
    score += (behaviorFeatureMatch / Math.max(behavior.feature_preferences.length, 1)) * 0.3;

    return Math.min(score, 1.0);
  }

  private getContextualWeights(input: RecommendationInput) {
    const baseWeights = {
      profile: 0.25,
      behavior: 0.25,
      integration: 0.2,
      price: 0.15,
      features: 0.15
    };

    // Adjust weights based on context intent
    switch (input.context.intent) {
      case 'replace_existing':
        return { ...baseWeights, integration: 0.4, behavior: 0.3 };
      case 'consolidate_stack':
        return { ...baseWeights, integration: 0.5, price: 0.2 };
      case 'scale_team':
        return { ...baseWeights, profile: 0.4, features: 0.2 };
      case 'optimize_workflow':
        return { ...baseWeights, behavior: 0.4, integration: 0.3 };
      default:
        return baseWeights;
    }
  }

  private calculateContextBoost(
    tool: SoftwareToolModel & { id: number },
    context: RecommendationContext
  ): number {
    let boost = 0;

    // Urgency boost
    if (context.timeline === 'immediate' && tool.tags.includes('quick-setup')) {
      boost += 0.1;
    }

    // Goal-specific boosts
    if (context.goals.some(goal => 
      tool.description.toLowerCase().includes(goal.toLowerCase()) ||
      tool.features.some(feature => feature.toLowerCase().includes(goal.toLowerCase()))
    )) {
      boost += 0.1;
    }

    // Pain point resolution
    if (context.pain_points.some(pain =>
      tool.description.toLowerCase().includes(pain.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(pain.toLowerCase()))
    )) {
      boost += 0.15;
    }

    return boost;
  }

  private applyDiversityFiltering(
    recommendations: ScoredRecommendation[],
    targetCount: number
  ): ScoredRecommendation[] {
    const diverse: ScoredRecommendation[] = [];
    const categoryCounts: Record<string, number> = {};
    const maxPerCategory = Math.ceil(targetCount / 5); // Limit per category

    for (const rec of recommendations) {
      const category = rec.tool.category.name.toLowerCase();
      const currentCount = categoryCounts[category] || 0;

      if (currentCount < maxPerCategory) {
        diverse.push(rec);
        categoryCounts[category] = currentCount + 1;
        
        if (diverse.length >= targetCount) break;
      }
    }

    // If we haven't reached target count, add remaining top scores
    if (diverse.length < targetCount) {
      const remaining = recommendations.filter(rec => !diverse.includes(rec));
      diverse.push(...remaining.slice(0, targetCount - diverse.length));
    }

    return diverse;
  }

  private convertToRecommendedTool(
    scored: ScoredRecommendation,
    input: RecommendationInput
  ): RecommendedTool {
    const implementationEffort = this.calculateImplementationEffort(scored.tool, input.user_profile);
    
    return {
      tool: scored.tool,
      recommendation_score: scored.score,
      rationale: this.generateRationale(scored),
      use_case_fit: this.generateUseCaseFit(scored.tool, input.user_profile),
      implementation_effort: implementationEffort,
      expected_roi: {
        time_savings: this.estimateTimeSavings(scored.tool, input),
        cost_savings: this.estimateCostSavings(scored.tool, input),
        productivity_gain: scored.score * 0.3, // Correlate with score
        confidence_level: scored.confidence
      }
    };
  }

  // Helper methods
  private getComplexityBonus(tool: SoftwareToolModel & { id: number }, experience: string): number {
    const featureCount = tool.features.length;
    
    switch (experience) {
      case 'beginner': return featureCount <= 3 ? 0.3 : 0.1;
      case 'intermediate': return featureCount >= 3 && featureCount <= 6 ? 0.3 : 0.2;
      case 'advanced': return featureCount >= 5 ? 0.3 : 0.2;
      case 'expert': return 0.2; // Experts can handle any complexity
      default: return 0.2;
    }
  }

  private getKnownIntegrations(toolName: string): string[] {
    // This would typically come from a database of known integrations
    const integrationMap: Record<string, string[]> = {
      'slack': ['google', 'microsoft', 'jira', 'trello', 'github', 'zoom'],
      'notion': ['slack', 'google', 'figma', 'github', 'calendar'],
      'figma': ['slack', 'notion', 'jira', 'github', 'adobe'],
      'jira': ['slack', 'github', 'figma', 'confluence', 'bitbucket'],
      // Add more as needed
    };
    
    return integrationMap[toolName.toLowerCase()] || ['api', 'webhook', 'zapier'];
  }

  private getBudgetConstraints(companySize: CompanySize) {
    const constraints = {
      'startup': { maxPrice: 50, freeBonus: 0.4, freemiumBonus: 0.3 },
      'small': { maxPrice: 100, freeBonus: 0.3, freemiumBonus: 0.3 },
      'medium': { maxPrice: 300, freeBonus: 0.2, freemiumBonus: 0.25 },
      'large': { maxPrice: 1000, freeBonus: 0.1, freemiumBonus: 0.15 },
      'enterprise': { maxPrice: 5000, freeBonus: 0.05, freemiumBonus: 0.1 }
    };
    
    return constraints[companySize] || constraints['medium'];
  }

  private calculatePriceScore(price: number, maxPrice: number): number {
    if (price <= maxPrice) {
      return 1 - (price / maxPrice) * 0.5; // Higher score for lower prices within budget
    }
    return Math.max(0, 1 - (price / maxPrice)); // Penalty for over-budget
  }

  private getFeatureComplexityMultiplier(experience: string): number {
    const multipliers = {
      'beginner': 0.7,
      'intermediate': 1.0,
      'advanced': 1.2,
      'expert': 1.3
    };
    return multipliers[experience as keyof typeof multipliers] || 1.0;
  }

  private getRequiredFeatures(profile: UserProfile): string[] {
    const departmentFeatures: Record<string, string[]> = {
      'development': ['git', 'api', 'collaboration', 'version control'],
      'design': ['collaboration', 'prototype', 'export', 'sharing'],
      'marketing': ['analytics', 'campaigns', 'social media', 'reporting'],
      'sales': ['crm', 'pipeline', 'reporting', 'communication'],
      'product': ['roadmap', 'analytics', 'user feedback', 'prioritization']
    };
    
    return departmentFeatures[profile.department] || ['collaboration', 'reporting'];
  }

  private calculateImplementationEffort(tool: AIEnhancedTool, profile: UserProfile): ComplexityLevel {
    const factors = [
      tool.features.length > 8 ? 1 : 0, // Feature complexity
      profile.experience_level === 'beginner' ? 1 : 0, // User experience
      // Add more factors as needed
    ];
    
    const complexityScore = factors.reduce((sum, factor) => sum + factor, 0);
    
    if (complexityScore >= 3) return 'expert_required';
    if (complexityScore >= 2) return 'complex';
    if (complexityScore >= 1) return 'moderate';
    return 'simple';
  }

  private generateRecommendationReasons(
    tool: SoftwareToolModel & { id: number },
    input: RecommendationInput,
    factors: any
  ): string[] {
    const reasons: string[] = [];
    
    if (factors.profileMatch > 0.7) {
      reasons.push(`Perfect fit for ${input.user_profile.company_size} ${input.user_profile.industry} companies`);
    }
    
    if (factors.integrationFit > 0.6) {
      reasons.push(`Integrates well with your current tools`);
    }
    
    if (factors.priceFit > 0.8) {
      reasons.push(`Great value for your budget`);
    }
    
    if (tool.rating >= 4.5) {
      reasons.push(`Highly rated by users (${tool.rating}/5)`);
    }
    
    if (factors.behaviorMatch > 0.6) {
      reasons.push(`Matches your usage patterns`);
    }
    
    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  private generateRationale(scored: ScoredRecommendation): string {
    const topReasons = scored.reasons.slice(0, 2);
    return topReasons.join('. ') + '.';
  }

  private generateUseCaseFit(tool: AIEnhancedTool, profile: UserProfile): string {
    return `Ideal for ${profile.department} teams looking to ${profile.primary_use_cases[0] || 'improve productivity'}`;
  }

  private estimateTimeSavings(tool: AIEnhancedTool, input: RecommendationInput): string {
    // Simple estimation based on tool category and user profile
    const baseSavings = tool.category.name.includes('automation') ? 10 : 5;
    const profileMultiplier = input.user_profile.company_size === 'large' ? 1.5 : 1.0;
    
    const estimated = Math.round(baseSavings * profileMultiplier);
    return `${estimated} hours/week`;
  }

  private estimateCostSavings(tool: AIEnhancedTool, input: RecommendationInput): number {
    // Estimate based on potential efficiency gains and current tool costs
    const baseAnnualSavings = input.user_profile.company_size === 'enterprise' ? 5000 : 1000;
    return Math.round(baseAnnualSavings * (tool.ai_score.value / 100));
  }

  private calculateConfidence(score: number, input: RecommendationInput): number {
    let confidence = score; // Base confidence from score
    
    // Adjust based on data availability
    if (input.user_behavior.viewed_tools.length > 10) confidence += 0.1;
    if (input.user_behavior.search_history.length > 5) confidence += 0.1;
    if (input.current_tools.length > 3) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}

export const personalizedRecommendationEngine = new PersonalizedRecommendationEngine();