// AngelList/Wellfound API Integration
import type { DiscoveredTool, DiscoveryFilters } from '../discovery-service';

interface AngelListStartup {
  id: number;
  name: string;
  angellist_url: string;
  logo_url?: string;
  thumb_url?: string;
  video_url?: string;
  desc?: string;
  high_concept: string;
  follower_count: number;
  company_url?: string;
  twitter_url?: string;
  blog_url?: string;
  markets: Array<{
    id: number;
    name: string;
    display_name: string;
    angellist_url: string;
  }>;
  locations: Array<{
    id: number;
    name: string;
    display_name: string;
    angellist_url: string;
  }>;
  company_size?: string;
  company_type?: string;
  created_at: string;
  updated_at: string;
  fundraising?: {
    raising: boolean;
    raised_amount?: number;
    pre_money_valuation?: number;
    discount?: number;
  };
  launch_date?: string;
  status?: {
    id: number;
    message: string;
  };
}

// Removed unused interface

export class AngelListService {
  private baseUrl = 'https://api.angel.co/1';
  private accessToken: string;

  constructor() {
    this.accessToken = import.meta.env.VITE_ANGELLIST_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      console.warn('AngelList access token not found in environment variables');
    }
  }

  async getStartupTools(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    if (!this.accessToken) {
      console.warn('AngelList API not configured, skipping...');
      return [];
    }

    try {
      // Search for B2B SaaS and developer tool startups
      const toolMarkets = [
        'developer apis',
        'developer tools', 
        'saas',
        'productivity software',
        'enterprise software',
        'business intelligence',
        'analytics',
        'automation',
        'collaboration',
        'project management'
      ];

      const allStartups: AngelListStartup[] = [];

      // Search multiple markets in parallel
      const searchPromises = toolMarkets.map(async market => {
        try {
          return await this.searchStartupsByMarket(market);
        } catch (error) {
          console.error(`Error searching ${market}:`, error);
          return [];
        }
      });

      const results = await Promise.allSettled(searchPromises);
      
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allStartups.push(...result.value);
        }
      });

      // Deduplicate and filter
      const uniqueStartups = this.deduplicateStartups(allStartups);
      const toolStartups = uniqueStartups.filter(startup => this.isToolRelated(startup));
      
      return this.convertToDiscoveredTools(toolStartups, filters);
    } catch (error) {
      console.error('Error fetching AngelList startups:', error);
      return [];
    }
  }

  async getRecentlyFundedTools(): Promise<DiscoveredTool[]> {
    if (!this.accessToken) return [];

    try {
      // Get startups that recently raised funding
      const fundedStartups = await this.getStartupsWithFunding();
      const toolStartups = fundedStartups.filter(startup => this.isToolRelated(startup));
      
      return this.convertToDiscoveredTools(toolStartups);
    } catch (error) {
      console.error('Error fetching recently funded tools:', error);
      return [];
    }
  }

  async getTrendingStartups(): Promise<DiscoveredTool[]> {
    if (!this.accessToken) return [];

    try {
      // Get trending startups (high follower growth)
      const trending = await this.searchStartups({ sort: 'signal' });
      const toolStartups = trending.filter(startup => 
        this.isToolRelated(startup) && startup.follower_count > 100
      );
      
      return this.convertToDiscoveredTools(toolStartups);
    } catch (error) {
      console.error('Error fetching trending startups:', error);
      return [];
    }
  }

  private async searchStartupsByMarket(market: string): Promise<AngelListStartup[]> {
    const params = new URLSearchParams({
      filter: 'raising',
      market: market,
      sort: 'signal',
      page: '1',
      per_page: '50'
    });

    return await this.makeAngelListRequest(`/tags/${market}/startups`, params);
  }

  private async searchStartups(options: {
    sort?: 'signal' | 'followers' | 'created_at';
    filter?: 'raising' | 'ipo' | 'acquired';
    page?: number;
    perPage?: number;
  } = {}): Promise<AngelListStartup[]> {
    const params = new URLSearchParams({
      sort: options.sort || 'signal',
      page: (options.page || 1).toString(),
      per_page: (options.perPage || 50).toString(),
      ...(options.filter && { filter: options.filter })
    });

    const response = await this.makeAngelListRequest('/startups', params);
    return response;
  }

  private async getStartupsWithFunding(): Promise<AngelListStartup[]> {
    // Search for startups that are currently raising or recently raised
    return await this.searchStartups({
      filter: 'raising',
      sort: 'signal'
    });
  }

  private async makeAngelListRequest(endpoint: string, params?: URLSearchParams): Promise<any> {
    const url = `${this.baseUrl}${endpoint}${params ? `?${params}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'StakPro-Discovery-Bot'
      },
    });

    if (!response.ok) {
      throw new Error(`AngelList API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (data.startups) {
      return data.startups;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return [data];
    }
  }

  private deduplicateStartups(startups: AngelListStartup[]): AngelListStartup[] {
    const seen = new Set<number>();
    return startups.filter(startup => {
      if (seen.has(startup.id)) {
        return false;
      }
      seen.add(startup.id);
      return true;
    });
  }

  private isToolRelated(startup: AngelListStartup): boolean {
    const { name, desc, high_concept, markets } = startup;
    const text = `${name} ${desc || ''} ${high_concept}`.toLowerCase();

    // Check if it's in tool-related markets
    const toolMarkets = [
      'developer tools', 'developer apis', 'saas', 'enterprise software',
      'productivity software', 'business intelligence', 'analytics',
      'automation', 'collaboration', 'project management', 'devops',
      'security', 'data management', 'workflow', 'integration'
    ];

    const hasToolMarket = markets.some(market => 
      toolMarkets.some(toolMarket => 
        market.name.toLowerCase().includes(toolMarket) ||
        market.display_name.toLowerCase().includes(toolMarket)
      )
    );

    // Check description for tool indicators
    const toolKeywords = [
      'platform', 'tool', 'api', 'sdk', 'service', 'software', 'app',
      'solution', 'system', 'dashboard', 'analytics', 'automation',
      'productivity', 'workflow', 'integration', 'developer', 'saas',
      'enterprise', 'business', 'management', 'monitor', 'track'
    ];

    const hasToolKeyword = toolKeywords.some(keyword => text.includes(keyword));

    // Exclude non-B2B consumer apps
    const excludeKeywords = [
      'social network', 'dating', 'game', 'entertainment', 'media',
      'content', 'news', 'blog', 'marketplace', 'ecommerce', 'retail',
      'food', 'travel', 'fitness', 'health', 'education', 'learning'
    ];

    const hasExcludeKeyword = excludeKeywords.some(keyword => text.includes(keyword));

    return (hasToolMarket || hasToolKeyword) && !hasExcludeKeyword;
  }

  private convertToDiscoveredTools(startups: AngelListStartup[], filters?: DiscoveryFilters): DiscoveredTool[] {
    return startups
      .filter(startup => this.passesFilters(startup, filters))
      .map(startup => ({
        id: `al-${startup.id}`,
        name: startup.name,
        description: startup.desc || startup.high_concept,
        website: startup.company_url || startup.angellist_url,
        logo: startup.logo_url || startup.thumb_url,
        category: this.extractCategory(startup),
        pricing: this.extractPricing(startup),
        tags: [
          ...startup.markets.map(market => market.name),
          ...this.extractTags(startup),
          'angellist',
          'startup'
        ],
        source: 'angellist' as const,
        sourceData: {
          votes: startup.follower_count,
          author: startup.name,
          sourceUrl: startup.angellist_url,
        },
        discoveredAt: new Date().toISOString(),
        verified: startup.follower_count > 500, // Auto-verify popular startups
      }));
  }

  private extractCategory(startup: AngelListStartup): string {
    const { markets, name, desc, high_concept } = startup;
    
    // Use AngelList market categories
    const marketCategories: Record<string, string> = {
      'developer tools': 'Developer Tools',
      'developer apis': 'API Tools',
      'saas': 'SaaS',
      'enterprise software': 'Enterprise Tools',
      'productivity software': 'Productivity',
      'business intelligence': 'Analytics',
      'analytics': 'Analytics',
      'automation': 'Automation',
      'collaboration': 'Collaboration',
      'project management': 'Project Management',
      'devops': 'DevOps',
      'security': 'Security',
      'data management': 'Data Tools',
      'integration': 'Integration Tools',
      'mobile': 'Mobile Development',
      'web development': 'Web Development'
    };

    // Find best matching category from markets
    for (const market of markets) {
      const marketName = market.name.toLowerCase();
      for (const [key, category] of Object.entries(marketCategories)) {
        if (marketName.includes(key)) {
          return category;
        }
      }
    }

    // Fallback to content analysis
    const text = `${name} ${desc || ''} ${high_concept}`.toLowerCase();
    
    const categoryPatterns = [
      { pattern: /api|rest|graphql/, category: 'API Tools' },
      { pattern: /dashboard|analytics|business intelligence/, category: 'Analytics' },
      { pattern: /security|auth|encryption/, category: 'Security' },
      { pattern: /mobile|ios|android/, category: 'Mobile Development' },
      { pattern: /web|frontend|javascript/, category: 'Web Development' },
      { pattern: /devops|deploy|infrastructure/, category: 'DevOps' },
      { pattern: /database|data|etl/, category: 'Data Tools' },
      { pattern: /productivity|workflow|automation/, category: 'Productivity' },
      { pattern: /collaboration|team|communication/, category: 'Collaboration' },
      { pattern: /project|task|management/, category: 'Project Management' },
    ];

    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(text)) {
        return category;
      }
    }

    return 'Business Tools';
  }

  private extractPricing(startup: AngelListStartup): string | undefined {
    const { desc, high_concept } = startup;
    const text = `${desc || ''} ${high_concept}`.toLowerCase();

    // Look for pricing indicators
    if (text.includes('free') && !text.includes('free trial')) {
      return 'Free';
    }
    
    if (text.includes('freemium')) {
      return 'Freemium';
    }

    if (text.includes('subscription') || text.includes('saas')) {
      return 'Subscription';
    }

    if (text.includes('enterprise')) {
      return 'Enterprise Pricing';
    }

    // Look for specific pricing mentions
    const pricePattern = /\$\d+(?:\.\d{2})?(?:\/(?:month|mo|year|user))?/i;
    const priceMatch = text.match(pricePattern);
    if (priceMatch) {
      return `Starting at ${priceMatch[0]}`;
    }

    return undefined;
  }

  private extractTags(startup: AngelListStartup): string[] {
    const { desc, high_concept, company_size, locations } = startup;
    const text = `${desc || ''} ${high_concept}`.toLowerCase();
    const tags: string[] = [];

    // Technology tags
    const techKeywords = [
      'api', 'saas', 'ai', 'machine learning', 'blockchain', 'cloud',
      'mobile', 'web', 'ios', 'android', 'javascript', 'react', 'node'
    ];

    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });

    // Business model tags
    if (text.includes('b2b') || text.includes('enterprise')) {
      tags.push('b2b');
    }
    if (text.includes('b2c') || text.includes('consumer')) {
      tags.push('b2c');
    }

    // Stage tags
    if (startup.fundraising?.raising) {
      tags.push('fundraising');
    }

    // Size tags
    if (company_size) {
      tags.push(`${company_size.toLowerCase().replace(/\s+/g, '-')}-company`);
    }

    // Location tags (first location only)
    if (locations.length > 0) {
      tags.push(locations[0].name.toLowerCase().replace(/\s+/g, '-'));
    }

    return tags;
  }

  private passesFilters(startup: AngelListStartup, filters?: DiscoveryFilters): boolean {
    if (!filters) return true;

    // Follower threshold (using as equivalent to votes)
    if (filters.minVotes && startup.follower_count < filters.minVotes) {
      return false;
    }

    // Date range
    if (filters.dateRange) {
      const createdDate = new Date(startup.created_at);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      
      if (createdDate < fromDate || createdDate > toDate) {
        return false;
      }
    }

    // Keywords
    if (filters.keywords?.length) {
      const text = `${startup.name} ${startup.desc || ''} ${startup.high_concept}`.toLowerCase();
      if (!filters.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return false;
      }
    }

    // Category filter
    if (filters.categories?.length) {
      const markets = startup.markets.map(m => m.name.toLowerCase());
      const hasMatchingCategory = filters.categories.some(category =>
        markets.some(market => market.includes(category.toLowerCase()))
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    return true;
  }

  // Get detailed startup information
  async getStartupDetails(startupId: number): Promise<AngelListStartup | null> {
    if (!this.accessToken) return null;

    try {
      const startup = await this.makeAngelListRequest(`/startups/${startupId}`);
      return startup;
    } catch (error) {
      console.error(`Error fetching startup ${startupId}:`, error);
      return null;
    }
  }

  // Search by specific criteria
  async searchByKeywords(keywords: string[]): Promise<DiscoveredTool[]> {
    if (!this.accessToken) return [];

    try {
      // AngelList doesn't have direct keyword search in their public API
      // We'll search across relevant markets and filter by keywords
      const allStartups = await this.getStartupTools();
      
      const filteredStartups = allStartups.filter(tool => {
        const toolText = `${tool.name} ${tool.description}`.toLowerCase();
        return keywords.some(keyword => toolText.includes(keyword.toLowerCase()));
      });

      return filteredStartups;
    } catch (error) {
      console.error('Error searching by keywords:', error);
      return [];
    }
  }
}