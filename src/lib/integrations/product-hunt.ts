// Product Hunt API Integration
import type { DiscoveredTool, DiscoveryFilters } from '../discovery-service';

interface ProductHuntPost {
  id: number;
  name: string;
  tagline: string;
  description?: string;
  slug: string;
  votes_count: number;
  comments_count: number;
  created_at: string;
  featured_at?: string;
  screenshot_url?: {
    '850px': string;
  };
  thumbnail?: {
    image_url: string;
  };
  user: {
    name: string;
    username: string;
  };
  topics: Array<{
    name: string;
    slug: string;
  }>;
  makers: Array<{
    name: string;
    username: string;
  }>;
  website?: string;
}

// Removed unused interface

export class ProductHuntService {
  private apiKey: string;
  private baseUrl = 'https://api.producthunt.com/v2/api/graphql';

  constructor() {
    this.apiKey = import.meta.env.VITE_PRODUCT_HUNT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Product Hunt API key not found in environment variables');
    }
  }

  async getLatestTools(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    if (!this.apiKey) {
      console.warn('Product Hunt API key not configured, skipping...');
      return [];
    }

    try {
      // Get posts from today and yesterday
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [todayPosts, yesterdayPosts] = await Promise.all([
        this.getPostsForDate(today),
        this.getPostsForDate(yesterday)
      ]);

      const allPosts = [...todayPosts, ...yesterdayPosts];
      return this.convertToDiscoveredTools(allPosts, filters);
    } catch (error) {
      console.error('Error fetching from Product Hunt:', error);
      return [];
    }
  }

  async getTrendingTools(days: number = 7): Promise<DiscoveredTool[]> {
    if (!this.apiKey) {
      console.warn('Product Hunt API key not configured, skipping...');
      return [];
    }

    try {
      const posts: ProductHuntPost[] = [];
      
      // Get posts for the last N days
      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dayPosts = await this.getPostsForDate(date);
        posts.push(...dayPosts);
      }

      // Filter for high-engagement posts
      const trendingPosts = posts.filter(post => post.votes_count >= 50);
      return this.convertToDiscoveredTools(trendingPosts);
    } catch (error) {
      console.error('Error fetching trending from Product Hunt:', error);
      return [];
    }
  }

  private async getPostsForDate(date: string): Promise<ProductHuntPost[]> {
    const query = `
      query GetPosts($postedAfter: DateTime!, $postedBefore: DateTime!) {
        posts(
          first: 20,
          postedAfter: $postedAfter,
          postedBefore: $postedBefore,
          order: VOTES
        ) {
          edges {
            node {
              id
              name
              tagline
              description
              slug
              votesCount
              commentsCount
              createdAt
              featuredAt
              website
              thumbnail {
                imageUrl
              }
              user {
                name
                username
              }
              topics {
                edges {
                  node {
                    name
                    slug
                  }
                }
              }
              makers {
                edges {
                  node {
                    name
                    username
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      postedAfter: `${date}T00:00:00Z`,
      postedBefore: `${date}T23:59:59Z`
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Product Hunt API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Product Hunt GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Transform GraphQL response to our interface
    return data.data.posts.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      tagline: edge.node.tagline,
      description: edge.node.description,
      slug: edge.node.slug,
      votes_count: edge.node.votesCount,
      comments_count: edge.node.commentsCount,
      created_at: edge.node.createdAt,
      featured_at: edge.node.featuredAt,
      website: edge.node.website,
      thumbnail: edge.node.thumbnail,
      user: edge.node.user,
      topics: edge.node.topics.edges.map((topicEdge: any) => topicEdge.node),
      makers: edge.node.makers.edges.map((makerEdge: any) => makerEdge.node),
    }));
  }

  private convertToDiscoveredTools(posts: ProductHuntPost[], filters?: DiscoveryFilters): DiscoveredTool[] {
    return posts
      .filter(post => this.isRelevantTool(post, filters))
      .map(post => ({
        id: `ph-${post.id}`,
        name: post.name,
        description: post.description || post.tagline,
        website: post.website || `https://www.producthunt.com/posts/${post.slug}`,
        logo: post.thumbnail?.image_url,
        category: this.extractCategory(post.topics),
        pricing: undefined, // Product Hunt doesn't provide pricing info
        tags: [
          ...post.topics.map(topic => topic.name),
          'product-hunt'
        ],
        source: 'product-hunt' as const,
        sourceData: {
          votes: post.votes_count,
          comments: post.comments_count,
          launchDate: post.featured_at || post.created_at,
          author: post.makers.map(maker => maker.name).join(', ') || post.user.name,
          sourceUrl: `https://www.producthunt.com/posts/${post.slug}`,
        },
        discoveredAt: new Date().toISOString(),
        verified: false,
      }));
  }

  private isRelevantTool(post: ProductHuntPost, _filters?: DiscoveryFilters): boolean {
    // Filter out non-software tools
    const irrelevantKeywords = [
      'book', 'course', 'newsletter', 'podcast', 'blog', 'content',
      'physical product', 'clothing', 'food', 'travel', 'finance app'
    ];
    
    const text = `${post.name} ${post.tagline} ${post.description || ''}`.toLowerCase();
    
    if (irrelevantKeywords.some(keyword => text.includes(keyword))) {
      return false;
    }

    // Look for developer/business tool indicators
    const relevantKeywords = [
      'api', 'sdk', 'tool', 'platform', 'software', 'saas', 'developer',
      'productivity', 'automation', 'dashboard', 'analytics', 'monitoring',
      'deployment', 'database', 'framework', 'library', 'extension',
      'integration', 'workflow', 'collaboration', 'management'
    ];

    const hasRelevantKeyword = relevantKeywords.some(keyword => text.includes(keyword));
    const hasTechTopics = post.topics.some(topic => 
      ['developer-tools', 'productivity', 'saas', 'tech', 'web-app', 'api', 'software'].includes(topic.slug)
    );

    return hasRelevantKeyword || hasTechTopics;
  }

  private extractCategory(topics: Array<{ name: string; slug: string }>): string {
    const categoryMap: Record<string, string> = {
      'developer-tools': 'Developer Tools',
      'productivity': 'Productivity',
      'saas': 'SaaS',
      'analytics': 'Analytics',
      'marketing': 'Marketing',
      'design': 'Design',
      'api': 'API',
      'web-app': 'Web App',
      'artificial-intelligence': 'AI/ML',
      'automation': 'Automation',
      'collaboration': 'Collaboration',
      'project-management': 'Project Management',
      'security': 'Security',
      'mobile': 'Mobile',
      'data': 'Data'
    };

    for (const topic of topics) {
      if (categoryMap[topic.slug]) {
        return categoryMap[topic.slug];
      }
    }

    return topics[0]?.name || 'General';
  }

  // Get specific product details
  async getProductDetails(slug: string): Promise<ProductHuntPost | null> {
    if (!this.apiKey) return null;

    const query = `
      query GetPost($slug: String!) {
        post(slug: $slug) {
          id
          name
          tagline
          description
          slug
          votesCount
          commentsCount
          createdAt
          featuredAt
          website
          thumbnail {
            imageUrl
          }
          user {
            name
            username
          }
          topics {
            edges {
              node {
                name
                slug
              }
            }
          }
          makers {
            edges {
              node {
                name
                username
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: { slug } }),
      });

      const data = await response.json();
      return data.data?.post || null;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  }
}