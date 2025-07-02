// Discovery Service - Automated tool discovery from multiple APIs
import { ProductHuntService } from './integrations/product-hunt';
import { GitHubTrendingService } from './integrations/github-trending';
import { HackerNewsService } from './integrations/hacker-news';
import { RedditService } from './integrations/reddit';
import { AngelListService } from './integrations/angellist';

export interface DiscoveredTool {
  id: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  category?: string;
  pricing?: string;
  tags: string[];
  source: 'product-hunt' | 'github' | 'hacker-news' | 'reddit' | 'angellist';
  sourceData: {
    votes?: number;
    stars?: number;
    comments?: number;
    launchDate?: string;
    author?: string;
    sourceUrl: string;
  };
  discoveredAt: string;
  verified: boolean;
}

export interface DiscoveryFilters {
  sources?: Array<'product-hunt' | 'github' | 'hacker-news' | 'reddit' | 'angellist'>;
  categories?: string[];
  minVotes?: number;
  minStars?: number;
  dateRange?: {
    from: string;
    to: string;
  };
  keywords?: string[];
}

class DiscoveryService {
  private productHunt: ProductHuntService;
  private github: GitHubTrendingService;
  private hackerNews: HackerNewsService;
  private reddit: RedditService;
  private angelList: AngelListService;

  constructor() {
    this.productHunt = new ProductHuntService();
    this.github = new GitHubTrendingService();
    this.hackerNews = new HackerNewsService();
    this.reddit = new RedditService();
    this.angelList = new AngelListService();
  }

