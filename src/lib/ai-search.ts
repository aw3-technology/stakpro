import { 
  SearchQuery, 
  SearchResult, 
  SearchContext, 
  SearchIntent,
  AIEnhancedTool,
  SearchInsights,
  RecommendedFilter,
  SearchFilters
} from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { nlpSearchEngine, EnhancedSearchResult } from './nlp-search-engine';

export class AISearchEngine {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    this.baseURL = 'https://api.perplexity.ai';
  }

  /**
   * Enhanced search using NLP engine with local tool database
   */
  async searchWithNLP(
    query: string,
    context: SearchContext,
    tools: (SoftwareToolModel & { id: number })[]
  ): Promise<EnhancedSearchResult> {
    return nlpSearchEngine.enhancedSearch(query, context, tools);
  }

  /**
   * Process natural language search query using AI
   */
  async processNaturalLanguageQuery(
    query: string, 
    context: SearchContext
  ): Promise<SearchQuery> {
    try {
      const processedQuery = await this.analyzeSearchIntent(query, context);
      const filters = await this.extractFiltersFromQuery(query, context);
      
      return {
        text: query,
        filters,
        context,
        intent: processedQuery.intent
      };
    } catch (error) {
      console.error('Error processing natural language query:', error);
      return this.getFallbackQuery(query, context);
    }
  }

  /**
   * Analyze search intent from natural language
   */
  private async analyzeSearchIntent(
    query: string, 
    context: SearchContext
  ): Promise<{ intent: SearchIntent; confidence: number }> {
    const prompt = `
    Analyze this software tool search query and determine the user's intent:
    
    Query: "${query}"
    
    User Context:
    - Industry: ${context.user_profile.industry}
    - Company Size: ${context.user_profile.company_size}
    - Job Title: ${context.user_profile.job_title}
    - Current Tools: ${context.current_tools.join(', ')}
    
    Return JSON with:
    {
      "intent": "discovery|comparison|evaluation|replacement|integration",
      "confidence": 0.0-1.0,
      "reasoning": "explanation"
    }
    `;

    try {
      const response = await this.callPerplexityAPI(prompt);
      const parsed = JSON.parse(response);
      return {
        intent: parsed.intent as SearchIntent,
        confidence: parsed.confidence
      };
    } catch (error) {
      // Fallback intent detection using keywords
      return this.detectIntentFromKeywords(query);
    }
  }

  /**
   * Extract search filters from natural language query
   */
  private async extractFiltersFromQuery(
    query: string, 
    context: SearchContext
  ): Promise<SearchFilters> {
    const prompt = `
    Extract search filters from this software tool query:
    
    Query: "${query}"
    
    Available filter categories:
    - Categories: development, design, marketing, analytics, productivity, communication, security, finance
    - Pricing: free, freemium, subscription, one_time, usage_based
    - Budget: under_100, 100_500, 500_1000, 1000_5000, 5000_plus, enterprise
    - Deployment: cloud, on_premise, hybrid
    - Company Size: startup, small, medium, large, enterprise
    - Security: soc2, gdpr, hipaa, iso27001, pci_dss
    
    Return JSON with extracted filters:
    {
      "categories": [],
      "pricing_models": [],
      "budget_range": null,
      "deployment_types": [],
      "security_requirements": [],
      "features": [],
      "integrations": [],
      "ai_capabilities": false,
      "rating_threshold": 0
    }
    `;

    try {
      const response = await this.callPerplexityAPI(prompt);
      const filters = JSON.parse(response);
      
      // Apply user context to enhance filters
      return this.enhanceFiltersWithContext(filters, context);
    } catch (error) {
      return this.getDefaultFilters(context);
    }
  }

  /**
   * Perform AI-enhanced search
   */
  async search(searchQuery: SearchQuery): Promise<SearchResult> {
    try {
      // Get base results from existing search
      const baseResults = await this.performBaseSearch(searchQuery);
      
      // Enhance with AI insights
      const aiInsights = await this.generateSearchInsights(searchQuery, baseResults);
      
      // Generate recommended filters
      const recommendedFilters = await this.generateRecommendedFilters(searchQuery, baseResults);
      
      // Find trending alternatives
      const trendingAlternatives = await this.findTrendingAlternatives(searchQuery, baseResults);
      
      return {
        tools: baseResults,
        total_count: baseResults.length,
        ai_insights: aiInsights,
        recommended_filters: recommendedFilters,
        related_searches: await this.generateRelatedSearches(searchQuery),
        trending_alternatives: trendingAlternatives
      };
    } catch (error) {
      console.error('Error performing AI search:', error);
      throw new Error('Failed to perform search');
    }
  }

  /**
   * Generate AI insights for search results
   */
  private async generateSearchInsights(
    query: SearchQuery, 
    results: AIEnhancedTool[]
  ): Promise<SearchInsights> {
    const prompt = `
    Analyze these search results for the query: "${query.text}"
    
    Results: ${results.slice(0, 5).map(t => `${t.name}: ${t.description}`).join('\n')}
    
    User Profile:
    - Industry: ${query.context.user_profile.industry}
    - Company Size: ${query.context.user_profile.company_size}
    - Current Tools: ${query.context.current_tools.join(', ')}
    
    Generate insights in JSON format:
    {
      "query_understanding": "What the user is looking for",
      "result_summary": "Summary of the search results",
      "suggestions": ["suggestion1", "suggestion2"],
      "market_insights": ["insight1", "insight2"]
    }
    `;

    try {
      const response = await this.callPerplexityAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      return this.getFallbackInsights(query, results);
    }
  }

  /**
   * Generate contextual search suggestions
   */
  async generateSearchSuggestions(
    partialQuery: string, 
    context: SearchContext
  ): Promise<string[]> {
    const prompt = `
    Generate relevant search suggestions for software tools based on:
    
    Partial Query: "${partialQuery}"
    
    User Context:
    - Industry: ${context.user_profile.industry}
    - Job Title: ${context.user_profile.job_title}
    - Current Tools: ${context.current_tools.join(', ')}
    - Recent Searches: ${context.recent_searches.join(', ')}
    
    Return 5 relevant search suggestions as JSON array:
    ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
    `;

    try {
      const response = await this.callPerplexityAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      return this.getFallbackSuggestions(partialQuery, context);
    }
  }

  /**
   * Smart autocomplete with AI enhancement
   */
  async getSmartAutocomplete(
    input: string, 
    context: SearchContext
  ): Promise<string[]> {
    if (input.length < 2) return [];

    // Combine AI suggestions with traditional autocomplete
    const [aiSuggestions, traditionalSuggestions] = await Promise.all([
      this.generateSearchSuggestions(input, context),
      this.getTraditionalAutocomplete(input)
    ]);

    // Merge and rank suggestions
    return this.rankSuggestions(aiSuggestions, traditionalSuggestions, context);
  }

  /**
   * Semantic search using embeddings
   */
  async semanticSearch(
    query: string, 
    tools: AIEnhancedTool[], 
    limit: number = 10
  ): Promise<AIEnhancedTool[]> {
    // This would typically use vector embeddings
    // For now, implement a simplified semantic matching
    const queryTerms = this.extractSemanticTerms(query);
    
    const scoredTools = tools.map(tool => ({
      tool,
      score: this.calculateSemanticScore(tool, queryTerms)
    }));

    return scoredTools
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tool);
  }

  // Private helper methods

  private async callPerplexityAPI(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant specialized in software tool discovery. Always return valid JSON when requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private detectIntentFromKeywords(query: string): { intent: SearchIntent; confidence: number } {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
      return { intent: 'comparison', confidence: 0.8 };
    }
    
    if (lowerQuery.includes('replace') || lowerQuery.includes('alternative') || lowerQuery.includes('instead')) {
      return { intent: 'replacement', confidence: 0.8 };
    }
    
    if (lowerQuery.includes('integrate') || lowerQuery.includes('connect') || lowerQuery.includes('sync')) {
      return { intent: 'integration', confidence: 0.7 };
    }
    
    if (lowerQuery.includes('evaluate') || lowerQuery.includes('review') || lowerQuery.includes('trial')) {
      return { intent: 'evaluation', confidence: 0.7 };
    }
    
    return { intent: 'discovery', confidence: 0.6 };
  }

  private enhanceFiltersWithContext(
    filters: Partial<SearchFilters>, 
    context: SearchContext
  ): SearchFilters {
    return {
      categories: filters.categories || [],
      pricing_models: filters.pricing_models || [],
      budget_range: filters.budget_range || 'under_100',
      integrations: filters.integrations || [],
      features: filters.features || [],
      security_requirements: filters.security_requirements || [],
      deployment_types: filters.deployment_types || ['cloud'],
      company_size: [context.user_profile.company_size],
      ai_capabilities: filters.ai_capabilities || false,
      rating_threshold: filters.rating_threshold || 0
    };
  }

  private getDefaultFilters(context: SearchContext): SearchFilters {
    return {
      categories: [],
      pricing_models: [],
      budget_range: 'under_100',
      integrations: [],
      features: [],
      security_requirements: [],
      deployment_types: ['cloud'],
      company_size: [context.user_profile.company_size],
      ai_capabilities: false,
      rating_threshold: 0
    };
  }

  private getFallbackQuery(query: string, context: SearchContext): SearchQuery {
    return {
      text: query,
      filters: this.getDefaultFilters(context),
      context,
      intent: 'discovery'
    };
  }

  private async performBaseSearch(_query: SearchQuery): Promise<AIEnhancedTool[]> {
    // This would integrate with your existing search functionality
    // For now, return mock data
    return [];
  }

  private async generateRecommendedFilters(
    _query: SearchQuery, 
    _results: AIEnhancedTool[]
  ): Promise<RecommendedFilter[]> {
    // Generate intelligent filter recommendations based on results
    return [
      {
        filter_type: 'categories',
        suggested_values: ['development', 'productivity'],
        rationale: 'Most relevant categories for your search'
      }
    ];
  }

  private async findTrendingAlternatives(
    _query: SearchQuery, 
    results: AIEnhancedTool[]
  ): Promise<AIEnhancedTool[]> {
    // Find trending alternatives to the search results
    return results.slice(0, 3);
  }

  private async generateRelatedSearches(query: SearchQuery): Promise<string[]> {
    return [
      `${query.text} alternatives`,
      `${query.text} integrations`,
      `${query.text} pricing`,
      `best ${query.text} for teams`,
      `${query.text} vs competitors`
    ];
  }

  private getFallbackInsights(
    query: SearchQuery, 
    results: AIEnhancedTool[]
  ): SearchInsights {
    return {
      query_understanding: `Looking for ${query.text}`,
      result_summary: `Found ${results.length} relevant tools`,
      suggestions: ['Try refining your search', 'Consider similar tools'],
      market_insights: ['This is a growing category', 'New tools are emerging']
    };
  }

  private getFallbackSuggestions(
    partialQuery: string, 
    _context: SearchContext
  ): string[] {
    const suggestions = [
      `${partialQuery} for teams`,
      `${partialQuery} integration`,
      `${partialQuery} alternative`,
      `${partialQuery} pricing`,
      `best ${partialQuery}`
    ];
    
    return suggestions.slice(0, 5);
  }

  private async getTraditionalAutocomplete(input: string): Promise<string[]> {
    // Implement traditional autocomplete logic
    const commonTerms = [
      'project management',
      'customer relationship management',
      'content management system',
      'team collaboration',
      'data analytics',
      'marketing automation',
      'design tools',
      'development tools'
    ];
    
    return commonTerms
      .filter(term => term.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  }

  private rankSuggestions(
    aiSuggestions: string[], 
    traditionalSuggestions: string[], 
    context: SearchContext
  ): string[] {
    // Combine and rank suggestions based on user context
    const combined = [...new Set([...aiSuggestions, ...traditionalSuggestions])];
    
    // Simple ranking based on user's recent searches and profile
    return combined
      .sort((a, b) => {
        const scoreA = this.scoreSuggestion(a, context);
        const scoreB = this.scoreSuggestion(b, context);
        return scoreB - scoreA;
      })
      .slice(0, 8);
  }

  private scoreSuggestion(suggestion: string, context: SearchContext): number {
    let score = 0;
    
    // Boost if matches recent searches
    if (context.recent_searches.some(search => 
      suggestion.toLowerCase().includes(search.toLowerCase())
    )) {
      score += 10;
    }
    
    // Boost if matches user's industry terms
    const industryTerms = this.getIndustryTerms(context.user_profile.industry);
    if (industryTerms.some(term => 
      suggestion.toLowerCase().includes(term.toLowerCase())
    )) {
      score += 5;
    }
    
    return score;
  }

  private getIndustryTerms(industry: string): string[] {
    const industryTermMap: Record<string, string[]> = {
      'technology': ['development', 'coding', 'api', 'devops', 'testing'],
      'marketing': ['automation', 'analytics', 'email', 'social media', 'seo'],
      'healthcare': ['hipaa', 'patient', 'medical', 'compliance', 'ehr'],
      'finance': ['accounting', 'invoicing', 'payroll', 'compliance', 'audit'],
      'education': ['learning', 'student', 'course', 'assessment', 'lms']
    };
    
    return industryTermMap[industry.toLowerCase()] || [];
  }

  private extractSemanticTerms(query: string): string[] {
    // Extract meaningful terms for semantic matching
    const stopWords = ['the', 'and', 'or', 'but', 'for', 'with', 'to', 'a', 'an'];
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => !stopWords.includes(term) && term.length > 2);
  }

  private calculateSemanticScore(tool: AIEnhancedTool, queryTerms: string[]): number {
    let score = 0;
    const toolText = `${tool.name} ${tool.description} ${tool.features.map(f => f.name).join(' ')}`.toLowerCase();
    
    queryTerms.forEach(term => {
      if (toolText.includes(term)) {
        score += 1;
      }
      
      // Boost for name matches
      if (tool.name.toLowerCase().includes(term)) {
        score += 2;
      }
    });
    
    return score;
  }
}

export const aiSearchEngine = new AISearchEngine();