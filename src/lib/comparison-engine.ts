import { AIEnhancedTool, UserProfile, ROIEstimate } from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

export interface ComparisonCriteria {
  features: string[];
  pricing: boolean;
  security: boolean;
  integrations: boolean;
  usability: boolean;
  performance: boolean;
  support: boolean;
  scalability: boolean;
}

export interface FeatureComparison {
  feature: string;
  category: 'core' | 'advanced' | 'premium' | 'enterprise';
  tools: {
    toolId: string;
    available: boolean;
    quality: 'excellent' | 'good' | 'basic' | 'poor';
    notes: string;
    tier_required?: string;
  }[];
  importance_score: number;
  recommendation: string;
}

export interface PricingComparison {
  tool_id: string;
  tool_name: string;
  pricing_model: string;
  tiers: {
    name: string;
    price: number;
    billing: string;
    features: string[];
    user_limit?: number;
    popular?: boolean;
  }[];
  total_cost_scenarios: {
    scenario: string;
    users: number;
    monthly_cost: number;
    annual_cost: number;
    savings_vs_monthly: number;
  }[];
  value_score: number;
}

export interface ComparisonInsight {
  type: 'winner' | 'warning' | 'consideration' | 'recommendation';
  title: string;
  description: string;
  tools_mentioned: string[];
  confidence: number;
  category: string;
}

export interface AdvancedComparisonResult {
  tools: AIEnhancedTool[];
  feature_comparison: FeatureComparison[];
  pricing_comparison: PricingComparison[];
  insights: ComparisonInsight[];
  recommendations: {
    overall_winner: string;
    best_value: string;
    best_for_beginners: string;
    best_for_enterprise: string;
    reasoning: string;
  };
  roi_estimates: Record<string, ROIEstimate>;
  migration_complexity: Record<string, {
    from_current_tools: 'low' | 'medium' | 'high';
    setup_time: string;
    training_required: boolean;
    data_migration: boolean;
  }>;
}

export class AdvancedComparisonEngine {
  private featureImportanceWeights: Record<string, number> = {
    // Core features
    'collaboration': 0.9,
    'security': 0.9,
    'integration': 0.8,
    'reporting': 0.7,
    'automation': 0.7,
    'mobile': 0.6,
    'api': 0.8,
    'backup': 0.7,
    'permissions': 0.8,
    'search': 0.6,
    
    // Advanced features
    'ai': 0.5,
    'analytics': 0.7,
    'customization': 0.6,
    'workflow': 0.7,
    'templates': 0.5,
    'notifications': 0.5
  };

  async performAdvancedComparison(
    tools: (SoftwareToolModel & { id: number })[],
    criteria: ComparisonCriteria,
    userProfile: UserProfile
  ): Promise<AdvancedComparisonResult> {
    
    // Convert to enhanced tools for analysis
    const enhancedTools = tools.map(tool => this.convertToEnhancedTool(tool));
    
    // Generate comprehensive feature comparison
    const featureComparison = await this.generateFeatureComparison(tools, criteria);
    
    // Analyze pricing across all tools
    const pricingComparison = this.generatePricingComparison(tools);
    
    // Generate AI insights about the comparison
    const insights = await this.generateComparisonInsights(tools, featureComparison, pricingComparison, userProfile);
    
    // Generate recommendations based on analysis
    const recommendations = this.generateRecommendations(tools, featureComparison, pricingComparison, userProfile);
    
    // Calculate ROI estimates for each tool
    const roiEstimates = this.calculateROIEstimates(tools, userProfile);
    
    // Assess migration complexity
    const migrationComplexity = this.assessMigrationComplexity(tools, userProfile);

    return {
      tools: enhancedTools,
      feature_comparison: featureComparison,
      pricing_comparison: pricingComparison,
      insights,
      recommendations,
      roi_estimates: roiEstimates,
      migration_complexity: migrationComplexity
    };
  }

