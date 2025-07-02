// Hacker News API Integration
import type { DiscoveredTool, DiscoveryFilters } from '../discovery-service';

interface HackerNewsItem {
  id: number;
  deleted?: boolean;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score: number;
  title: string;
  parts?: number[];
  descendants: number;
}

interface HackerNewsStory extends HackerNewsItem {
  type: 'story';
  url?: string;
  title: string;
  score: number;
  descendants: number; // comment count
}

export class HackerNewsService {
  private baseUrl = 'https://hacker-news.firebaseio.com/v0';
  private cache = new Map<number, HackerNewsItem>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes

  async getShowHNTools(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    try {
      // Get recent Show HN stories
      const showHNStories = await this.getShowHNStories();
      
      // Filter for tool-related posts
      const toolStories = showHNStories.filter(story => this.isToolRelated(story));
      
      return this.convertToDiscoveredTools(toolStories, filters);
    } catch (error) {
      console.error('Error fetching Hacker News Show HN:', error);
      return [];
    }
  }

  async getTrendingDeveloperTools(): Promise<DiscoveredTool[]> {
    try {
      // Get top stories and filter for developer tools
      const topStories = await this.getTopStories(100);
      const developerToolStories = topStories.filter(story => 
        this.isDeveloperToolRelated(story) && story.score >= 50
      );
      
      return this.convertToDiscoveredTools(developerToolStories);
    } catch (error) {
      console.error('Error fetching trending developer tools from HN:', error);
      return [];
    }
  }

  private async getShowHNStories(): Promise<HackerNewsStory[]> {
    // Get recent top stories
    const topStories = await this.getTopStories(200);
    
    // Filter for "Show HN" posts
    return topStories.filter(story => 
      story.title.toLowerCase().startsWith('show hn:') ||
      story.title.toLowerCase().includes('show hn')
    );
  }

  private async getTopStories(limit: number = 100): Promise<HackerNewsStory[]> {
    try {
      // Get top story IDs
      const response = await fetch(`${this.baseUrl}/topstories.json`);
      const storyIds: number[] = await response.json();
      
      // Get story details for top stories
      const stories = await this.getStoriesByIds(storyIds.slice(0, limit));
      
      return stories.filter((story): story is HackerNewsStory => 
        story !== null && story.type === 'story' && !story.deleted && !story.dead
      );
    } catch (error) {
      console.error('Error fetching top stories:', error);
      return [];
    }
  }

  private async getStoriesByIds(ids: number[]): Promise<(HackerNewsStory | null)[]> {
    // Batch fetch stories with concurrency limit
    const batchSize = 10;
    const batches: number[][] = [];
    
    for (let i = 0; i < ids.length; i += batchSize) {
      batches.push(ids.slice(i, i + batchSize));
    }

    const allStories: (HackerNewsStory | null)[] = [];

    for (const batch of batches) {
      const batchPromises = batch.map(id => this.getStoryById(id));
      const batchResults = await Promise.allSettled(batchPromises);
      
      const batchStories = batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : null
      );
      
      allStories.push(...batchStories);
    }

