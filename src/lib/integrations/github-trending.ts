// GitHub Trending API Integration
import type { DiscoveredTool, DiscoveryFilters } from '../discovery-service';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    type: string;
  };
  license: {
    name: string;
    spdx_id: string;
  } | null;
  open_issues_count: number;
  archived: boolean;
  disabled: boolean;
  visibility: string;
}

interface TrendingRepository extends GitHubRepository {
  todayStars?: number;
  weekStars?: number;
  monthStars?: number;
}

export class GitHubTrendingService {
  private githubToken: string;
  private baseUrl = 'https://api.github.com';

  constructor() {
    this.githubToken = import.meta.env.VITE_GITHUB_TOKEN || '';
    if (!this.githubToken) {
      console.warn('GitHub token not found in environment variables');
    }
  }

  async getTrendingRepositories(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    try {
      const [dailyTrending, weeklyTrending] = await Promise.all([
        this.searchTrendingRepos('daily'),
        this.searchTrendingRepos('weekly')
      ]);

      const allRepos = this.mergeTrendingData(dailyTrending, weeklyTrending);
      return this.convertToDiscoveredTools(allRepos, filters);
    } catch (error) {
      console.error('Error fetching GitHub trending:', error);
      return [];
    }
  }

  async getNewDeveloperTools(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    try {
      // Search for recently created repositories with developer tool keywords
      const queries = [
        'developer tools created:>2024-01-01',
        'productivity tool created:>2024-01-01',
        'cli tool created:>2024-01-01',
        'api tool created:>2024-01-01',
        'devops tool created:>2024-01-01'
      ];

      const allRepos: GitHubRepository[] = [];

      for (const query of queries) {
        const repos = await this.searchRepositories(query, 'stars', 20);
        allRepos.push(...repos);
      }

      // Remove duplicates and convert
      const uniqueRepos = this.deduplicateRepos(allRepos);
      return this.convertToDiscoveredTools(uniqueRepos, filters);
    } catch (error) {
      console.error('Error fetching new developer tools:', error);
      return [];
    }
  }

  private async searchTrendingRepos(period: 'daily' | 'weekly'): Promise<TrendingRepository[]> {
    const dateThreshold = period === 'daily' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const query = `created:>${dateThreshold.toISOString().split('T')[0]} stars:>10`;
    
    const repos = await this.searchRepositories(query, 'stars', 50);
    
    // Add trending data
    return repos.map(repo => ({
      ...repo,
      todayStars: period === 'daily' ? repo.stargazers_count : undefined,
      weekStars: period === 'weekly' ? repo.stargazers_count : undefined,
    }));
  }

  private async searchRepositories(
    query: string, 
    sort: 'stars' | 'updated' | 'created' = 'stars',
    perPage: number = 30
  ): Promise<GitHubRepository[]> {
    const url = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&per_page=${perPage}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'StakPro-Discovery-Bot'
    };

