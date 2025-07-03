import { SearchQuery, SearchContext, AIEnhancedTool, SearchIntent } from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { convertToAIEnhancedTool } from '@/lib/tool-conversion';

export interface SearchTokens {
  tools: string[];
  features: string[];
  categories: string[];
  integrations: string[];
  pricing: string[];
  company_size: string[];
  use_cases: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'high' | 'medium' | 'low';
}

export interface EnhancedSearchResult {
  tools: AIEnhancedTool[];
  explanation: string;
  confidence: number;
  alternative_queries: string[];
  filters_applied: Record<string, any>;
  search_intent: SearchIntent;
}

export class NLPSearchEngine {
  private toolKeywords: Map<string, string[]> = new Map();
  private categoryKeywords: Map<string, string[]> = new Map();
  private featureKeywords: Map<string, string[]> = new Map();
  private integrationKeywords: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKeywordMaps();
  }

  private initializeKeywordMaps() {
    // Tool-specific keywords
    this.toolKeywords.set('communication', [
      'slack', 'teams', 'discord', 'zoom', 'meet', 'chat', 'messaging', 'video call', 
      'conference', 'collaboration', 'talk', 'communicate', 'discuss'
    ]);
    
    this.toolKeywords.set('project-management', [
      'jira', 'asana', 'trello', 'notion', 'monday', 'linear', 'clickup', 'project', 
      'task', 'kanban', 'scrum', 'agile', 'roadmap', 'planning', 'organize'
    ]);
    
    this.toolKeywords.set('design', [
      'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'canva', 'design', 
      'ui', 'ux', 'prototype', 'wireframe', 'mockup', 'graphic', 'visual'
    ]);
    
    this.toolKeywords.set('development', [
      'vscode', 'github', 'gitlab', 'bitbucket', 'code', 'programming', 'development', 
      'git', 'repository', 'commit', 'branch', 'merge', 'deploy', 'ci/cd'
    ]);

    // Category keywords
    this.categoryKeywords.set('productivity', [
      'efficient', 'organize', 'workflow', 'automation', 'streamline', 'optimize'
    ]);
    
    this.categoryKeywords.set('security', [
      'secure', 'protection', 'encrypt', 'compliance', 'audit', 'privacy', 'safety'
    ]);

    // Feature keywords
    this.featureKeywords.set('integration', [
      'integrate', 'connect', 'sync', 'api', 'webhook', 'plugin', 'extension'
    ]);
    
    this.featureKeywords.set('collaboration', [
      'team', 'share', 'collaborate', 'together', 'group', 'multiple users'
    ]);
    
    this.featureKeywords.set('real-time', [
      'live', 'real-time', 'instant', 'immediate', 'sync', 'concurrent'
    ]);

    // Integration keywords
    this.integrationKeywords.set('slack', ['slack', 'slack integration']);
    this.integrationKeywords.set('google', ['google', 'gmail', 'google drive', 'google workspace']);
    this.integrationKeywords.set('microsoft', ['microsoft', 'office', 'teams', 'outlook']);
  }

  /**
   * Enhanced natural language search that understands context and intent
   */
  async enhancedSearch(
    query: string, 
    context: SearchContext,
    tools: (SoftwareToolModel & { id: number })[]
  ): Promise<EnhancedSearchResult> {
    
    // Step 1: Tokenize and analyze the query
    const tokens = this.tokenizeQuery(query);
    const intent = this.detectSearchIntent(query, tokens);
    
    // Step 2: Extract search parameters from natural language
    const searchParams = this.extractSearchParameters(query, tokens, context);
    
    // Step 3: Apply semantic search
    const rankedTools = this.semanticSearch(query, tools, searchParams);
    
    // Step 4: Convert to enhanced tools and apply AI scoring
    const enhancedTools = rankedTools.map(tool => {
      const enhanced = convertToAIEnhancedTool(tool);
      // Apply relevance scoring based on query match
      enhanced.ai_score.relevance = this.calculateRelevanceScore(query, tool, tokens);
      return enhanced;
    });

    // Step 5: Generate explanation and alternatives
    const explanation = this.generateSearchExplanation(query, tokens, enhancedTools.length);
    const alternatives = this.generateAlternativeQueries(query, tokens);

    return {
      tools: enhancedTools.slice(0, 20), // Limit to top 20 results
      explanation,
      confidence: this.calculateSearchConfidence(tokens, enhancedTools.length),
      alternative_queries: alternatives,
      filters_applied: searchParams,
      search_intent: intent
    };
  }

  private tokenizeQuery(query: string): SearchTokens {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);
    
    return {
      tools: this.extractKeywords(lowerQuery, this.toolKeywords),
      features: this.extractKeywords(lowerQuery, this.featureKeywords),
      categories: this.extractKeywords(lowerQuery, this.categoryKeywords),
      integrations: this.extractKeywords(lowerQuery, this.integrationKeywords),
      pricing: this.extractPricingTerms(lowerQuery),
      company_size: this.extractCompanySize(lowerQuery),
      use_cases: this.extractUseCases(lowerQuery),
      sentiment: this.analyzeSentiment(lowerQuery),
      urgency: this.detectUrgency(lowerQuery)
    };
  }

  private extractKeywords(query: string, keywordMap: Map<string, string[]>): string[] {
    const found: string[] = [];
    for (const [category, keywords] of keywordMap.entries()) {
      for (const keyword of keywords) {
        if (query.includes(keyword)) {
          found.push(category);
          break;
        }
      }
    }
    return found;
  }

  private extractPricingTerms(query: string): string[] {
    const pricingTerms: string[] = [];
    
    if (query.match(/\b(free|no cost|zero cost|gratis)\b/)) {
      pricingTerms.push('free');
    }
    if (query.match(/\b(cheap|affordable|budget|low cost|inexpensive)\b/)) {
      pricingTerms.push('budget-friendly');
    }
    if (query.match(/\b(premium|enterprise|professional|paid)\b/)) {
      pricingTerms.push('paid');
    }
    if (query.match(/\b(trial|demo|test|try)\b/)) {
      pricingTerms.push('trial-available');
    }
    
    return pricingTerms;
  }

  private extractCompanySize(query: string): string[] {
    const sizes: string[] = [];
    
    if (query.match(/\b(startup|small team|few people)\b/)) {
      sizes.push('startup');
    }
    if (query.match(/\b(small business|small company)\b/)) {
      sizes.push('small');
    }
    if (query.match(/\b(medium|mid-size|growing)\b/)) {
      sizes.push('medium');
    }
    if (query.match(/\b(large|big company|corporation|enterprise)\b/)) {
      sizes.push('large');
    }
    
    return sizes;
  }

  private extractUseCases(query: string): string[] {
    const useCases: string[] = [];
    
    if (query.match(/\b(remote|distributed|work from home)\b/)) {
      useCases.push('remote-work');
    }
    if (query.match(/\b(customer|client|support)\b/)) {
      useCases.push('customer-service');
    }
    if (query.match(/\b(marketing|campaign|promotion)\b/)) {
      useCases.push('marketing');
    }
    if (query.match(/\b(sales|crm|lead)\b/)) {
      useCases.push('sales');
    }
    if (query.match(/\b(analytics|data|reporting|metrics)\b/)) {
      useCases.push('analytics');
    }
    
    return useCases;
  }

  private analyzeSentiment(query: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['best', 'good', 'great', 'excellent', 'amazing', 'love', 'perfect'];
    const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'worst', 'awful', 'problems'];
    
    const hasPositive = positiveWords.some(word => query.includes(word));
    const hasNegative = negativeWords.some(word => query.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  private detectUrgency(query: string): 'high' | 'medium' | 'low' {
    if (query.match(/\b(urgent|asap|immediately|quickly|fast|now|emergency)\b/)) {
      return 'high';
    }
    if (query.match(/\b(soon|next week|this month|planning)\b/)) {
      return 'medium';
    }
    return 'low';
  }

  private detectSearchIntent(query: string, tokens: SearchTokens): SearchIntent {
    if (query.match(/\b(compare|vs|versus|difference|better)\b/)) {
      return 'comparison';
    }
    if (query.match(/\b(replace|alternative|switch|migrate)\b/)) {
      return 'replacement';
    }
    if (query.match(/\b(integrate|connect|work with)\b/)) {
      return 'integration';
    }
    if (query.match(/\b(evaluate|review|test|assess)\b/)) {
      return 'evaluation';
    }
    return 'discovery';
  }

  private extractSearchParameters(query: string, tokens: SearchTokens, context: SearchContext) {
    return {
      categories: tokens.categories,
      features_required: tokens.features,
      integrations_needed: tokens.integrations,
      pricing_preferences: tokens.pricing,
      company_size: tokens.company_size,
      use_cases: tokens.use_cases,
      sentiment: tokens.sentiment,
      urgency: tokens.urgency,
      user_context: {
        current_stack: context.current_tools,
        industry: context.user_profile.industry,
        experience: context.user_profile.experience_level
      }
    };
  }

  private semanticSearch(
    query: string, 
    tools: (SoftwareToolModel & { id: number })[],
    searchParams: any
  ): (SoftwareToolModel & { id: number })[] {
    
    return tools
      .map(tool => ({
        tool,
        score: this.calculateToolScore(query, tool, searchParams)
      }))
      .filter(result => result.score > 0.1) // Filter out very low relevance
      .sort((a, b) => b.score - a.score)
      .map(result => result.tool);
  }

  private calculateToolScore(
    query: string, 
    tool: SoftwareToolModel & { id: number }, 
    searchParams: any
  ): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Direct name match (highest weight)
    if (tool.name.toLowerCase().includes(queryLower)) {
      score += 1.0;
    }
    
    // Category match
    if (searchParams.categories.some((cat: string) => 
      tool.category.toLowerCase().includes(cat) || cat.includes(tool.category.toLowerCase())
    )) {
      score += 0.8;
    }
    
    // Description keyword match
    const descWords = tool.description.toLowerCase().split(/\s+/);
    const queryWords = queryLower.split(/\s+/);
    const matchingWords = queryWords.filter(word => 
      descWords.some(descWord => descWord.includes(word) || word.includes(descWord))
    );
    score += (matchingWords.length / queryWords.length) * 0.6;
    
    // Feature match
    const featureMatches = tool.features.filter(feature =>
      queryWords.some(word => feature.toLowerCase().includes(word))
    ).length;
    score += (featureMatches / tool.features.length) * 0.5;
    
    // Tag match
    const tagMatches = tool.tags.filter(tag =>
      queryWords.some(word => tag.toLowerCase().includes(word))
    ).length;
    score += (tagMatches / tool.tags.length) * 0.4;
    
    // Pricing preference match
    if (searchParams.pricing_preferences.includes('free') && tool.pricing.type === 'free') {
      score += 0.3;
    }
    if (searchParams.pricing_preferences.includes('budget-friendly') && 
        (tool.pricing.type === 'free' || tool.pricing.type === 'freemium')) {
      score += 0.3;
    }
    
    // Rating boost for higher quality tools
    score += (tool.rating / 5) * 0.2;
    
    return Math.min(score, 2.0); // Cap at 2.0
  }

  private calculateRelevanceScore(
    query: string, 
    tool: SoftwareToolModel & { id: number }, 
    tokens: SearchTokens
  ): number {
    let relevance = 0;
    
    // Base relevance from semantic search
    relevance += this.calculateToolScore(query, tool, {
      categories: tokens.categories,
      pricing_preferences: tokens.pricing
    }) * 40; // Convert to 0-100 scale
    
    // Boost for exact matches
    if (tool.name.toLowerCase() === query.toLowerCase()) {
      relevance += 30;
    }
    
    // Category relevance
    if (tokens.categories.some(cat => tool.category.toLowerCase().includes(cat))) {
      relevance += 20;
    }
    
    // Feature relevance
    const featureMatch = tokens.features.some(feature =>
      tool.features.some(toolFeature => toolFeature.toLowerCase().includes(feature))
    );
    if (featureMatch) {
      relevance += 15;
    }
    
    return Math.min(relevance, 100);
  }

  private calculateSearchConfidence(tokens: SearchTokens, resultCount: number): number {
    let confidence = 0.5; // Base confidence
    
    // More specific queries have higher confidence
    const specificityScore = (
      tokens.tools.length +
      tokens.categories.length +
      tokens.features.length +
      tokens.integrations.length
    ) / 10;
    
    confidence += Math.min(specificityScore, 0.3);
    
    // Results availability affects confidence
    if (resultCount > 5) {
      confidence += 0.2;
    } else if (resultCount > 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  private generateSearchExplanation(query: string, tokens: SearchTokens, resultCount: number): string {
    const explanations: string[] = [];
    
    if (tokens.tools.length > 0) {
      explanations.push(`Found tools related to: ${tokens.tools.join(', ')}`);
    }
    
    if (tokens.categories.length > 0) {
      explanations.push(`Filtered by categories: ${tokens.categories.join(', ')}`);
    }
    
    if (tokens.features.length > 0) {
      explanations.push(`Looking for features: ${tokens.features.join(', ')}`);
    }
    
    if (tokens.pricing.length > 0) {
      explanations.push(`Considering pricing: ${tokens.pricing.join(', ')}`);
    }
    
    if (tokens.urgency === 'high') {
      explanations.push('Prioritized tools with quick setup');
    }
    
    const baseExplanation = `Found ${resultCount} tools matching "${query}"`;
    
    if (explanations.length > 0) {
      return `${baseExplanation}. ${explanations.join('. ')}.`;
    }
    
    return baseExplanation;
  }

  private generateAlternativeQueries(query: string, tokens: SearchTokens): string[] {
    const alternatives: string[] = [];
    
    // Generate variations based on detected categories
    if (tokens.categories.length > 0) {
      alternatives.push(`${tokens.categories[0]} tools for teams`);
      alternatives.push(`best ${tokens.categories[0]} software`);
    }
    
    // Generate use-case based alternatives
    if (tokens.use_cases.length > 0) {
      alternatives.push(`tools for ${tokens.use_cases[0]}`);
    }
    
    // Generate integration-based alternatives
    if (tokens.integrations.length > 0) {
      alternatives.push(`tools that integrate with ${tokens.integrations[0]}`);
    }
    
    // Generate pricing-based alternatives
    if (tokens.pricing.includes('free')) {
      alternatives.push('free alternatives to ' + query);
    }
    
    // Add generic alternatives
    alternatives.push(`${query} alternatives`);
    alternatives.push(`${query} comparison`);
    alternatives.push(`${query} vs competitors`);
    
    return alternatives.slice(0, 5); // Limit to 5 alternatives
  }

  /**
   * Generate smart search suggestions as user types
   */
  generateSmartSuggestions(partialQuery: string, context: SearchContext): string[] {
    const suggestions: string[] = [];
    const query = partialQuery.toLowerCase();
    
    // Tool name suggestions
    const toolSuggestions = [
      'project management tool for remote teams',
      'design software with collaboration features',
      'communication app that integrates with Slack',
      'free alternative to Adobe Photoshop',
      'code editor with Git integration',
      'CRM for small businesses',
      'time tracking tool for freelancers',
      'password manager for teams'
    ];
    
    // Filter suggestions based on partial query
    const filtered = toolSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query) || 
      query.split(' ').some(word => suggestion.toLowerCase().includes(word))
    );
    
    suggestions.push(...filtered);
    
    // Add context-based suggestions
    if (context.user_profile.department === 'development') {
      suggestions.push(
        `${partialQuery} for developers`,
        `${partialQuery} with API access`,
        `${partialQuery} for development teams`
      );
    }
    
    return suggestions.slice(0, 8);
  }
}

export const nlpSearchEngine = new NLPSearchEngine();