    return allStories;
  }

  private async getStoryById(id: number): Promise<HackerNewsStory | null> {
    // Check cache first
    const cached = this.cache.get(id);
    if (cached && Date.now() - cached.time < this.cacheTimeout) {
      return cached as HackerNewsStory;
    }

    try {
      const response = await fetch(`${this.baseUrl}/item/${id}.json`);
      const story: HackerNewsItem = await response.json();
      
      if (!story || story.deleted || story.dead || story.type !== 'story') {
        return null;
      }

      // Cache the result
      this.cache.set(id, story);
      
      return story as HackerNewsStory;
    } catch (error) {
      console.error(`Error fetching story ${id}:`, error);
      return null;
    }
  }

  private isToolRelated(story: HackerNewsStory): boolean {
    const title = story.title.toLowerCase();
    const url = story.url?.toLowerCase() || '';

    // Show HN tool indicators
    const toolKeywords = [
      'tool', 'app', 'service', 'platform', 'api', 'library', 'framework',
      'cli', 'dashboard', 'monitoring', 'analytics', 'productivity',
      'automation', 'developer', 'devops', 'saas', 'software',
      'build', 'deploy', 'test', 'debug', 'manage', 'track'
    ];

    // Exclude non-tool content
    const excludeKeywords = [
      'article', 'blog', 'post', 'tutorial', 'guide', 'book',
      'video', 'podcast', 'newsletter', 'course', 'learn',
      'story', 'news', 'review', 'analysis', 'opinion'
    ];

    const hasToolKeyword = toolKeywords.some(keyword => 
      title.includes(keyword) || title.includes(`${keyword}`)
    );

    const hasExcludeKeyword = excludeKeywords.some(keyword => 
      title.includes(keyword)
    );

    // Check for domain patterns that indicate tools
    const toolDomains = [
      'github.com', 'gitlab.com', 'npmjs.com', 'pypi.org',
      'docker.com', 'vercel.app', 'netlify.app', 'herokuapp.com'
    ];

    const hasToolDomain = toolDomains.some(domain => url.includes(domain));

    return (hasToolKeyword || hasToolDomain) && !hasExcludeKeyword;
  }

  private isDeveloperToolRelated(story: HackerNewsStory): boolean {
    const title = story.title.toLowerCase();
    const url = story.url?.toLowerCase() || '';

    const devToolKeywords = [
      'developer', 'programming', 'coding', 'api', 'sdk', 'framework',
      'library', 'cli', 'ide', 'editor', 'compiler', 'debugger',
      'testing', 'deployment', 'ci/cd', 'devops', 'infrastructure',
      'monitoring', 'logging', 'database', 'backend', 'frontend',
      'mobile app', 'web app', 'javascript', 'python', 'golang',
      'rust', 'typescript', 'react', 'vue', 'angular', 'node.js'
    ];

    return devToolKeywords.some(keyword => 
      title.includes(keyword) || url.includes(keyword.replace(/[^a-z]/g, ''))
    );
  }

  private convertToDiscoveredTools(stories: HackerNewsStory[], filters?: DiscoveryFilters): DiscoveredTool[] {
    return stories
      .filter(story => this.passesFilters(story, filters))
      .map(story => ({
        id: `hn-${story.id}`,
        name: this.extractToolName(story.title),
        description: this.extractDescription(story.title, story.url),
        website: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        logo: this.extractLogo(story.url),
        category: this.extractCategory(story.title, story.url),
        pricing: undefined, // HN doesn't provide pricing info
        tags: [
          ...this.extractTags(story.title, story.url),
          'hacker-news',
          story.title.toLowerCase().startsWith('show hn') ? 'show-hn' : 'trending'
        ],
        source: 'hacker-news' as const,
        sourceData: {
          votes: story.score,
          comments: story.descendants,
          author: story.by,
          sourceUrl: `https://news.ycombinator.com/item?id=${story.id}`,
        },
        discoveredAt: new Date().toISOString(),
        verified: story.score >= 100, // Auto-verify popular posts
      }));
  }

  private extractToolName(title: string): string {
    // Remove "Show HN:" prefix
    let name = title.replace(/^show hn:\s*/i, '');
    
    // Extract name before description separators
    const separators = [' – ', ' - ', ' — ', ' | ', ': ', ' ('];
    
    for (const separator of separators) {
      const parts = name.split(separator);
      if (parts.length > 1 && parts[0].length > 2) {
        name = parts[0].trim();
        break;
      }
    }

    // Clean up common prefixes/suffixes
    name = name.replace(/^(a|an|the)\s+/i, '');
    name = name.replace(/\s+(v\d+|\d+\.\d+|beta|alpha)$/i, '');
    
    return name.trim();
  }

  private extractDescription(title: string, _url?: string): string {
    // Remove "Show HN:" prefix
    let description = title.replace(/^show hn:\s*/i, '');
    
    // If title has separators, use the part after as description
    const separators = [' – ', ' - ', ' — ', ' | ', ': '];
    
    for (const separator of separators) {
      const parts = description.split(separator);
      if (parts.length > 1) {
        return parts.slice(1).join(separator).trim();
      }
    }

    // Fallback to full title if no clear description
    return description;
  }

  private extractLogo(url?: string): string | undefined {
    if (!url) return undefined;
    
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return undefined;
    }
  }

  private extractCategory(title: string, _url?: string): string {
    const text = `${title} ${_url || ''}`.toLowerCase();

    const categoryPatterns = [
      { pattern: /cli|command.?line|terminal/, category: 'CLI Tools' },
      { pattern: /api|rest|graphql/, category: 'API Tools' },
      { pattern: /web|frontend|react|vue|angular/, category: 'Web Development' },
      { pattern: /mobile|ios|android/, category: 'Mobile Development' },
      { pattern: /devops|deploy|kubernetes|docker/, category: 'DevOps' },
      { pattern: /database|sql|postgres|mongodb/, category: 'Database' },
      { pattern: /monitoring|analytics|logging/, category: 'Monitoring' },
      { pattern: /security|auth|encryption/, category: 'Security' },
      { pattern: /ai|machine.?learning|neural/, category: 'AI/ML' },
      { pattern: /data|etl|pipeline/, category: 'Data Tools' },
      { pattern: /test|testing/, category: 'Testing' },
      { pattern: /editor|ide/, category: 'Editor Tools' },
      { pattern: /productivity|automation/, category: 'Productivity' },
      { pattern: /design|ui|ux/, category: 'Design' },
    ];

    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(text)) {
        return category;
      }
    }

    return 'Developer Tools';
  }

  private extractTags(title: string, url?: string): string[] {
    const text = `${title} ${url || ''}`.toLowerCase();
    const tags: string[] = [];

    // Technology tags
    const techPatterns = [
      'javascript', 'typescript', 'python', 'golang', 'rust', 'java',
      'react', 'vue', 'angular', 'node.js', 'docker', 'kubernetes',
      'aws', 'gcp', 'azure', 'api', 'cli', 'web', 'mobile', 'desktop'
    ];

    techPatterns.forEach(tech => {
      if (text.includes(tech) || text.includes(tech.replace('.', ''))) {
        tags.push(tech);
      }
    });

    return tags;
  }

  private passesFilters(story: HackerNewsStory, filters?: DiscoveryFilters): boolean {
    if (!filters) return true;

    // Vote threshold
    if (filters.minVotes && story.score < filters.minVotes) {
      return false;
    }

    // Date range
    if (filters.dateRange) {
      const storyDate = new Date(story.time * 1000);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      
      if (storyDate < fromDate || storyDate > toDate) {
        return false;
      }
    }

    // Keywords
    if (filters.keywords?.length) {
      const text = `${story.title} ${story.url || ''}`.toLowerCase();
      if (!filters.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return false;
      }
    }

    return true;
  }

  // Get comments for additional context
  async getStoryComments(storyId: number, maxComments: number = 10): Promise<string[]> {
    try {
      const story = await this.getStoryById(storyId);
      if (!story?.kids) return [];

      const commentIds = story.kids.slice(0, maxComments);
      const comments: string[] = [];

      for (const commentId of commentIds) {
        const comment = await this.getCommentById(commentId);
        if (comment?.text) {
          comments.push(comment.text);
        }
      }

      return comments;
    } catch (error) {
      console.error('Error fetching story comments:', error);
      return [];
    }
  }

  private async getCommentById(id: number): Promise<{ text: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/item/${id}.json`);
      const comment = await response.json();
      return comment?.text ? { text: comment.text } : null;
    } catch {
      return null;
    }
  }
}