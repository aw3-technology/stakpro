// Reddit API Integration
import type { DiscoveredTool, DiscoveryFilters } from '../discovery-service';

interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    author: string;
    created_utc: number;
    score: number;
    num_comments: number;
    subreddit: string;
    permalink: string;
    link_flair_text?: string;
    post_hint?: string;
    thumbnail?: string;
    preview?: {
      images: Array<{
        source: { url: string; width: number; height: number };
      }>;
    };
    media?: any;
    is_self: boolean;
    domain: string;
  };
}

interface RedditListing {
  data: {
    children: RedditPost[];
    after?: string;
    before?: string;
  };
}

export class RedditService {
  private baseUrl = 'https://www.reddit.com';
  private userAgent = 'StakPro-Discovery-Bot/1.0';

  // Target subreddits for tool discovery
  private toolSubreddits = [
    'SideProject',
    'entrepreneur',
    'startups',
    'webdev',
    'programming',
    'developertools',
    'productivity',
    'saas',
    'IndieHackers',
    'IMadeThis',
    'buildinpublic',
    'somethingimade',
    'microsaas',
    'nocode'
  ];

  async getToolSubmissions(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    try {
      const allPosts: RedditPost[] = [];

      // Fetch from multiple subreddits in parallel
      const subredditPromises = this.toolSubreddits.map(async subreddit => {
        try {
          return await this.getSubredditPosts(subreddit, 'hot', 25);
        } catch (error) {
          console.error(`Error fetching r/${subreddit}:`, error);
          return [];
        }
      });

      const results = await Promise.allSettled(subredditPromises);
      
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allPosts.push(...result.value);
        }
      });

      // Filter for tool-related posts and convert
      const toolPosts = allPosts.filter(post => this.isToolRelated(post));
      return this.convertToDiscoveredTools(toolPosts, filters);
    } catch (error) {
      console.error('Error fetching Reddit tool submissions:', error);
      return [];
    }
  }

  async getTrendingFromSubreddit(subreddit: string, timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<DiscoveredTool[]> {
    try {
      const posts = await this.getSubredditPosts(subreddit, 'top', 50, timeframe);
      const toolPosts = posts.filter(post => this.isToolRelated(post));
      return this.convertToDiscoveredTools(toolPosts);
    } catch (error) {
      console.error(`Error fetching trending from r/${subreddit}:`, error);
      return [];
    }
  }

  private async getSubredditPosts(
    subreddit: string, 
    sort: 'hot' | 'new' | 'top' | 'rising' = 'hot',
    limit: number = 25,
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  ): Promise<RedditPost[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(time && sort === 'top' && { t: time })
    });

    const url = `${this.baseUrl}/r/${subreddit}/${sort}.json?${params}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data: RedditListing = await response.json();
    return data.data.children;
  }

  private isToolRelated(post: RedditPost): boolean {
    const { title, selftext, url, link_flair_text, subreddit } = post.data;
    const text = `${title} ${selftext} ${link_flair_text || ''}`.toLowerCase();

    // Strong indicators for tools
    const toolKeywords = [
      'built', 'made', 'created', 'launched', 'released', 'tool', 'app',
      'service', 'platform', 'api', 'website', 'software', 'saas',
      'productivity', 'automation', 'dashboard', 'analytics', 'monitor',
      'cli', 'library', 'framework', 'extension', 'plugin', 'addon'
    ];

    // Exclude non-tool content
    const excludeKeywords = [
      'article', 'blog', 'tutorial', 'course', 'book', 'guide',
      'question', 'help', 'advice', 'discussion', 'opinion',
      'hiring', 'job', 'freelance', 'looking for', 'seeking'
    ];

    const hasToolKeyword = toolKeywords.some(keyword => text.includes(keyword));
    const hasExcludeKeyword = excludeKeywords.some(keyword => text.includes(keyword));

    // Check for launch/announcement patterns
    const launchPatterns = [
      /i (built|made|created|launched)/i,
      /we (built|made|created|launched)/i,
      /(check out|feedback on) my/i,
      /introducing/i,
      /show off/i,
      /just released/i,
      /beta launch/i
    ];

    const hasLaunchPattern = launchPatterns.some(pattern => pattern.test(text));

    // Check URL for tool indicators (not Reddit-hosted content)
    const hasExternalUrl = url && !url.includes('reddit.com') && !url.includes('redd.it');
    
    // Higher confidence for certain subreddits
    const highConfidenceSubreddits = ['SideProject', 'IMadeThis', 'somethingimade', 'buildinpublic'];
    const isHighConfidenceSubreddit = highConfidenceSubreddits.includes(subreddit);

    return (hasToolKeyword || hasLaunchPattern || isHighConfidenceSubreddit) && 
           !hasExcludeKeyword && 
           !!hasExternalUrl &&
           post.data.score >= 5; // Minimum engagement threshold
  }

  private convertToDiscoveredTools(posts: RedditPost[], filters?: DiscoveryFilters): DiscoveredTool[] {
    return posts
      .filter(post => this.passesFilters(post, filters))
      .map(post => ({
        id: `reddit-${post.data.id}`,
        name: this.extractToolName(post.data.title),
        description: this.extractDescription(post.data.title, post.data.selftext),
        website: this.extractWebsite(post.data),
        logo: this.extractLogo(post.data),
        category: this.extractCategory(post.data),
        pricing: this.extractPricing(post.data.title, post.data.selftext),
        tags: [
          ...this.extractTags(post.data),
          'reddit',
          post.data.subreddit.toLowerCase()
        ],
        source: 'reddit' as const,
        sourceData: {
          votes: post.data.score,
          comments: post.data.num_comments,
          author: post.data.author,
          sourceUrl: `https://reddit.com${post.data.permalink}`,
        },
        discoveredAt: new Date().toISOString(),
        verified: post.data.score >= 50 ? true : false, // Auto-verify popular posts
      }));
  }

  private extractToolName(title: string): string {
    // Remove common prefixes
    let name = title.replace(/^(i (built|made|created|launched)|we (built|made|created|launched)|introducing|check out|feedback on|show off)/i, '');
    
    // Clean up brackets and parentheses content
    name = name.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '');
    
    // Extract name before description separators
    const separators = [' – ', ' - ', ' — ', ' | ', ': ', ' for ', ' to help'];
    
    for (const separator of separators) {
      const parts = name.split(separator);
      if (parts.length > 1 && parts[0].trim().length > 2) {
        name = parts[0].trim();
        break;
      }
    }

    // Clean up and return
    return name.trim().replace(/^[:\-–—|]\s*/, '').trim();
  }

  private extractDescription(title: string, selftext: string): string {
    // Try to get description from title after separators
    const separators = [' – ', ' - ', ' — ', ' | ', ': ', ' for ', ' to help'];
    
    for (const separator of separators) {
      const parts = title.split(separator);
      if (parts.length > 1) {
        const description = parts.slice(1).join(separator).trim();
        if (description.length > 10) {
          return description;
        }
      }
    }

    // Fallback to first sentence of selftext
    if (selftext) {
      const firstSentence = selftext.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 20 && firstSentence.length < 200) {
        return firstSentence.trim();
      }
    }

    // Last resort: clean title
    return title.replace(/^(i (built|made|created)|introducing|check out)/i, '').trim();
  }

  private extractWebsite(postData: RedditPost['data']): string {
    const { url, is_self, domain } = postData;
    
    // If it's a self post or Reddit link, use the Reddit post URL
    if (is_self || domain.includes('reddit.com')) {
      return `https://reddit.com${postData.permalink}`;
    }
    
    // Return external URL
    return url;
  }

  private extractLogo(postData: RedditPost['data']): string | undefined {
    // Try to get preview image
    if (postData.preview?.images?.[0]?.source?.url) {
      return postData.preview.images[0].source.url.replace(/&amp;/g, '&');
    }

    // Try thumbnail if it's not a default Reddit thumbnail
    if (postData.thumbnail && 
        !['self', 'default', 'nsfw', 'spoiler'].includes(postData.thumbnail) &&
        postData.thumbnail.startsWith('http')) {
      return postData.thumbnail;
    }

    // Fallback to favicon
    if (postData.url && !postData.url.includes('reddit.com')) {
      try {
        const domain = new URL(postData.url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      } catch {
        return undefined;
      }
    }

    return undefined;
  }

  private extractCategory(postData: RedditPost['data']): string {
    const { title, selftext, subreddit, link_flair_text } = postData;
    const text = `${title} ${selftext} ${link_flair_text || ''}`.toLowerCase();

    // Subreddit-based categorization
    const subredditCategories: Record<string, string> = {
      'webdev': 'Web Development',
      'programming': 'Developer Tools',
      'developertools': 'Developer Tools',
      'productivity': 'Productivity',
      'saas': 'SaaS',
      'entrepreneur': 'Business Tools',
      'startups': 'Business Tools',
      'nocode': 'No-Code Tools',
      'microsaas': 'SaaS',
    };

    if (subredditCategories[subreddit.toLowerCase()]) {
      return subredditCategories[subreddit.toLowerCase()];
    }

    // Content-based categorization
    const categoryPatterns = [
      { pattern: /web|frontend|react|vue|angular|javascript/, category: 'Web Development' },
      { pattern: /mobile|ios|android|app store|play store/, category: 'Mobile Development' },
      { pattern: /productivity|task|todo|note|organize/, category: 'Productivity' },
      { pattern: /analytics|dashboard|metrics|tracking/, category: 'Analytics' },
      { pattern: /marketing|email|social|seo/, category: 'Marketing' },
      { pattern: /design|ui|ux|figma|sketch/, category: 'Design' },
      { pattern: /api|backend|server|database/, category: 'Backend Tools' },
      { pattern: /cli|command|terminal|shell/, category: 'CLI Tools' },
      { pattern: /security|auth|password|encrypt/, category: 'Security' },
      { pattern: /ai|machine learning|neural|gpt/, category: 'AI/ML' },
      { pattern: /devops|deploy|docker|kubernetes/, category: 'DevOps' },
      { pattern: /test|testing|qa|automation/, category: 'Testing' },
      { pattern: /monitor|logging|error|performance/, category: 'Monitoring' },
    ];

    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(text)) {
        return category;
      }
    }

    return 'General Tools';
  }

  private extractPricing(title: string, selftext: string): string | undefined {
    const text = `${title} ${selftext}`.toLowerCase();

    // Look for pricing indicators
    if (text.includes('free') && !text.includes('free trial')) {
      return 'Free';
    }
    
    if (text.includes('freemium') || (text.includes('free') && text.includes('paid'))) {
      return 'Freemium';
    }

    if (text.includes('open source') || text.includes('opensource')) {
      return 'Free (Open Source)';
    }

    // Look for specific pricing mentions
    const pricePattern = /\$\d+(?:\.\d{2})?(?:\/(?:month|mo|year|yr))?/i;
    const priceMatch = text.match(pricePattern);
    if (priceMatch) {
      return `Starting at ${priceMatch[0]}`;
    }

    return undefined;
  }

  private extractTags(postData: RedditPost['data']): string[] {
    const { title, selftext, link_flair_text } = postData;
    const text = `${title} ${selftext} ${link_flair_text || ''}`.toLowerCase();
    const tags: string[] = [];

    // Technology tags
    const techKeywords = [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'python',
      'nodejs', 'nextjs', 'api', 'rest', 'graphql', 'mongodb', 'postgres',
      'firebase', 'supabase', 'vercel', 'netlify', 'aws', 'docker'
    ];

    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });

    // Feature tags
    const featureKeywords = [
      'dashboard', 'analytics', 'automation', 'integration', 'webhook',
      'real-time', 'collaboration', 'mobile-friendly', 'responsive'
    ];

    featureKeywords.forEach(keyword => {
      if (text.includes(keyword.replace('-', ' ')) || text.includes(keyword)) {
        tags.push(keyword);
      }
    });

    // Add flair as tag if available
    if (link_flair_text) {
      tags.push(link_flair_text.toLowerCase().replace(/\s+/g, '-'));
    }

    return tags;
  }

  private passesFilters(post: RedditPost, filters?: DiscoveryFilters): boolean {
    if (!filters) return true;

    const { score, created_utc, title, selftext } = post.data;

    // Vote threshold
    if (filters.minVotes && score < filters.minVotes) {
      return false;
    }

    // Date range
    if (filters.dateRange) {
      const postDate = new Date(created_utc * 1000);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      
      if (postDate < fromDate || postDate > toDate) {
        return false;
      }
    }

    // Keywords
    if (filters.keywords?.length) {
      const text = `${title} ${selftext}`.toLowerCase();
      if (!filters.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return false;
      }
    }

    return true;
  }

  // Search specific subreddit for keywords
  async searchSubreddit(subreddit: string, query: string, sort: 'relevance' | 'hot' | 'top' | 'new' = 'relevance'): Promise<DiscoveredTool[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        sort,
        restrict_sr: 'on',
        limit: '25'
      });

      const url = `${this.baseUrl}/r/${subreddit}/search.json?${params}`;
      
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent },
      });

      const data: RedditListing = await response.json();
      const toolPosts = data.data.children.filter(post => this.isToolRelated(post));
      
      return this.convertToDiscoveredTools(toolPosts);
    } catch (error) {
      console.error(`Error searching r/${subreddit}:`, error);
      return [];
    }
  }
}