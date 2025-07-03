import {
  UserProfile,
  OptimizationSuggestion,
  GapAnalysis,
  BudgetOptimization,
  ComplexityLevel
} from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

export interface ToolUsageMetrics {
  tool_id: string;
  tool_name: string;
  usage_frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  user_satisfaction: number; // 1-5 scale
  feature_utilization: number; // 0-1 percentage of features used
  integration_health: number; // 0-1 how well it integrates with other tools
  cost_per_user: number;
  time_spent_daily: number; // hours
  last_used: string;
  business_impact: 'critical' | 'important' | 'nice_to_have' | 'unused';
}

export interface StackHealthMetrics {
  overall_efficiency: number;
  integration_score: number;
  cost_efficiency: number;
  security_posture: number;
  user_satisfaction: number;
  redundancy_level: number;
  coverage_completeness: number;
  maintenance_burden: number;
}

export interface IntegrationMapping {
  tool_a: string;
  tool_b: string;
  integration_type: 'native' | 'api' | 'webhook' | 'manual' | 'none';
  data_flow: 'bidirectional' | 'unidirectional' | 'none';
  setup_complexity: ComplexityLevel;
  reliability_score: number;
  maintenance_effort: 'low' | 'medium' | 'high';
}

export interface StackOptimizationResult {
  current_stack_analysis: {
    health_metrics: StackHealthMetrics;
    tool_utilization: ToolUsageMetrics[];
    integration_map: IntegrationMapping[];
    cost_breakdown: {
      total_monthly_cost: number;
      cost_per_user: number;
      underutilized_spend: number;
      potential_savings: number;
    };
  };
  gap_analysis: {
    missing_capabilities: string[];
    workflow_bottlenecks: string[];
    security_gaps: string[];
    integration_gaps: string[];
    automation_opportunities: string[];
  };
  optimization_recommendations: OptimizationSuggestion[];
  consolidation_opportunities: {
    tool_clusters: {
      category: string;
      current_tools: string[];
      suggested_replacement: string;
      potential_savings: number;
      migration_complexity: ComplexityLevel;
    }[];
    redundant_tools: {
      primary_tool: string;
      redundant_tools: string[];
      overlap_percentage: number;
      recommended_action: 'consolidate' | 'specialize' | 'remove';
    }[];
  };
  budget_optimization: BudgetOptimization;
  implementation_roadmap: {
    phase: number;
    title: string;
    duration: string;
    actions: string[];
    expected_savings: number;
    risk_level: 'low' | 'medium' | 'high';
    prerequisites: string[];
  }[];
}

export class StackOptimizer {
  private readonly _categoryMappings: Record<string, string[]> = {
    'communication': ['slack', 'teams', 'discord', 'zoom', 'meet'],
    'project-management': ['jira', 'asana', 'trello', 'notion', 'monday'],
    'design': ['figma', 'sketch', 'adobe', 'canva', 'invision'],
    'development': ['github', 'gitlab', 'vscode', 'docker', 'jenkins'],
    'productivity': ['notion', 'airtable', 'google-workspace', 'office365'],
    'analytics': ['google-analytics', 'mixpanel', 'amplitude', 'tableau']
  };

  private readonly integrationMatrix: Record<string, Record<string, IntegrationMapping>> = {
    'slack': {
      'jira': {
        tool_a: 'slack',
        tool_b: 'jira',
        integration_type: 'native',
        data_flow: 'bidirectional',
        setup_complexity: 'simple',
        reliability_score: 0.95,
        maintenance_effort: 'low'
      },
      'github': {
        tool_a: 'slack',
        tool_b: 'github',
        integration_type: 'native',
        data_flow: 'unidirectional',
        setup_complexity: 'simple',
        reliability_score: 0.9,
        maintenance_effort: 'low'
      },
      'notion': {
        tool_a: 'slack',
        tool_b: 'notion',
        integration_type: 'api',
        data_flow: 'bidirectional',
        setup_complexity: 'moderate',
        reliability_score: 0.8,
        maintenance_effort: 'medium'
      }
    }
    // More integrations would be added here
  };