  private async generateFeatureComparison(
    tools: (SoftwareToolModel & { id: number })[],
    criteria: ComparisonCriteria
  ): Promise<FeatureComparison[]> {
    // Get all unique features across tools
    const allFeatures = new Set<string>();
    tools.forEach(tool => {
      tool.features.forEach(feature => allFeatures.add(feature.toLowerCase()));
    });

    // Add criteria-specific features
    if (criteria.security) {
      allFeatures.add('encryption');
      allFeatures.add('two-factor authentication');
      allFeatures.add('sso');
      allFeatures.add('compliance');
    }
    if (criteria.integrations) {
      allFeatures.add('api access');
      allFeatures.add('webhook support');
      allFeatures.add('third-party integrations');
    }

    const comparisons: FeatureComparison[] = [];

    for (const feature of allFeatures) {
      const toolAvailability = tools.map(tool => {
        const hasFeature = tool.features.some(f => 
          f.toLowerCase().includes(feature) || 
          feature.includes(f.toLowerCase())
        );
        
        return {
          toolId: tool.id.toString(),
          available: hasFeature,
          quality: this.assessFeatureQuality(tool, feature),
          notes: this.generateFeatureNotes(tool, feature, hasFeature),
          tier_required: hasFeature ? this.determineTierRequired(tool, feature) : undefined
        };
      });

      const importanceScore = this.calculateFeatureImportance(feature);
      
      comparisons.push({
        feature: this.formatFeatureName(feature),
        category: this.categorizeFeature(feature),
        tools: toolAvailability,
        importance_score: importanceScore,
        recommendation: this.generateFeatureRecommendation(feature, toolAvailability, importanceScore)
      });
    }

    // Sort by importance score
    return comparisons.sort((a, b) => b.importance_score - a.importance_score);
  }

  private generatePricingComparison(tools: (SoftwareToolModel & { id: number })[]): PricingComparison[] {
    return tools.map(tool => {
      const tiers = this.generatePricingTiers(tool);
      const scenarios = this.generateCostScenarios(tool, tiers);
      
      return {
        tool_id: tool.id.toString(),
        tool_name: tool.name,
        pricing_model: tool.pricing.type,
        tiers,
        total_cost_scenarios: scenarios,
        value_score: this.calculateValueScore(tool, scenarios)
      };
    });
  }

  private async generateComparisonInsights(
    tools: (SoftwareToolModel & { id: number })[],
    featureComparison: FeatureComparison[],
    pricingComparison: PricingComparison[],
    userProfile: UserProfile
  ): Promise<ComparisonInsight[]> {
    const insights: ComparisonInsight[] = [];

    // Feature insights
    insights.push(...this.generateFeatureInsights(tools, featureComparison));
    
    // Pricing insights
    insights.push(...this.generatePricingInsights(tools, pricingComparison));
    
    // Security insights
    insights.push(...this.generateSecurityInsights(tools, featureComparison));
    
    // Integration insights
    insights.push(...this.generateIntegrationInsights(tools, featureComparison));
    
    // User profile specific insights
    insights.push(...this.generateProfileSpecificInsights(tools, userProfile, featureComparison));

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private generateFeatureInsights(
    tools: (SoftwareToolModel & { id: number })[],
    featureComparison: FeatureComparison[]
  ): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];

    // Find feature gaps
    const coreFeatures = featureComparison.filter(f => f.category === 'core');
    coreFeatures.forEach(feature => {
      const missingTools = feature.tools.filter(t => !t.available);
      if (missingTools.length > 0) {
        insights.push({
          type: 'warning',
          title: `Missing Core Feature: ${feature.feature}`,
          description: `${missingTools.length} tool(s) lack this essential feature, which could impact productivity.`,
          tools_mentioned: missingTools.map(t => t.toolId),
          confidence: 0.9,
          category: 'features'
        });
      }
    });