  // Discover tools from all sources
  async discoverTools(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    const sources = filters?.sources || ['product-hunt', 'github', 'hacker-news', 'reddit', 'angellist'];
    const allResults: DiscoveredTool[] = [];

    // Run all API calls in parallel for better performance
    const promises = sources.map(async (source) => {
      try {
        switch (source) {
          case 'product-hunt':
            return await this.productHunt.getLatestTools(filters);
          case 'github':
            return await this.github.getTrendingRepositories(filters);
          case 'hacker-news':
            return await this.hackerNews.getShowHNTools(filters);
          case 'reddit':
            return await this.reddit.getToolSubmissions(filters);
          case 'angellist':
            return await this.angelList.getStartupTools(filters);
          default:
            return [];
        }
      } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
        return [];
      }
    });

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value);
      }
    });

    // Deduplicate and sort results
    return this.deduplicateAndRank(allResults, filters);
  }

  // Get tools from specific source
  async discoverFromSource(source: string, filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    switch (source) {
      case 'product-hunt':
        return await this.productHunt.getLatestTools(filters);
      case 'github':
        return await this.github.getTrendingRepositories(filters);
      case 'hacker-news':
        return await this.hackerNews.getShowHNTools(filters);
      case 'reddit':
        return await this.reddit.getToolSubmissions(filters);
      case 'angellist':
        return await this.angelList.getStartupTools(filters);
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }

  // Daily discovery job - meant to be run on schedule
  async runDailyDiscovery(): Promise<{
    total: number;
    bySource: Record<string, number>;
    newTools: DiscoveredTool[];
  }> {
    console.log('Running daily discovery job...');
    
    const filters: DiscoveryFilters = {
      dateRange: {
        from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
        to: new Date().toISOString()
      }
    };

    const tools = await this.discoverTools(filters);
    
    const bySource = tools.reduce((acc, tool) => {
      acc[tool.source] = (acc[tool.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: tools.length,
      bySource,
      newTools: tools
    };
  }

  // Weekly trending discovery - for identifying hot tools
  async runWeeklyTrendingDiscovery(): Promise<DiscoveredTool[]> {
    console.log('Running weekly trending discovery...');
    
    const filters: DiscoveryFilters = {
      dateRange: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
        to: new Date().toISOString()
      },
      minVotes: 10, // Higher threshold for trending
      minStars: 50
    };

    return await this.discoverTools(filters);
  }

  // Search for tools by keyword across all sources
  async searchByKeyword(keyword: string): Promise<DiscoveredTool[]> {
    const filters: DiscoveryFilters = {
      keywords: [keyword]
    };

    return await this.discoverTools(filters);
  }

  // Private helper methods
  private deduplicateAndRank(tools: DiscoveredTool[], filters?: DiscoveryFilters): DiscoveredTool[] {
    // Remove duplicates based on website URL or name similarity
    const uniqueTools = new Map<string, DiscoveredTool>();
    
    tools.forEach(tool => {
      const key = this.generateDedupeKey(tool);
      const existing = uniqueTools.get(key);
      
      if (!existing || this.shouldReplace(existing, tool)) {
        uniqueTools.set(key, tool);
      }
    });

    let result = Array.from(uniqueTools.values());

    // Apply filters
    if (filters) {
      result = this.applyFilters(result, filters);
    }

    // Sort by relevance score
    return result.sort((a, b) => this.calculateRelevanceScore(b) - this.calculateRelevanceScore(a));
  }

  private generateDedupeKey(tool: DiscoveredTool): string {
    // Create a key for deduplication based on website or name
    const domain = tool.website ? new URL(tool.website).hostname.replace('www.', '') : '';
    const normalizedName = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return domain || normalizedName;
  }

  private shouldReplace(existing: DiscoveredTool, newTool: DiscoveredTool): boolean {
    // Prefer tools with more data/votes/stars
    const existingScore = this.calculateRelevanceScore(existing);
    const newScore = this.calculateRelevanceScore(newTool);
    return newScore > existingScore;
  }

  private calculateRelevanceScore(tool: DiscoveredTool): number {
    let score = 0;
    
    // Base score by source reliability
    const sourceScores = {
      'product-hunt': 10,
      'github': 8,
      'hacker-news': 9,
      'reddit': 6,
      'angellist': 7
    };
    score += sourceScores[tool.source] || 5;

    // Add points for engagement
    score += (tool.sourceData.votes || 0) * 0.1;
    score += (tool.sourceData.stars || 0) * 0.05;
    score += (tool.sourceData.comments || 0) * 0.2;

    // Bonus for recent discovery
    const daysSinceDiscovery = (Date.now() - new Date(tool.discoveredAt).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 10 - daysSinceDiscovery); // Bonus decreases over time

    // Bonus for having complete data
    if (tool.logo) score += 2;
    if (tool.category) score += 2;
    if (tool.pricing) score += 2;
    if (tool.tags.length > 0) score += tool.tags.length * 0.5;

    return score;
  }

  private applyFilters(tools: DiscoveredTool[], filters: DiscoveryFilters): DiscoveredTool[] {
    return tools.filter(tool => {
      // Category filter
      if (filters.categories?.length && tool.category) {
        if (!filters.categories.some(cat => 
          tool.category!.toLowerCase().includes(cat.toLowerCase()) ||
          tool.tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase()))
        )) {
          return false;
        }
      }

      // Vote threshold
      if (filters.minVotes && (tool.sourceData.votes || 0) < filters.minVotes) {
        return false;
      }

      // Star threshold
      if (filters.minStars && (tool.sourceData.stars || 0) < filters.minStars) {
        return false;
      }

      // Date range
      if (filters.dateRange) {
        const toolDate = new Date(tool.discoveredAt);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        if (toolDate < fromDate || toolDate > toDate) {
          return false;
        }
      }

      // Keyword filter
      if (filters.keywords?.length) {
        const searchText = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
        if (!filters.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });
  }

  // Get discovery statistics
  async getDiscoveryStats(): Promise<{
    totalDiscovered: number;
    lastWeek: number;
    bySource: Record<string, number>;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    // This would typically query your database
    // For now, return mock data structure
    return {
      totalDiscovered: 0,
      lastWeek: 0,
      bySource: {},
      topCategories: []
    };
  }
}

// Export singleton instance
export const discoveryService = new DiscoveryService();

// Export types (DiscoveryFilters already exported above)