  /**
   * Analyze current tool stack and provide optimization recommendations
   */
  async analyzeAndOptimizeStack(
    currentTools: (SoftwareToolModel & { id: number })[],
    userProfile: UserProfile,
    usageMetrics?: ToolUsageMetrics[]
  ): Promise<StackOptimizationResult> {
    
    // Generate usage metrics if not provided
    const metrics = usageMetrics || this.generateMockUsageMetrics(currentTools);
    
    // Analyze current stack health
    const healthMetrics = this.calculateStackHealth(currentTools, metrics);
    
    // Map integrations between tools
    const integrationMap = this.mapIntegrations(currentTools);
    
    // Calculate cost breakdown
    const costBreakdown = this.calculateCostBreakdown(currentTools, metrics);
    
    // Perform gap analysis
    const gapAnalysis = this.performGapAnalysis(currentTools, userProfile, metrics);
    
    // Generate optimization recommendations
    const optimizationRecommendations = this.generateOptimizationRecommendations(
      currentTools, 
      userProfile, 
      metrics, 
      healthMetrics
    );
    
    // Find consolidation opportunities
    const consolidationOpportunities = this.findConsolidationOpportunities(currentTools, metrics);
    
    // Generate budget optimization
    const budgetOptimization = this.generateBudgetOptimization(currentTools, metrics, userProfile);
    
    // Create implementation roadmap
    const implementationRoadmap = this.createImplementationRoadmap(
      optimizationRecommendations,
      consolidationOpportunities
    );

    return {
      current_stack_analysis: {
        health_metrics: healthMetrics,
        tool_utilization: metrics,
        integration_map: integrationMap,
        cost_breakdown: costBreakdown
      },
      gap_analysis: gapAnalysis,
      optimization_recommendations: optimizationRecommendations,
      consolidation_opportunities: consolidationOpportunities,
      budget_optimization: budgetOptimization,
      implementation_roadmap: implementationRoadmap
    };
  }

  private calculateStackHealth(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ): StackHealthMetrics {
    
    // Calculate overall efficiency based on tool utilization
    const avgUtilization = metrics.reduce((sum, m) => sum + m.feature_utilization, 0) / metrics.length;
    const overall_efficiency = avgUtilization * 100;

    // Calculate integration score
    const integrationMap = this.mapIntegrations(tools);
    const possibleIntegrations = (tools.length * (tools.length - 1)) / 2;
    const actualIntegrations = integrationMap.filter(i => i.integration_type !== 'none').length;
    const integration_score = possibleIntegrations > 0 ? (actualIntegrations / possibleIntegrations) * 100 : 0;

    // Calculate cost efficiency
    const totalCost = metrics.reduce((sum, m) => sum + m.cost_per_user, 0);
    const avgSatisfaction = metrics.reduce((sum, m) => sum + m.user_satisfaction, 0) / metrics.length;
    const cost_efficiency = totalCost > 0 ? (avgSatisfaction / totalCost) * 20 : 0;

    // Calculate security posture (simplified)
    const securityTools = tools.filter(tool => 
      tool.category.toLowerCase().includes('security') ||
      tool.tags.some(tag => tag.toLowerCase().includes('security'))
    );
    const security_posture = Math.min((securityTools.length / Math.max(tools.length, 1)) * 100 + 50, 100);

    // Calculate user satisfaction
    const user_satisfaction = (avgSatisfaction / 5) * 100;

    // Calculate redundancy level
    const categoryGroups = this.groupToolsByCategory(tools);
    const redundantCategories = Object.values(categoryGroups).filter(group => group.length > 1).length;
    const redundancy_level = (redundantCategories / Object.keys(categoryGroups).length) * 100;

    // Calculate coverage completeness
    const expectedCategories = ['communication', 'project-management', 'productivity', 'security'];
    const coveredCategories = expectedCategories.filter(category => 
      tools.some(tool => tool.category.toLowerCase().includes(category.replace('-', ' ')))
    );
    const coverage_completeness = (coveredCategories.length / expectedCategories.length) * 100;

    // Calculate maintenance burden
    const highMaintenanceTools = metrics.filter(m => 
      m.feature_utilization < 0.3 || m.user_satisfaction < 3
    ).length;
    const maintenance_burden = (highMaintenanceTools / tools.length) * 100;

    return {
      overall_efficiency,
      integration_score,
      cost_efficiency,
      security_posture,
      user_satisfaction,
      redundancy_level,
      coverage_completeness,
      maintenance_burden
    };
  }