    // Find feature leaders
    const toolFeatureCounts = tools.map(tool => ({
      id: tool.id.toString(),
      name: tool.name,
      count: featureComparison.filter(f => 
        f.tools.find(t => t.toolId === tool.id.toString())?.available
      ).length
    }));

    const leader = toolFeatureCounts.reduce((max, current) => 
      current.count > max.count ? current : max
    );

    insights.push({
      type: 'winner',
      title: 'Feature Completeness Leader',
      description: `${leader.name} offers the most comprehensive feature set with ${leader.count} features.`,
      tools_mentioned: [leader.id],
      confidence: 0.8,
      category: 'features'
    });

    return insights;
  }

  private generatePricingInsights(
    _tools: (SoftwareToolModel & { id: number })[],
    pricingComparison: PricingComparison[]
  ): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];

    // Find best value
    const bestValue = pricingComparison.reduce((best, current) => 
      current.value_score > best.value_score ? current : best
    );

    insights.push({
      type: 'winner',
      title: 'Best Value for Money',
      description: `${bestValue.tool_name} offers the best value proposition with a score of ${bestValue.value_score}/100.`,
      tools_mentioned: [bestValue.tool_id],
      confidence: 0.85,
      category: 'pricing'
    });

    // Find free options
    const freeTools = pricingComparison.filter(p => p.pricing_model === 'free');
    if (freeTools.length > 0) {
      insights.push({
        type: 'consideration',
        title: 'Free Options Available',
        description: `${freeTools.map(t => t.tool_name).join(', ')} offer${freeTools.length === 1 ? 's' : ''} free tier${freeTools.length === 1 ? '' : 's'}, great for testing or small teams.`,
        tools_mentioned: freeTools.map(t => t.tool_id),
        confidence: 0.9,
        category: 'pricing'
      });
    }

    // Pricing warnings
    const expensiveTools = pricingComparison.filter(p => 
      p.total_cost_scenarios.some(s => s.monthly_cost > 100)
    );
    if (expensiveTools.length > 0) {
      insights.push({
        type: 'warning',
        title: 'High Cost Tools',
        description: `${expensiveTools.map(t => t.tool_name).join(', ')} may be expensive for larger teams. Consider volume discounts.`,
        tools_mentioned: expensiveTools.map(t => t.tool_id),
        confidence: 0.7,
        category: 'pricing'
      });
    }

    return insights;
  }

  private generateSecurityInsights(
    tools: (SoftwareToolModel & { id: number })[],
    featureComparison: FeatureComparison[]
  ): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];

    const securityFeatures = ['encryption', 'two-factor authentication', 'sso', 'compliance'];
    const securityComparisons = featureComparison.filter(f => 
      securityFeatures.some(sf => f.feature.toLowerCase().includes(sf))
    );

    if (securityComparisons.length > 0) {
      const toolSecurityScores = tools.map(tool => {
        const score = securityComparisons.filter(sc =>
          sc.tools.find(t => t.toolId === tool.id.toString())?.available
        ).length;
        return { tool, score };
      });

      const securityLeader = toolSecurityScores.reduce((max, current) => 
        current.score > max.score ? current : max
      );

      insights.push({
        type: 'winner',
        title: 'Security Leader',
        description: `${securityLeader.tool.name} has the strongest security features with ${securityLeader.score} security capabilities.`,
        tools_mentioned: [securityLeader.tool.id.toString()],
        confidence: 0.9,
        category: 'security'
      });
    }

    return insights;
  }

  private generateIntegrationInsights(
    tools: (SoftwareToolModel & { id: number })[],
    featureComparison: FeatureComparison[]
  ): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];

    const integrationFeatures = featureComparison.filter(f => 
      f.feature.toLowerCase().includes('integration') || 
      f.feature.toLowerCase().includes('api')
    );

    if (integrationFeatures.length > 0) {
      const toolIntegrationScores = tools.map(tool => {
        const score = integrationFeatures.filter(if_ =>
          if_.tools.find(t => t.toolId === tool.id.toString())?.available
        ).length;
        return { tool, score };
      });

      const integrationLeader = toolIntegrationScores.reduce((max, current) => 
        current.score > max.score ? current : max
      );

      if (integrationLeader.score > 0) {
        insights.push({
          type: 'winner',
          title: 'Integration Champion',
          description: `${integrationLeader.tool.name} excels at integrations with ${integrationLeader.score} integration capabilities.`,
          tools_mentioned: [integrationLeader.tool.id.toString()],
          confidence: 0.8,
          category: 'integrations'
        });
      }
    }

    return insights;
  }

  private generateProfileSpecificInsights(
    tools: (SoftwareToolModel & { id: number })[],
    userProfile: UserProfile,
    _featureComparison: FeatureComparison[]
  ): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];

    // Company size specific insights
    if (userProfile.company_size === 'startup' || userProfile.company_size === 'small') {
      const simpleTools = tools.filter(tool => tool.features.length <= 5);
      if (simpleTools.length > 0) {
        insights.push({
          type: 'recommendation',
          title: 'Small Team Friendly',
          description: `For ${userProfile.company_size} teams, consider ${simpleTools.map(t => t.name).join(', ')} for their simplicity and ease of use.`,
          tools_mentioned: simpleTools.map(t => t.id.toString()),
          confidence: 0.7,
          category: 'usability'
        });
      }
    }

    // Experience level insights
    if (userProfile.experience_level === 'beginner') {
      const userFriendlyTools = tools.filter(tool => 
        tool.description.toLowerCase().includes('easy') || 
        tool.description.toLowerCase().includes('simple') ||
        tool.tags.includes('beginner-friendly')
      );
      
      if (userFriendlyTools.length > 0) {
        insights.push({
          type: 'recommendation',
          title: 'Beginner Friendly Options',
          description: `As a beginner, you might prefer ${userFriendlyTools.map(t => t.name).join(', ')} for their user-friendly interfaces.`,
          tools_mentioned: userFriendlyTools.map(t => t.id.toString()),
          confidence: 0.8,
          category: 'usability'
        });
      }
    }

    return insights;
  }

  private generateRecommendations(
    tools: (SoftwareToolModel & { id: number })[],
    featureComparison: FeatureComparison[],
    pricingComparison: PricingComparison[],
    userProfile: UserProfile
  ) {
    // Calculate overall scores for each tool
    const toolScores = tools.map(tool => {
      const featureScore = this.calculateFeatureScore(tool, featureComparison);
      const pricingScore = this.calculatePricingScore(tool, pricingComparison);
      const profileScore = this.calculateProfileScore(tool, userProfile);
      
      const overallScore = (featureScore * 0.4) + (pricingScore * 0.3) + (profileScore * 0.3);
      
      return { tool, overallScore, featureScore, pricingScore, profileScore };
    });

    const sortedByOverall = [...toolScores].sort((a, b) => b.overallScore - a.overallScore);
    const sortedByValue = [...toolScores].sort((a, b) => b.pricingScore - a.pricingScore);
    
    // Find best for different scenarios
    const overallWinner = sortedByOverall[0];
    const bestValue = sortedByValue[0];
    const bestForBeginners = toolScores.find(ts => 
      ts.tool.features.length <= 5 && ts.tool.rating >= 4.0
    ) || sortedByOverall[0];
    const bestForEnterprise = toolScores.find(ts =>
      ts.tool.features.length >= 7 && ts.tool.tags.includes('enterprise')
    ) || sortedByOverall[0];

    return {
      overall_winner: overallWinner.tool.name,
      best_value: bestValue.tool.name,
      best_for_beginners: bestForBeginners.tool.name,
      best_for_enterprise: bestForEnterprise.tool.name,
      reasoning: this.generateRecommendationReasoning(overallWinner, bestValue, userProfile)
    };
  }

  // Helper methods
  private convertToEnhancedTool(tool: SoftwareToolModel & { id: number }): AIEnhancedTool {
    // This would use the existing conversion utility
    // For now, return a simplified version
    return {
      id: tool.id.toString(),
      name: tool.name,
      description: tool.description,
      category: {
        id: tool.category.toLowerCase().replace(/\s+/g, '-'),
        name: tool.category,
        description: '',
        icon: '',
        ai_keywords: tool.tags
      },
      subcategory: tool.category,
      // ... other required fields would be filled in
    } as AIEnhancedTool;
  }

  private assessFeatureQuality(tool: SoftwareToolModel & { id: number }, _feature: string): 'excellent' | 'good' | 'basic' | 'poor' {
    // This would ideally use real quality data
    // For now, base it on tool rating and feature match
    if (tool.rating >= 4.5) return 'excellent';
    if (tool.rating >= 4.0) return 'good';
    if (tool.rating >= 3.5) return 'basic';
    return 'poor';
  }

  private generateFeatureNotes(_tool: SoftwareToolModel & { id: number }, feature: string, hasFeature: boolean): string {
    if (!hasFeature) return 'Not available';
    
    // Generate contextual notes based on the feature and tool
    if (feature.includes('collaboration')) return 'Real-time collaboration supported';
    if (feature.includes('security')) return 'Enterprise-grade security';
    if (feature.includes('api')) return 'Full API access available';
    if (feature.includes('mobile')) return 'Mobile apps available';
    
    return 'Available';
  }

  private determineTierRequired(tool: SoftwareToolModel & { id: number }, feature: string): string {
    // Determine which pricing tier includes this feature
    if (tool.pricing.type === 'free') return 'Free';
    if (feature.includes('enterprise') || feature.includes('advanced')) return 'Premium';
    return 'Standard';
  }

  private calculateFeatureImportance(feature: string): number {
    const lowerFeature = feature.toLowerCase();
    
    // Check against our importance weights
    for (const [key, weight] of Object.entries(this.featureImportanceWeights)) {
      if (lowerFeature.includes(key)) {
        return weight;
      }
    }
    
    return 0.5; // Default importance
  }

  private formatFeatureName(feature: string): string {
    return feature.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private categorizeFeature(feature: string): 'core' | 'advanced' | 'premium' | 'enterprise' {
    const coreFeatures = ['collaboration', 'basic', 'sharing', 'export'];
    const advancedFeatures = ['automation', 'analytics', 'workflow', 'templates'];
    const premiumFeatures = ['ai', 'advanced analytics', 'custom'];
    const enterpriseFeatures = ['sso', 'compliance', 'audit', 'enterprise'];

    const lowerFeature = feature.toLowerCase();
    
    if (enterpriseFeatures.some(ef => lowerFeature.includes(ef))) return 'enterprise';
    if (premiumFeatures.some(pf => lowerFeature.includes(pf))) return 'premium';
    if (advancedFeatures.some(af => lowerFeature.includes(af))) return 'advanced';
    if (coreFeatures.some(cf => lowerFeature.includes(cf))) return 'core';
    return 'core';
  }

  private generateFeatureRecommendation(
    feature: string, 
    toolAvailability: any[], 
    importanceScore: number
  ): string {
    const availableCount = toolAvailability.filter(ta => ta.available).length;
    const totalCount = toolAvailability.length;
    
    if (importanceScore > 0.8 && availableCount < totalCount) {
      return `High importance feature - consider tools that include ${feature}`;
    } else if (availableCount === totalCount) {
      return `All tools support this feature`;
    } else if (availableCount === 0) {
      return `This feature is not available in any of the compared tools`;
    } else {
      return `Available in ${availableCount} of ${totalCount} tools`;
    }
  }

  private generatePricingTiers(tool: SoftwareToolModel & { id: number }) {
    // Generate realistic pricing tiers based on tool data
    const baseTiers = [];
    
    if (tool.pricing.type === 'free') {
      baseTiers.push({
        name: 'Free',
        price: 0,
        billing: 'monthly',
        features: tool.features.slice(0, 3),
        user_limit: 5,
        popular: false
      });
    }
    
    if (tool.pricing.type === 'freemium' || tool.pricing.type === 'paid') {
      baseTiers.push({
        name: 'Pro',
        price: tool.pricing.startingPrice || 10,
        billing: 'monthly',
        features: tool.features,
        popular: true
      });
      
      baseTiers.push({
        name: 'Enterprise',
        price: (tool.pricing.startingPrice || 10) * 3,
        billing: 'monthly',
        features: [...tool.features, 'Priority Support', 'Advanced Security'],
        popular: false
      });
    }
    
    return baseTiers;
  }

  private generateCostScenarios(_tool: SoftwareToolModel & { id: number }, tiers: any[]) {
    const scenarios = [];
    const userCounts = [5, 25, 100];
    
    for (const userCount of userCounts) {
      const applicableTier = tiers.find(tier => !tier.user_limit || tier.user_limit >= userCount) || tiers[tiers.length - 1];
      const monthlyBase = applicableTier.price * (applicableTier.user_limit ? 1 : userCount);
      const annualBase = monthlyBase * 12;
      const annualSavings = annualBase * 0.15; // Assume 15% annual discount
      
      scenarios.push({
        scenario: `${userCount} users`,
        users: userCount,
        monthly_cost: monthlyBase,
        annual_cost: annualBase - annualSavings,
        savings_vs_monthly: annualSavings
      });
    }
    
    return scenarios;
  }

  private calculateValueScore(tool: SoftwareToolModel & { id: number }, scenarios: any[]): number {
    // Calculate value based on features vs cost
    const avgMonthlyCost = scenarios.reduce((sum, s) => sum + s.monthly_cost, 0) / scenarios.length;
    const featureCount = tool.features.length;
    const rating = tool.rating;
    
    // Higher score for more features per dollar and higher ratings
    const costEfficiency = featureCount / Math.max(avgMonthlyCost, 1);
    const qualityBonus = rating / 5;
    
    return Math.min((costEfficiency * 20) + (qualityBonus * 30), 100);
  }

  private calculateROIEstimates(
    tools: (SoftwareToolModel & { id: number })[],
    userProfile: UserProfile
  ): Record<string, ROIEstimate> {
    const estimates: Record<string, ROIEstimate> = {};
    
    tools.forEach(tool => {
      const baseProductivityGain = tool.rating / 5 * 0.2; // 0-20% based on rating
      const timeSavingsHours = Math.round(baseProductivityGain * 40); // Weekly hours saved
      const costSavings = this.estimateCostSavings(tool, userProfile);
      
      estimates[tool.id.toString()] = {
        time_savings: `${timeSavingsHours} hours/week`,
        cost_savings: costSavings,
        productivity_gain: baseProductivityGain,
        confidence_level: 0.7
      };
    });
    
    return estimates;
  }

  private estimateCostSavings(tool: SoftwareToolModel & { id: number }, userProfile: UserProfile): number {
    // Estimate annual cost savings based on company size and tool category
    const baseSavings = {
      'startup': 2000,
      'small': 5000,
      'medium': 15000,
      'large': 50000,
      'enterprise': 100000
    };
    
    const categoryMultipliers = {
      'productivity': 1.2,
      'automation': 1.5,
      'communication': 1.0,
      'project management': 1.3,
      'security': 1.1
    };
    
    const base = baseSavings[userProfile.company_size] || baseSavings['medium'];
    const multiplier = categoryMultipliers[tool.category.toLowerCase() as keyof typeof categoryMultipliers] || 1.0;
    
    return Math.round(base * multiplier * (tool.rating / 5));
  }

  private assessMigrationComplexity(
    tools: (SoftwareToolModel & { id: number })[],
    userProfile: UserProfile
  ) {
    const complexity: Record<string, any> = {};
    
    tools.forEach(tool => {
      const featureComplexity = tool.features.length > 8 ? 'high' : 
                              tool.features.length > 5 ? 'medium' : 'low';
      
      const userExperienceImpact = userProfile.experience_level === 'beginner' ? 'high' : 
                                  userProfile.experience_level === 'intermediate' ? 'medium' : 'low';
      
      // Combine factors
      let overallComplexity: 'low' | 'medium' | 'high' = 'low';
      if (featureComplexity === 'high' || userExperienceImpact === 'high') {
        overallComplexity = 'high';
      } else if (featureComplexity === 'medium' || userExperienceImpact === 'medium') {
        overallComplexity = 'medium';
      }
      
      complexity[tool.id.toString()] = {
        from_current_tools: overallComplexity,
        setup_time: overallComplexity === 'high' ? '2-4 weeks' : 
                   overallComplexity === 'medium' ? '1-2 weeks' : '1-3 days',
        training_required: overallComplexity !== 'low',
        data_migration: tool.category.toLowerCase().includes('data') || 
                       tool.features.some(f => f.toLowerCase().includes('import'))
      };
    });
    
    return complexity;
  }

  private calculateFeatureScore(tool: SoftwareToolModel & { id: number }, featureComparison: FeatureComparison[]): number {
    const toolFeatures = featureComparison.filter(fc => 
      fc.tools.find(t => t.toolId === tool.id.toString())?.available
    );
    
    const weightedScore = toolFeatures.reduce((sum, feature) => 
      sum + feature.importance_score, 0
    );
    
    return Math.min(weightedScore / featureComparison.length, 1.0);
  }

  private calculatePricingScore(tool: SoftwareToolModel & { id: number }, pricingComparison: PricingComparison[]): number {
    const toolPricing = pricingComparison.find(pc => pc.tool_id === tool.id.toString());
    return toolPricing ? toolPricing.value_score / 100 : 0.5;
  }

  private calculateProfileScore(tool: SoftwareToolModel & { id: number }, userProfile: UserProfile): number {
    let score = 0;
    
    // Company size fit
    if (userProfile.company_size === 'startup' && tool.pricing.type === 'free') score += 0.3;
    if (userProfile.company_size === 'enterprise' && tool.features.length >= 8) score += 0.3;
    
    // Experience level fit
    if (userProfile.experience_level === 'beginner' && tool.features.length <= 5) score += 0.2;
    if (userProfile.experience_level === 'expert' && tool.features.length >= 7) score += 0.2;
    
    // Rating bonus
    score += (tool.rating / 5) * 0.3;
    
    // Use case alignment
    const useCaseMatch = userProfile.primary_use_cases.some(useCase =>
      tool.description.toLowerCase().includes(useCase.toLowerCase()) ||
      tool.category.toLowerCase().includes(useCase.toLowerCase())
    );
    if (useCaseMatch) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private generateRecommendationReasoning(overallWinner: any, bestValue: any, userProfile: UserProfile): string {
    const reasons = [];
    
    reasons.push(`${overallWinner.tool.name} ranks highest overall with strong feature coverage and user ratings`);
    
    if (overallWinner.tool.name !== bestValue.tool.name) {
      reasons.push(`${bestValue.tool.name} offers the best value for money`);
    }
    
    if (userProfile.company_size === 'startup') {
      reasons.push('Consider free tiers and easy setup for startup environments');
    } else if (userProfile.company_size === 'enterprise') {
      reasons.push('Focus on security, compliance, and scalability features');
    }
    
    return reasons.join('. ') + '.';
  }
}

export const advancedComparisonEngine = new AdvancedComparisonEngine();