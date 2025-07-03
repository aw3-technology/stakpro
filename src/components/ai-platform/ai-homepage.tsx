import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3, 
  Clock,
  ArrowRight,
  Star,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AISearchBar } from './ai-search-bar';
import { AdvancedToolComparison } from './tool-comparison-advanced';
import { aiRecommendationEngine } from '@/lib/ai-recommendations';
import { aiSearchEngine } from '@/lib/ai-search';
import { stackOptimizer, StackOptimizationResult } from '@/lib/stack-optimizer';
import { UserBehavior } from '@/lib/recommendation-engine';
import { 
  RecommendedTool, 
  OptimizationSuggestion, 
  UserProfile,
  SearchQuery,
  AIEnhancedTool 
} from '@/types/ai-platform';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const AIHomepage: React.FC = () => {
  const { user } = useAuth();
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<RecommendedTool[]>([]);
  const [trendingTools, setTrendingTools] = useState<AIEnhancedTool[]>([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [stackOptimization, setStackOptimization] = useState<StackOptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  // Mock user profile - in real app, get from user context
  const userProfile: UserProfile = {
    industry: 'technology',
    company_size: 'medium',
    job_title: 'Product Manager',
    department: 'product',
    experience_level: 'intermediate',
    primary_use_cases: ['project management', 'team collaboration', 'user research'],
    current_tool_stack: ['slack', 'notion', 'figma', 'jira', 'github']
  };

  useEffect(() => {
    loadPersonalizedContent();
  }, [user]);

  const loadPersonalizedContent = async () => {
    setIsLoading(true);
    try {
      // Mock current tools for stack analysis
      const mockCurrentTools = generateMockCurrentTools();
      
      // Mock user behavior data
      const mockUserBehavior: UserBehavior = {
        viewed_tools: ['slack', 'notion', 'figma', 'github', 'trello'],
        saved_tools: ['notion', 'figma'],
        search_history: ['project management', 'design tool', 'team communication'],
        time_spent_per_category: {
          'communication': 25,
          'project-management': 30,
          'design': 15,
          'development': 20,
          'productivity': 10
        },
        feature_preferences: ['collaboration', 'integration', 'real-time', 'automation'],
        price_sensitivity: 0.7, // High price sensitivity
        integration_importance: 0.9 // Very important
      };

      // Load enhanced personalized recommendations
      const recommendations = await aiRecommendationEngine.getEnhancedRecommendations(
        userProfile,
        mockUserBehavior,
        userProfile.current_tool_stack,
        mockCurrentTools
      );
      setPersonalizedRecommendations(recommendations);

      // Perform comprehensive stack analysis and optimization
      const stackAnalysis = await stackOptimizer.analyzeAndOptimizeStack(
        mockCurrentTools,
        userProfile
      );
      setStackOptimization(stackAnalysis);
      setOptimizationSuggestions(stackAnalysis.optimization_recommendations);

      // Load trending tools (mock data for now)
      setTrendingTools(generateMockTrendingTools());

    } catch (error) {
      console.error('Error loading personalized content:', error);
      toast.error('Failed to load personalized recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchQuery: SearchQuery) => {
    try {
      const results = await aiSearchEngine.search(searchQuery);
      // Navigate to search results or update state
      console.log('Search results:', results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    }
  };


  const generateMockTrendingTools = (): AIEnhancedTool[] => {
    return [
      {
        id: 'trending-1',
        name: 'Linear',
        description: 'The issue tracking tool you\'ll enjoy using',
        category: { id: 'pm', name: 'Project Management', description: '', icon: '', ai_keywords: [] },
        subcategory: 'Issue Tracking',
        vendor: {} as any,
        pricing: { model: 'subscription', tiers: [], enterprise_pricing: false, cost_calculator: {} as any },
        licensing: {} as any,
        features: [],
        ai_capabilities: { has_ai: true, ai_features: [], ai_maturity_level: 'advanced', ai_use_cases: [] },
        integrations: [],
        apis: [],
        ratings: { overall: 4.7, ease_of_use: 4.8, features: 4.6, value_for_money: 4.5, customer_support: 4.4, total_reviews: 1200, rating_distribution: {} as any },
        reviews: [],
        certifications: [],
        security_score: 0.9,
        performance_metrics: {} as any,
        ai_summary: 'Modern issue tracking with AI-powered insights',
        ai_score: { overall: 0.85, relevance: 0.9, quality: 0.8, value: 0.85, fit_score: 0.88, confidence: 0.8, explanation: '', factors: [] },
        trend_data: { popularity_trend: [], search_volume: [], adoption_rate: 0.3, growth_rate: 0.45, market_position: 'growing' },
        competitive_analysis: {} as any,
        created_at: '',
        updated_at: '',
        verification_status: 'verified',
        popularity_score: 0.8
      }
    ];
  };


  const generateMockCurrentTools = () => {
    // Mock current tools for stack analysis
    return [
      { id: 1, name: 'Slack', category: 'Communication', logo: '/icons/slack.svg', pricing: { type: 'freemium' as const, startingPrice: 7.25 }, description: 'Team communication platform', features: ['Real-time messaging', 'File sharing', 'Integrations'], rating: 4.4, reviewCount: 30000, website: 'https://slack.com', tags: ['communication', 'team'], compatibility: ['Web', 'Desktop', 'Mobile'], lastUpdated: '2024-01-05' },
      { id: 2, name: 'Notion', category: 'Productivity', logo: '/icons/notion.svg', pricing: { type: 'freemium' as const, startingPrice: 8 }, description: 'All-in-one workspace', features: ['Note-taking', 'Database', 'Collaboration'], rating: 4.5, reviewCount: 15000, website: 'https://notion.so', tags: ['productivity', 'notes'], compatibility: ['Web', 'Desktop', 'Mobile'], lastUpdated: '2024-01-08' },
      { id: 3, name: 'Figma', category: 'Design Tool', logo: '/icons/figma.svg', pricing: { type: 'freemium' as const, startingPrice: 12 }, description: 'Collaborative design tool', features: ['Vector editing', 'Prototyping', 'Collaboration'], rating: 4.7, reviewCount: 18000, website: 'https://figma.com', tags: ['design', 'ui/ux'], compatibility: ['Web', 'Desktop'], lastUpdated: '2024-01-10' },
      { id: 4, name: 'GitHub', category: 'Version Control', logo: '/icons/github.svg', pricing: { type: 'freemium' as const, startingPrice: 4 }, description: 'Git repository hosting', features: ['Git hosting', 'Pull requests', 'CI/CD'], rating: 4.8, reviewCount: 45000, website: 'https://github.com', tags: ['git', 'development'], compatibility: ['Web', 'Desktop'], lastUpdated: '2024-01-14' }
    ];
  };

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case 'cost_reduction': return <BarChart3 className="h-5 w-5 text-green-600" />;
      case 'productivity_boost': return <Zap className="h-5 w-5 text-blue-600" />;
      case 'security_enhancement': return <Target className="h-5 w-5 text-red-600" />;
      default: return <Lightbulb className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with AI Search */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Discover Tools with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us what you need in plain language. Our AI will find the perfect tools for your workflow.
            </p>
          </div>
          
          <AISearchBar 
            onSearch={handleSearch}
            className="mb-8"
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50,000+</div>
              <p className="text-sm text-muted-foreground">Tools in Database</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <p className="text-sm text-muted-foreground">Match Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">1M+</div>
              <p className="text-sm text-muted-foreground">Integrations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <p className="text-sm text-muted-foreground">AI Assistant</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Stack Analysis */}
        {stackOptimization && (
          <section className="mb-12">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  AI-Powered Stack Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of your {stackOptimization.current_stack_analysis.tool_utilization.length} tools
                </p>
              </CardHeader>
              <CardContent>
                {/* Health Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Efficiency</span>
                      <span className="text-sm font-bold">
                        {Math.round(stackOptimization.current_stack_analysis.health_metrics.overall_efficiency)}%
                      </span>
                    </div>
                    <Progress value={stackOptimization.current_stack_analysis.health_metrics.overall_efficiency} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Integration</span>
                      <span className="text-sm font-bold">
                        {Math.round(stackOptimization.current_stack_analysis.health_metrics.integration_score)}%
                      </span>
                    </div>
                    <Progress value={stackOptimization.current_stack_analysis.health_metrics.integration_score} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cost Efficiency</span>
                      <span className="text-sm font-bold">
                        {Math.round(stackOptimization.current_stack_analysis.health_metrics.cost_efficiency)}%
                      </span>
                    </div>
                    <Progress value={stackOptimization.current_stack_analysis.health_metrics.cost_efficiency} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Security</span>
                      <span className="text-sm font-bold">
                        {Math.round(stackOptimization.current_stack_analysis.health_metrics.security_posture)}%
                      </span>
                    </div>
                    <Progress value={stackOptimization.current_stack_analysis.health_metrics.security_posture} className="h-2" />
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${stackOptimization.current_stack_analysis.cost_breakdown.total_monthly_cost}/mo
                    </div>
                    <p className="text-sm text-muted-foreground">Current Spend</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${Math.round(stackOptimization.current_stack_analysis.cost_breakdown.underutilized_spend)}/mo
                    </div>
                    <p className="text-sm text-muted-foreground">Underutilized</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${Math.round(stackOptimization.current_stack_analysis.cost_breakdown.potential_savings)}/mo
                    </div>
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                  </div>
                </div>
                
                {/* Key Insights */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Insights</h4>
                  {stackOptimization.gap_analysis.missing_capabilities.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span>Missing capabilities: {stackOptimization.gap_analysis.missing_capabilities.join(', ')}</span>
                    </div>
                  )}
                  {stackOptimization.consolidation_opportunities.tool_clusters.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>
                        {stackOptimization.consolidation_opportunities.tool_clusters.length} tool categories 
                        could be consolidated for better efficiency
                      </span>
                    </div>
                  )}
                  {stackOptimization.gap_analysis.automation_opportunities.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Zap className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span>{stackOptimization.gap_analysis.automation_opportunities[0]}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Optimization Suggestions */}
        {optimizationSuggestions.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Optimization Opportunities</h2>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {optimizationSuggestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {getOptimizationIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{suggestion.title}</h3>
                          <Badge className={cn('text-xs', getPriorityColor(suggestion.priority))}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            {suggestion.impact}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Implement
                            </Button>
                            {index === 0 && (
                              <Button size="sm" onClick={() => setShowComparison(true)}>
                                Compare Tools
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Personalized Recommendations */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Button variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedRecommendations.map((recommendation) => (
                <Card key={recommendation.tool.id} className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Tool Header */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          {recommendation.tool.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{recommendation.tool.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {recommendation.tool.category.name}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(recommendation.recommendation_score * 100)}% match
                          </Badge>
                        </div>
                      </div>

                      {/* AI Rationale */}
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          <strong>Why recommended:</strong> {recommendation.rationale}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{recommendation.tool.ratings.overall}</span>
                          </div>
                          <p className="text-muted-foreground">User Rating</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span>{recommendation.expected_roi.time_savings}</span>
                          </div>
                          <p className="text-muted-foreground">Time Savings</p>
                        </div>
                      </div>

                      {/* Implementation Effort */}
                      <div className="flex items-center justify-between text-sm">
                        <span>Implementation:</span>
                        <Badge 
                          variant={recommendation.implementation_effort === 'simple' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {recommendation.implementation_effort}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="flex-1">
                          Start Trial
                        </Button>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Trending Tools */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending This Week</h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Updated daily</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.slice(0, 3).map((tool) => (
              <div key={tool.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{tool.ratings?.overall || 4.5}</span>
                  <TrendingUp className="h-4 w-4 text-green-500 ml-2" />
                  <span className="text-sm">{tool.trend_data?.market_position || 'Growing'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Quick Access */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Development', icon: '⚡', count: '5.2K tools' },
              { name: 'Design', icon: '🎨', count: '3.1K tools' },
              { name: 'Marketing', icon: '📊', count: '4.5K tools' },
              { name: 'Productivity', icon: '⚙️', count: '6.8K tools' },
              { name: 'Communication', icon: '💬', count: '2.9K tools' },
              { name: 'Analytics', icon: '📈', count: '3.7K tools' }
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Tool Comparison Modal */}
      {showComparison && (
        <AdvancedToolComparison 
          tools={generateMockCurrentTools()}
          onClose={() => setShowComparison(false)}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};