    if (this.githubToken) {
      headers['Authorization'] = `token ${this.githubToken}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  private mergeTrendingData(daily: TrendingRepository[], weekly: TrendingRepository[]): TrendingRepository[] {
    const merged = new Map<number, TrendingRepository>();

    // Add daily trending
    daily.forEach(repo => {
      merged.set(repo.id, repo);
    });

    // Merge weekly data
    weekly.forEach(repo => {
      const existing = merged.get(repo.id);
      if (existing) {
        existing.weekStars = repo.weekStars;
      } else {
        merged.set(repo.id, repo);
      }
    });

    return Array.from(merged.values());
  }

  private deduplicateRepos(repos: GitHubRepository[]): GitHubRepository[] {
    const seen = new Set<number>();
    return repos.filter(repo => {
      if (seen.has(repo.id)) {
        return false;
      }
      seen.add(repo.id);
      return true;
    });
  }

  private convertToDiscoveredTools(repos: TrendingRepository[], _filters?: DiscoveryFilters): DiscoveredTool[] {
    return repos
      .filter(repo => this.isRelevantTool(repo, _filters))
      .map(repo => ({
        id: `gh-${repo.id}`,
        name: repo.name,
        description: repo.description || `${repo.language} repository by ${repo.owner.login}`,
        website: repo.homepage || repo.html_url,
        logo: repo.owner.avatar_url,
        category: this.extractCategory(repo),
        pricing: this.determinePricing(repo),
        tags: [
          ...repo.topics,
          repo.language || 'unknown',
          'github',
          'open-source'
        ].filter(Boolean),
        source: 'github' as const,
        sourceData: {
          stars: repo.stargazers_count,
          votes: repo.stargazers_count, // Use stars as votes equivalent
          comments: repo.open_issues_count,
          author: repo.owner.login,
          sourceUrl: repo.html_url,
        },
        discoveredAt: new Date().toISOString(),
        verified: repo.stargazers_count > 100, // Auto-verify popular repos
      }));
  }

  private isRelevantTool(repo: TrendingRepository, _filters?: DiscoveryFilters): boolean {
    // Skip archived or disabled repos
    if (repo.archived || repo.disabled) {
      return false;
    }

    // Skip personal projects with very low engagement
    if (repo.stargazers_count < 5 && repo.forks_count < 2) {
      return false;
    }

    // Look for tool indicators in name, description, or topics
    const text = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
    
    const toolKeywords = [
      'tool', 'cli', 'api', 'framework', 'library', 'sdk', 'platform',
      'dashboard', 'monitor', 'deploy', 'build', 'test', 'debug',
      'automation', 'workflow', 'productivity', 'developer', 'devops',
      'database', 'server', 'client', 'extension', 'plugin', 'addon',
      'parser', 'generator', 'converter', 'validator', 'analyzer'
    ];

    const hasToolKeyword = toolKeywords.some(keyword => text.includes(keyword));
    
    // Check if it's a common tool language/framework
    const toolLanguages = [
      'javascript', 'typescript', 'python', 'go', 'rust', 'java',
      'kotlin', 'swift', 'dart', 'ruby', 'php', 'c#', 'shell'
    ];
    
    const isToolLanguage = toolLanguages.includes((repo.language || '').toLowerCase());
    
    // Check topics for tool indicators
    const toolTopics = repo.topics.some(topic => 
      ['developer-tools', 'cli', 'api', 'framework', 'library', 'devops', 
       'automation', 'productivity', 'monitoring', 'deployment'].includes(topic)
    );

    return hasToolKeyword || (isToolLanguage && toolTopics);
  }

  private extractCategory(repo: TrendingRepository): string {
    const { language, topics, name, description } = repo;
    const text = `${name} ${description || ''} ${topics.join(' ')}`.toLowerCase();

    // Category mapping based on content analysis
    const categoryPatterns = [
      { pattern: /cli|command.?line|terminal/, category: 'CLI Tools' },
      { pattern: /api|rest|graphql|endpoint/, category: 'API Tools' },
      { pattern: /web|frontend|react|vue|angular/, category: 'Web Development' },
      { pattern: /mobile|ios|android|flutter|react.?native/, category: 'Mobile Development' },
      { pattern: /devops|deploy|kubernetes|docker|ci.?cd/, category: 'DevOps' },
      { pattern: /database|sql|nosql|mongodb|postgres/, category: 'Database' },
      { pattern: /monitoring|analytics|observability|logging/, category: 'Monitoring' },
      { pattern: /security|auth|crypto|vulnerability/, category: 'Security' },
      { pattern: /ai|machine.?learning|neural|model/, category: 'AI/ML' },
      { pattern: /data|etl|pipeline|processing/, category: 'Data Tools' },
      { pattern: /test|testing|e2e|unit|integration/, category: 'Testing' },
      { pattern: /build|bundler|webpack|vite|compiler/, category: 'Build Tools' },
      { pattern: /editor|ide|extension|plugin/, category: 'Editor Tools' },
      { pattern: /documentation|docs|markdown/, category: 'Documentation' },
      { pattern: /productivity|automation|workflow/, category: 'Productivity' },
    ];

    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(text)) {
        return category;
      }
    }

    // Fallback to language-based categorization
    const languageCategories: Record<string, string> = {
      'javascript': 'Web Development',
      'typescript': 'Web Development', 
      'python': 'Data Tools',
      'go': 'Backend Tools',
      'rust': 'System Tools',
      'java': 'Enterprise Tools',
      'kotlin': 'Mobile Development',
      'swift': 'Mobile Development',
      'shell': 'CLI Tools',
      'dockerfile': 'DevOps',
      'yaml': 'DevOps',
    };

    return languageCategories[language?.toLowerCase() || ''] || 'Developer Tools';
  }

  private determinePricing(repo: TrendingRepository): string {
    // GitHub repos are typically open source
    if (repo.license) {
      const freeLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'bsd-3-clause', 'bsd-2-clause'];
      if (freeLicenses.includes(repo.license.spdx_id?.toLowerCase() || '')) {
        return 'Free (Open Source)';
      }
    }
    
    // Check if it mentions commercial licensing in description
    const description = repo.description?.toLowerCase() || '';
    if (description.includes('commercial') || description.includes('enterprise')) {
      return 'Free + Commercial';
    }
    
    return 'Free (Open Source)';
  }

  // Get repository details with additional metadata
  async getRepositoryDetails(fullName: string): Promise<GitHubRepository | null> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'StakPro-Discovery-Bot'
      };

      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`;
      }

      const response = await fetch(`${this.baseUrl}/repos/${fullName}`, { headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching repository details:', error);
      return null;
    }
  }

  // Get trending by specific language
  async getTrendingByLanguage(language: string, days: number = 7): Promise<DiscoveredTool[]> {
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const query = `language:${language} created:>${dateThreshold.toISOString().split('T')[0]} stars:>5`;
    
    try {
      const repos = await this.searchRepositories(query, 'stars', 30);
      return this.convertToDiscoveredTools(repos);
    } catch (error) {
      console.error(`Error fetching trending ${language} repositories:`, error);
      return [];
    }
  }
}