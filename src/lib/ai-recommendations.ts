import {
  RecommendationRequest,
  RecommendationResult,
  RecommendedTool,
  OptimizationSuggestion,
  StackAnalysis,
  GapAnalysis,
  BudgetOptimization,
  AIEnhancedTool,
  UserProfile,
  ComplexityLevel,
  BudgetRange
} from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { personalizedRecommendationEngine, UserBehavior, RecommendationInput } from './recommendation-engine';

export class AIRecommendationEngine {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
  }

  /**
   * Enhanced personalized recommendations using ML-like engine
   */
  async getEnhancedRecommendations(
    userProfile: UserProfile,
    userBehavior: UserBehavior,
    currentTools: string[],
    availableTools: (SoftwareToolModel & { id: number })[]
  ): Promise<RecommendedTool[]> {
    const input: RecommendationInput = {
      user_profile: userProfile,
      user_behavior: userBehavior,
      current_tools: currentTools,
      context: {
        intent: 'discover_new',
        current_tools: currentTools,
        pain_points: await this.inferPainPoints(userProfile, currentTools),
        goals: await this.inferGoals(userProfile),
        timeline: '30_days',
        budget: this.inferBudgetFromProfile(userProfile)
      },
      available_tools: availableTools
    };

    return personalizedRecommendationEngine.generatePersonalizedRecommendations(input);
  }

  /**
   * Generate personalized tool recommendations
   */
  async generateRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    try {
      // Analyze user's current stack
      const stackAnalysis = await this.analyzeCurrentStack(
        request.context.current_tools, 
        request.user_id
      );

      // Identify gaps and opportunities
      const gapAnalysis = await this.performGapAnalysis(request.context, stackAnalysis);

      // Generate tool recommendations
      const recommendations = await this.findRecommendedTools(request, gapAnalysis);

      // Analyze budget optimization opportunities
      const budgetOptimization = await this.analyzeBudgetOptimization(
        request.context.current_tools,
        request.context.budget
      );

      // Generate optimization suggestions
      const optimizations = await this.generateOptimizationSuggestions(
        stackAnalysis,
        gapAnalysis,
        budgetOptimization
      );

      return {
        tools: recommendations,
        insights: {
          stack_analysis: stackAnalysis,
          gap_analysis: gapAnalysis,
          trend_insights: await this.generateTrendInsights(request.context),
          budget_optimization: budgetOptimization
        },
        optimization_suggestions: optimizations
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Get personalized recommendations for homepage
   */
  async getPersonalizedHomepageRecommendations(
    userProfile: UserProfile,
    currentTools: string[],
    limit: number = 5
  ): Promise<RecommendedTool[]> {
    const request: RecommendationRequest = {
      user_id: 'current-user', // In real app, get from auth context
      context: {
        intent: 'discover_new',
        current_tools: currentTools,
        pain_points: await this.inferPainPoints(userProfile, currentTools),
        goals: await this.inferGoals(userProfile),
        timeline: '30_days',
        budget: this.inferBudgetFromProfile(userProfile)
      },
      limit,
      exclude_tools: currentTools
    };

    const result = await this.generateRecommendations(request);
    return result.tools;
  }

  /**
   * Generate recommendations based on browsing behavior
   */
  async getBehavioralRecommendations(
    _userId: string,
    viewedTools: string[],
    savedTools: string[],
    searchHistory: string[]
  ): Promise<RecommendedTool[]> {
    const prompt = `
    Based on user behavior, recommend similar or complementary tools:
    
    Viewed Tools: ${viewedTools.join(', ')}
    Saved Tools: ${savedTools.join(', ')}
    Recent Searches: ${searchHistory.join(', ')}
    
    Generate recommendations for tools that:
    1. Are similar to viewed/saved tools
    2. Complement the current tool stack
    3. Solve related problems
    4. Are trending in similar categories
    
    Return JSON array of tool recommendations with reasoning:
    [
      {
        "tool_name": "Tool Name",
        "category": "Category",
        "reasoning": "Why this tool is recommended",
        "similarity_score": 0.8,
        "complementary_score": 0.6
      }
    ]
    `;

    try {
      const response = await this.callAI(prompt);
      const aiRecommendations = JSON.parse(response);
      
      // Convert AI recommendations to RecommendedTool format
      return this.convertAIRecommendationsToRecommendedTools(aiRecommendations);
    } catch (error) {
      console.error('Error generating behavioral recommendations:', error);
      return [];
    }
  }

  /**
   * Recommend tools for specific use cases
   */
  async getUseCaseRecommendations(
    useCase: string,
    userProfile: UserProfile,
    existingTools: string[]
  ): Promise<RecommendedTool[]> {
    const prompt = `
    Recommend software tools for this specific use case:
    
    Use Case: "${useCase}"
    
    User Context:
    - Industry: ${userProfile.industry}
    - Company Size: ${userProfile.company_size}
    - Department: ${userProfile.department}
    - Experience Level: ${userProfile.experience_level}
    - Existing Tools: ${existingTools.join(', ')}
    
    Consider:
    1. Tools that directly address the use case
    2. Integration with existing tools
    3. Appropriate complexity for user's experience level
    4. Budget considerations for company size
    5. Industry-specific requirements
    
    Return top 5 recommendations in JSON format:
    [
      {
        "tool_name": "Tool Name",
        "category": "Category",
        "use_case_fit": "How it fits the use case",
        "integration_opportunities": ["tool1", "tool2"],
        "implementation_complexity": "simple|moderate|complex",
        "estimated_setup_time": "X hours/days",
        "key_benefits": ["benefit1", "benefit2"]
      }
    ]
    `;

    try {
      const response = await this.callAI(prompt);
      const recommendations = JSON.parse(response);
      return this.convertUseCaseRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating use case recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze current tool stack for optimization opportunities
   */
  private async analyzeCurrentStack(
    currentTools: string[],
    _userId: string
  ): Promise<StackAnalysis> {
    if (currentTools.length === 0) {
      return {
        current_tools: [],
        redundancies: [],
        coverage_gaps: ['No tools in current stack'],
        integration_opportunities: []
      };
    }

    const prompt = `
    Analyze this software tool stack for a user:
    
    Current Tools: ${currentTools.join(', ')}
    
    Provide analysis on:
    1. Tool overlaps and redundancies
    2. Missing capabilities or gaps
    3. Integration opportunities between tools
    4. Usage optimization suggestions
    
    Return JSON:
    {
      "current_tools": [
        {
          "tool_name": "Tool Name",
          "category": "Category",
          "usage_score": 0.8,
          "value_score": 0.9,
          "potential_issues": ["issue1"],
          "optimization_tips": ["tip1"]
        }
      ],
      "redundancies": [
        {
          "tools": ["tool1", "tool2"],
          "overlap_description": "Both handle X functionality",
          "consolidation_suggestion": "Use tool1 for Y, tool2 for Z"
        }
      ],
      "coverage_gaps": ["gap1", "gap2"],
      "integration_opportunities": ["opportunity1", "opportunity2"]
    }
    `;

    try {
      const response = await this.callAI(prompt);
      const analysis = JSON.parse(response);
      
      return {
        current_tools: analysis.current_tools.map((tool: any) => ({
          tool_id: tool.tool_name.toLowerCase().replace(/\s+/g, '-'),
          usage_score: tool.usage_score,
          value_score: tool.value_score,
          replacement_suggestions: tool.potential_issues || []
        })),
        redundancies: analysis.redundancies.map((r: any) => ({
          tools: r.tools,
          overlap_percentage: 70, // Estimated
          consolidation_suggestion: r.consolidation_suggestion,
          potential_savings: 100 // Estimated
        })),
        coverage_gaps: analysis.coverage_gaps,
        integration_opportunities: analysis.integration_opportunities
      };
    } catch (error) {
      console.error('Error analyzing current stack:', error);
      return {
        current_tools: [],
        redundancies: [],
        coverage_gaps: ['Analysis failed'],
        integration_opportunities: []
      };
    }
  }

  /**
   * Perform gap analysis to identify missing capabilities
   */
  private async performGapAnalysis(
    context: any,
    stackAnalysis: StackAnalysis
  ): Promise<GapAnalysis> {
    const prompt = `
    Perform gap analysis for user's software tool stack:
    
    User Context:
    - Current Tools: ${context.current_tools.join(', ')}
    - Pain Points: ${context.pain_points.join(', ')}
    - Goals: ${context.goals.join(', ')}
    - Timeline: ${context.timeline}
    
    Stack Analysis:
    - Coverage Gaps: ${stackAnalysis.coverage_gaps.join(', ')}
    - Integration Opportunities: ${stackAnalysis.integration_opportunities.join(', ')}
    
    Identify:
    1. Missing capabilities that prevent achieving goals
    2. Workflow bottlenecks that could be automated
    3. Integration gaps causing manual work
    4. Security or compliance gaps
    
    Return JSON:
    {
      "missing_capabilities": ["capability1", "capability2"],
      "workflow_bottlenecks": ["bottleneck1", "bottleneck2"],
      "integration_gaps": ["gap1", "gap2"],
      "security_gaps": ["security_gap1", "security_gap2"],
      "automation_opportunities": ["automation1", "automation2"]
    }
    `;

    try {
      const response = await this.callAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error performing gap analysis:', error);
      return {
        missing_capabilities: ['Analysis failed'],
        workflow_bottlenecks: [],
        integration_gaps: [],
        security_gaps: [],
        automation_opportunities: []
      };
    }
  }

  /**
   * Find recommended tools based on analysis
   */
  private async findRecommendedTools(
    request: RecommendationRequest,
    gapAnalysis: GapAnalysis
  ): Promise<RecommendedTool[]> {
    const prompt = `
    Recommend software tools based on this analysis:
    
    User Intent: ${request.context.intent}
    Current Tools: ${request.context.current_tools.join(', ')}
    Pain Points: ${request.context.pain_points.join(', ')}
    Goals: ${request.context.goals.join(', ')}
    Budget: ${request.context.budget}
    Timeline: ${request.context.timeline}
    
    Gap Analysis:
    - Missing Capabilities: ${gapAnalysis.missing_capabilities.join(', ')}
    - Workflow Bottlenecks: ${gapAnalysis.workflow_bottlenecks.join(', ')}
    - Integration Gaps: ${gapAnalysis.integration_gaps.join(', ')}
    
    Recommend ${request.limit} tools that:
    1. Address the identified gaps
    2. Integrate well with current tools
    3. Fit the budget and timeline
    4. Match the user's technical level
    
    Return JSON array:
    [
      {
        "tool_name": "Tool Name",
        "category": "Category",
        "addresses_gaps": ["gap1", "gap2"],
        "integration_compatibility": ["tool1", "tool2"],
        "implementation_effort": "simple|moderate|complex",
        "estimated_roi": {
          "time_savings": "X hours per week",
          "cost_savings": 500,
          "productivity_gain": 0.2
        },
        "rationale": "Why this tool is recommended"
      }
    ]
    `;

    try {
      const response = await this.callAI(prompt);
      const recommendations = JSON.parse(response);
      
      return recommendations.map((rec: any) => ({
        tool: this.createMockTool(rec.tool_name, rec.category),
        recommendation_score: 0.85, // Would be calculated based on multiple factors
        rationale: rec.rationale,
        use_case_fit: rec.addresses_gaps.join(', '),
        implementation_effort: rec.implementation_effort as ComplexityLevel,
        expected_roi: {
          time_savings: rec.estimated_roi.time_savings,
          cost_savings: rec.estimated_roi.cost_savings,
          productivity_gain: rec.estimated_roi.productivity_gain,
          confidence_level: 0.7
        }
      }));
    } catch (error) {
      console.error('Error finding recommended tools:', error);
      return [];
    }
  }

  /**
   * Analyze budget optimization opportunities
   */
  private async analyzeBudgetOptimization(
    _currentTools: string[],
    _budgetRange: string
  ): Promise<BudgetOptimization> {
    // Mock implementation - in real app would analyze actual spending
    return {
      current_spend: 1200,
      optimized_spend: 950,
      potential_savings: 250,
      recommendations: [
        {
          type: 'annual_switch',
          tools: ['Tool1', 'Tool2'],
          savings: 150,
          rationale: 'Switch to annual billing for 20% discount'
        },
        {
          type: 'consolidate',
          tools: ['Tool3', 'Tool4'],
          savings: 100,
          rationale: 'These tools have overlapping functionality'
        }
      ]
    };
  }

  /**
   * Generate optimization suggestions
   */
  private async generateOptimizationSuggestions(
    stackAnalysis: StackAnalysis,
    gapAnalysis: GapAnalysis,
    budgetOptimization: BudgetOptimization
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // Cost reduction suggestions
    if (budgetOptimization.potential_savings > 0) {
      suggestions.push({
        type: 'cost_reduction',
        priority: 'high',
        title: `Save $${budgetOptimization.potential_savings}/month`,
        description: 'Optimize your tool subscriptions and eliminate redundancies',
        impact: `Reduce monthly spend by ${Math.round((budgetOptimization.potential_savings / budgetOptimization.current_spend) * 100)}%`,
        effort: 'simple',
        tools_involved: budgetOptimization.recommendations.flatMap(r => r.tools)
      });
    }

    // Integration improvement suggestions
    if (stackAnalysis.integration_opportunities.length > 0) {
      suggestions.push({
        type: 'integration_improvement',
        priority: 'medium',
        title: 'Improve workflow efficiency',
        description: 'Connect your tools to eliminate manual data entry',
        impact: 'Save 5-10 hours per week on manual tasks',
        effort: 'moderate',
        tools_involved: stackAnalysis.current_tools.map(t => t.tool_id)
      });
    }

    // Security enhancement suggestions
    if (gapAnalysis.security_gaps.length > 0) {
      suggestions.push({
        type: 'security_enhancement',
        priority: 'high',
        title: 'Address security gaps',
        description: 'Implement tools to improve your security posture',
        impact: 'Reduce security risk and ensure compliance',
        effort: 'complex',
        tools_involved: []
      });
    }

    return suggestions;
  }

  /**
   * Generate trend insights
   */
  private async generateTrendInsights(context: any): Promise<string[]> {
    const prompt = `
    Generate trend insights for software tools relevant to this user context:
    
    User Context:
    - Current Tools: ${context.current_tools.join(', ')}
    - Pain Points: ${context.pain_points.join(', ')}
    - Goals: ${context.goals.join(', ')}
    
    Provide 3-5 trend insights about:
    1. Emerging tools in relevant categories
    2. Industry trends affecting tool selection
    3. New features or capabilities gaining traction
    4. Market shifts the user should be aware of
    
    Return JSON array of insights:
    ["insight1", "insight2", "insight3"]
    `;

    try {
      const response = await this.callAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating trend insights:', error);
      return [
        'AI-powered tools are gaining significant adoption',
        'Integration platforms are becoming more important',
        'Security and compliance tools are in high demand'
      ];
    }
  }

  // Helper methods

  private async callAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-small-online',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant specialized in software tool recommendations and analysis. Always return valid JSON when requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async inferPainPoints(profile: UserProfile, _currentTools: string[]): Promise<string[]> {
    const commonPainPoints: Record<string, string[]> = {
      'startup': ['Limited budget', 'Need to scale quickly', 'Manual processes'],
      'small': ['Integration challenges', 'Time management', 'Resource constraints'],
      'medium': ['Data silos', 'Process inefficiencies', 'Collaboration issues'],
      'large': ['Complex workflows', 'Security requirements', 'Compliance needs'],
      'enterprise': ['Legacy system integration', 'Governance', 'Scale challenges']
    };

    return commonPainPoints[profile.company_size] || ['Process inefficiencies'];
  }

  private async inferGoals(profile: UserProfile): Promise<string[]> {
    const commonGoals: Record<string, string[]> = {
      'technology': ['Improve development efficiency', 'Better code quality', 'Faster deployment'],
      'marketing': ['Increase lead generation', 'Better campaign ROI', 'Customer insights'],
      'sales': ['Increase conversion rates', 'Better lead tracking', 'Customer retention'],
      'finance': ['Cost reduction', 'Better reporting', 'Compliance automation'],
      'operations': ['Process automation', 'Better visibility', 'Resource optimization']
    };

    return commonGoals[profile.department] || ['Improve efficiency', 'Reduce costs'];
  }

  private inferBudgetFromProfile(profile: UserProfile): BudgetRange {
    const budgetMapping: Record<string, BudgetRange> = {
      'startup': 'under_100',
      'small': '100_500',
      'medium': '500_1000',
      'large': '1000_5000',
      'enterprise': '5000_plus'
    };

    return budgetMapping[profile.company_size] || 'under_100';
  }

  private convertAIRecommendationsToRecommendedTools(aiRecs: any[]): RecommendedTool[] {
    return aiRecs.map(rec => ({
      tool: this.createMockTool(rec.tool_name, rec.category),
      recommendation_score: rec.similarity_score || 0.7,
      rationale: rec.reasoning,
      use_case_fit: 'Good fit based on browsing behavior',
      implementation_effort: 'moderate' as ComplexityLevel,
      expected_roi: {
        time_savings: '2-5 hours per week',
        cost_savings: 0,
        productivity_gain: 0.15,
        confidence_level: 0.6
      }
    }));
  }

  private convertUseCaseRecommendations(recommendations: any[]): RecommendedTool[] {
    return recommendations.map(rec => ({
      tool: this.createMockTool(rec.tool_name, rec.category),
      recommendation_score: 0.8,
      rationale: rec.use_case_fit,
      use_case_fit: rec.use_case_fit,
      implementation_effort: rec.implementation_complexity as ComplexityLevel,
      expected_roi: {
        time_savings: rec.estimated_setup_time,
        cost_savings: 0,
        productivity_gain: 0.2,
        confidence_level: 0.7
      }
    }));
  }

  private createMockTool(name: string, category: string): AIEnhancedTool {
    // This would be replaced with actual tool data from your database
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description: `${name} - A powerful ${category} tool`,
      category: {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        description: `${category} tools`,
        icon: 'tool',
        ai_keywords: [category.toLowerCase()]
      },
      subcategory: category,
      vendor: {
        id: 'vendor-1',
        name: `${name} Inc.`,
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
        support_email: 'support@example.com',
        founded_year: 2020,
        headquarters: 'San Francisco, CA',
        employee_count: 'small',
        funding_status: 'series_a',
        trust_score: 0.8
      },
      pricing: {
        model: 'subscription',
        tiers: [],
        enterprise_pricing: false,
        cost_calculator: {
          variables: [],
          formula: '',
          discounts: []
        }
      },
      licensing: {
        type: 'per_user',
        terms: 'Standard terms',
        auto_renewal: true,
        cancellation_policy: '30 days notice',
        refund_policy: '30 days',
        data_retention: '90 days'
      },
      features: [],
      ai_capabilities: {
        has_ai: false,
        ai_features: [],
        ai_maturity_level: 'basic',
        ai_use_cases: []
      },
      integrations: [],
      apis: [],
      ratings: {
        overall: 4.5,
        ease_of_use: 4.2,
        features: 4.3,
        value_for_money: 4.1,
        customer_support: 4.0,
        total_reviews: 150,
        rating_distribution: {
          five_star: 60,
          four_star: 45,
          three_star: 30,
          two_star: 10,
          one_star: 5
        }
      },
      reviews: [],
      certifications: [],
      security_score: 0.8,
      performance_metrics: {
        uptime: 99.9,
        response_time: 200,
        error_rate: 0.1,
        last_updated: new Date().toISOString(),
        data_source: 'internal'
      },
      ai_summary: `${name} is a reliable ${category} tool suitable for teams of all sizes.`,
      ai_score: {
        overall: 0.8,
        relevance: 0.85,
        quality: 0.75,
        value: 0.8,
        fit_score: 0.82,
        confidence: 0.7,
        explanation: 'Good match based on requirements',
        factors: []
      },
      trend_data: {
        popularity_trend: [],
        search_volume: [],
        adoption_rate: 0.15,
        growth_rate: 0.25,
        market_position: 'growing'
      },
      competitive_analysis: {
        main_competitors: [],
        differentiation: [],
        market_share: 0.05,
        competitive_advantages: [],
        weaknesses: []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      verification_status: 'verified',
      popularity_score: 0.7
    };
  }
}

export const aiRecommendationEngine = new AIRecommendationEngine();