  private mapIntegrations(tools: (SoftwareToolModel & { id: number })[]): IntegrationMapping[] {
    const integrations: IntegrationMapping[] = [];
    
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        const toolA = tools[i].name.toLowerCase();
        const toolB = tools[j].name.toLowerCase();
        
        // Check if we have predefined integration data
        const integration = this.integrationMatrix[toolA]?.[toolB] || 
                          this.integrationMatrix[toolB]?.[toolA] ||
                          this.inferIntegration(tools[i], tools[j]);
        
        integrations.push(integration);
      }
    }
    
    return integrations;
  }

  private inferIntegration(
    toolA: SoftwareToolModel & { id: number },
    toolB: SoftwareToolModel & { id: number }
  ): IntegrationMapping {
    // Simple heuristic for inferring integration capability
    const hasApiA = toolA.features.some(f => f.toLowerCase().includes('api'));
    const hasApiB = toolB.features.some(f => f.toLowerCase().includes('api'));
    
    let integration_type: IntegrationMapping['integration_type'] = 'none';
    let reliability_score = 0.3;
    
    if (hasApiA && hasApiB) {
      integration_type = 'api';
      reliability_score = 0.7;
    } else if (hasApiA || hasApiB) {
      integration_type = 'webhook';
      reliability_score = 0.5;
    }
    
    return {
      tool_a: toolA.name.toLowerCase(),
      tool_b: toolB.name.toLowerCase(),
      integration_type,
      data_flow: 'unidirectional',
      setup_complexity: 'moderate',
      reliability_score,
      maintenance_effort: 'medium'
    };
  }

  private calculateCostBreakdown(
    _tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ) {
    const total_monthly_cost = metrics.reduce((sum, m) => sum + m.cost_per_user, 0);
    const cost_per_user = total_monthly_cost;
    
    // Calculate underutilized spend (tools with low usage)
    const underutilizedTools = metrics.filter(m => 
      m.usage_frequency === 'rarely' || m.feature_utilization < 0.3
    );
    const underutilized_spend = underutilizedTools.reduce((sum, m) => sum + m.cost_per_user, 0);
    
    // Estimate potential savings from optimization
    const potential_savings = underutilized_spend * 0.7; // Assume 70% savings possible
    
    return {
      total_monthly_cost,
      cost_per_user,
      underutilized_spend,
      potential_savings
    };
  }

  private performGapAnalysis(
    tools: (SoftwareToolModel & { id: number })[],
    userProfile: UserProfile,
    metrics: ToolUsageMetrics[]
  ): GapAnalysis {
    
    const toolCategories = tools.map(t => t.category.toLowerCase());
    
    // Identify missing capabilities based on user profile
    const requiredCapabilities = this.getRequiredCapabilities(userProfile);
    const missing_capabilities = requiredCapabilities.filter(cap => 
      !toolCategories.some(cat => cat.includes(cap.toLowerCase()))
    );
    
    // Identify workflow bottlenecks
    const workflow_bottlenecks = this.identifyWorkflowBottlenecks(tools, metrics);
    
    // Identify security gaps
    const security_gaps = this.identifySecurityGaps(tools, userProfile);
    
    // Identify integration gaps
    const integration_gaps = this.identifyIntegrationGaps(tools, metrics);
    
    // Identify automation opportunities
    const automation_opportunities = this.identifyAutomationOpportunities(tools, metrics);

    return {
      missing_capabilities,
      workflow_bottlenecks,
      security_gaps,
      integration_gaps,
      automation_opportunities
    };
  }

  private generateOptimizationRecommendations(
    tools: (SoftwareToolModel & { id: number })[],
    _userProfile: UserProfile,
    metrics: ToolUsageMetrics[],
    healthMetrics: StackHealthMetrics
  ): OptimizationSuggestion[] {
    const recommendations: OptimizationSuggestion[] = [];
    
    // Cost optimization recommendations
    if (healthMetrics.cost_efficiency < 50) {
      const underutilizedTools = metrics.filter(m => m.feature_utilization < 0.3);
      if (underutilizedTools.length > 0) {
        recommendations.push({
          type: 'cost_reduction',
          priority: 'high',
          title: 'Remove Underutilized Tools',
          description: `${underutilizedTools.length} tools are barely used. Consider removing them to reduce costs.`,
          impact: `Save $${underutilizedTools.reduce((sum, t) => sum + t.cost_per_user, 0)}/month`,
          effort: 'simple',
          tools_involved: underutilizedTools.map(t => t.tool_name)
        });
      }
    }
    
    // Integration optimization
    if (healthMetrics.integration_score < 60) {
      recommendations.push({
        type: 'integration_improvement',
        priority: 'medium',
        title: 'Improve Tool Integrations',
        description: 'Many tools are working in silos. Better integrations would improve workflow efficiency.',
        impact: 'Reduce manual work by 20-30%',
        effort: 'moderate',
        tools_involved: tools.slice(0, 3).map(t => t.name)
      });
    }
    
    // Security recommendations
    if (healthMetrics.security_posture < 70) {
      recommendations.push({
        type: 'security_enhancement',
        priority: 'high',
        title: 'Strengthen Security Posture',
        description: 'Your current stack lacks sufficient security tools and practices.',
        impact: 'Reduce security risks by 60%',
        effort: 'moderate',
        tools_involved: ['Security Scanner', 'SSO Solution']
      });
    }
    
    // Productivity recommendations
    if (healthMetrics.overall_efficiency < 70) {
      recommendations.push({
        type: 'productivity_boost',
        priority: 'medium',
        title: 'Optimize Tool Usage',
        description: 'Team is not fully utilizing available features. Training could improve productivity.',
        impact: 'Increase productivity by 25%',
        effort: 'simple',
        tools_involved: tools.filter(t => t.features.length > 5).map(t => t.name)
      });
    }
    
    return recommendations;
  }

  private findConsolidationOpportunities(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ) {
    // Group tools by category to find clusters
    const categoryGroups = this.groupToolsByCategory(tools);
    
    const tool_clusters = Object.entries(categoryGroups)
      .filter(([_, tools]) => tools.length > 1)
      .map(([category, categoryTools]) => {
        const totalCost = categoryTools.reduce((sum, tool) => {
          const metric = metrics.find(m => m.tool_id === tool.id.toString());
          return sum + (metric?.cost_per_user || 0);
        }, 0);
        
        return {
          category,
          current_tools: categoryTools.map(t => t.name),
          suggested_replacement: this.suggestReplacementTool(category),
          potential_savings: totalCost * 0.4, // Assume 40% savings
          migration_complexity: 'moderate' as ComplexityLevel
        };
      });
    
    // Find redundant tools with high overlap
    const redundant_tools = this.findRedundantTools(tools, metrics);
    
    return {
      tool_clusters,
      redundant_tools
    };
  }

  private generateBudgetOptimization(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[],
    userProfile: UserProfile
  ): BudgetOptimization {
    const current_spend = metrics.reduce((sum, m) => sum + m.cost_per_user, 0);
    
    // Calculate optimized spend
    const essentialTools = metrics.filter(m => 
      m.business_impact === 'critical' || m.usage_frequency === 'daily'
    );
    const optimized_spend = essentialTools.reduce((sum, m) => sum + m.cost_per_user, 0);
    
    const potential_savings = current_spend - optimized_spend;
    
    const recommendations = [
      {
        type: 'cancel' as const,
        tools: metrics.filter(m => m.business_impact === 'unused').map(m => m.tool_name),
        savings: metrics.filter(m => m.business_impact === 'unused').reduce((sum, m) => sum + m.cost_per_user, 0),
        rationale: 'These tools are not being used and can be safely cancelled'
      },
      {
        type: 'downgrade' as const,
        tools: metrics.filter(m => m.feature_utilization < 0.3).map(m => m.tool_name),
        savings: metrics.filter(m => m.feature_utilization < 0.3).reduce((sum, m) => sum + m.cost_per_user * 0.3, 0),
        rationale: 'Switch to lower tiers for underutilized tools'
      }
    ];
    
    return {
      current_spend,
      optimized_spend,
      potential_savings,
      recommendations
    };
  }

  private createImplementationRoadmap(
    optimizations: OptimizationSuggestion[],
    consolidations: any
  ) {
    const roadmap = [];
    
    // Phase 1: Quick wins (cost reduction)
    const quickWins = optimizations.filter(o => o.effort === 'simple' && o.priority === 'high');
    if (quickWins.length > 0) {
      roadmap.push({
        phase: 1,
        title: 'Quick Cost Optimization',
        duration: '1-2 weeks',
        actions: quickWins.map(w => w.title),
        expected_savings: 500, // Estimate
        risk_level: 'low' as const,
        prerequisites: ['Management approval', 'User notification']
      });
    }
    
    // Phase 2: Integration improvements
    const integrationWork = optimizations.filter(o => o.type === 'integration_improvement');
    if (integrationWork.length > 0) {
      roadmap.push({
        phase: 2,
        title: 'Integration Enhancement',
        duration: '3-4 weeks',
        actions: integrationWork.map(w => w.title),
        expected_savings: 0, // Productivity gain, not direct savings
        risk_level: 'medium' as const,
        prerequisites: ['Phase 1 completion', 'Technical assessment']
      });
    }
    
    // Phase 3: Tool consolidation
    if (consolidations.tool_clusters.length > 0) {
      roadmap.push({
        phase: 3,
        title: 'Tool Consolidation',
        duration: '6-8 weeks',
        actions: consolidations.tool_clusters.map((c: any) => `Consolidate ${c.category} tools`),
        expected_savings: consolidations.tool_clusters.reduce((sum: number, c: any) => sum + c.potential_savings, 0),
        risk_level: 'high' as const,
        prerequisites: ['User training', 'Data migration plan', 'Rollback strategy']
      });
    }
    
    return roadmap;
  }

  // Helper methods
  private generateMockUsageMetrics(tools: (SoftwareToolModel & { id: number })[]): ToolUsageMetrics[] {
    return tools.map(tool => ({
      tool_id: tool.id.toString(),
      tool_name: tool.name,
      usage_frequency: ['daily', 'weekly', 'monthly', 'rarely'][Math.floor(Math.random() * 4)] as any,
      user_satisfaction: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3-5 range
      feature_utilization: Math.round(Math.random() * 70 + 30) / 100, // 0.3-1.0 range
      integration_health: Math.round(Math.random() * 60 + 40) / 100, // 0.4-1.0 range
      cost_per_user: tool.pricing.startingPrice || Math.floor(Math.random() * 50) + 10,
      time_spent_daily: Math.round(Math.random() * 3 + 1), // 1-4 hours
      last_used: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      business_impact: ['critical', 'important', 'nice_to_have', 'unused'][Math.floor(Math.random() * 4)] as any
    }));
  }

  private groupToolsByCategory(tools: (SoftwareToolModel & { id: number })[]): Record<string, (SoftwareToolModel & { id: number })[]> {
    return tools.reduce((groups, tool) => {
      const category = tool.category.toLowerCase().replace(/\s+/g, '-');
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tool);
      return groups;
    }, {} as Record<string, (SoftwareToolModel & { id: number })[]>);
  }

  private getRequiredCapabilities(userProfile: UserProfile): string[] {
    const industryRequirements: Record<string, string[]> = {
      'technology': ['Development', 'Project Management', 'Communication', 'Security'],
      'marketing': ['Analytics', 'Design', 'Communication', 'CRM'],
      'finance': ['Analytics', 'Security', 'Compliance', 'Communication'],
      'healthcare': ['Security', 'Compliance', 'Communication', 'Documentation']
    };
    
    return industryRequirements[userProfile.industry] || ['Communication', 'Productivity', 'Security'];
  }

  private identifyWorkflowBottlenecks(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ): string[] {
    const bottlenecks = [];
    
    // Look for manual data transfer needs
    const poorIntegrations = metrics.filter(m => m.integration_health < 0.5);
    if (poorIntegrations.length > 0) {
      bottlenecks.push('Manual data transfer between poorly integrated tools');
    }
    
    // Look for tools with high time investment but low satisfaction
    const frustratingTools = metrics.filter(m => m.time_spent_daily > 2 && m.user_satisfaction < 3);
    if (frustratingTools.length > 0) {
      bottlenecks.push('Time-consuming tools with poor user experience');
    }
    
    return bottlenecks;
  }

  private identifySecurityGaps(
    tools: (SoftwareToolModel & { id: number })[],
    userProfile: UserProfile
  ): string[] {
    const gaps = [];
    
    const securityTools = tools.filter(tool => 
      tool.category.toLowerCase().includes('security') ||
      tool.tags.some(tag => tag.toLowerCase().includes('security'))
    );
    
    if (securityTools.length === 0) {
      gaps.push('No dedicated security tools in stack');
    }
    
    if (userProfile.company_size === 'large' || userProfile.company_size === 'enterprise') {
      const hasSSO = tools.some(tool => 
        tool.features.some(f => f.toLowerCase().includes('sso'))
      );
      if (!hasSSO) {
        gaps.push('Missing Single Sign-On (SSO) capability');
      }
    }
    
    return gaps;
  }

  private identifyIntegrationGaps(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ): string[] {
    const gaps = [];
    
    const criticalTools = metrics.filter(m => m.business_impact === 'critical');
    const poorlyIntegratedCritical = criticalTools.filter(m => m.integration_health < 0.6);
    
    if (poorlyIntegratedCritical.length > 0) {
      gaps.push(`Critical tools (${poorlyIntegratedCritical.map(t => t.tool_name).join(', ')}) lack proper integrations`);
    }
    
    return gaps;
  }

  private identifyAutomationOpportunities(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ): string[] {
    const opportunities = [];
    
    // Look for repetitive tasks indicated by high daily usage
    const highUsageTools = metrics.filter(m => m.time_spent_daily > 2);
    if (highUsageTools.length > 0) {
      opportunities.push('Automate repetitive tasks in frequently used tools');
    }
    
    // Look for workflow automation tools
    const hasAutomation = tools.some(tool => 
      tool.features.some(f => f.toLowerCase().includes('automation')) ||
      tool.tags.some(t => t.toLowerCase().includes('automation'))
    );
    
    if (!hasAutomation && tools.length > 3) {
      opportunities.push('Add workflow automation tool to connect existing tools');
    }
    
    return opportunities;
  }

  private suggestReplacementTool(category: string): string {
    const suggestions: Record<string, string> = {
      'communication': 'Microsoft Teams',
      'project-management': 'Linear',
      'design': 'Figma',
      'development': 'GitHub',
      'productivity': 'Notion'
    };
    
    return suggestions[category] || 'Unified Platform Solution';
  }

  private findRedundantTools(
    tools: (SoftwareToolModel & { id: number })[],
    metrics: ToolUsageMetrics[]
  ) {
    const redundancies = [];
    
    // Simple overlap detection based on categories
    const categoryGroups = this.groupToolsByCategory(tools);
    
    for (const [category, categoryTools] of Object.entries(categoryGroups)) {
      if (categoryTools.length > 1) {
        const primaryTool = categoryTools.reduce((best, current) => {
          const bestMetric = metrics.find(m => m.tool_id === best.id.toString());
          const currentMetric = metrics.find(m => m.tool_id === current.id.toString());
          
          const bestScore = (bestMetric?.user_satisfaction || 0) + (bestMetric?.feature_utilization || 0);
          const currentScore = (currentMetric?.user_satisfaction || 0) + (currentMetric?.feature_utilization || 0);
          
          return currentScore > bestScore ? current : best;
        });
        
        const redundantTools = categoryTools.filter(t => t.id !== primaryTool.id);
        
        if (redundantTools.length > 0) {
          redundancies.push({
            primary_tool: primaryTool.name,
            redundant_tools: redundantTools.map(t => t.name),
            overlap_percentage: 80, // Simplified
            recommended_action: 'consolidate' as const
          });
        }
      }
    }
    
    return redundancies;
  }
}

export const stackOptimizer = new StackOptimizer();