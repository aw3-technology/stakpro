# Discovery Service Documentation

The Discovery Service automatically finds and catalogs cutting-edge software tools from multiple sources across the web. This service integrates with 5 major platforms to continuously discover new tools and keep your database up-to-date.

## 🔌 **Integrated Platforms**

### 1. **Product Hunt** 🚀
- **Data Source**: Daily product launches and trending tools
- **API**: GraphQL API v2
- **Setup**: Create account at [Product Hunt API](https://api.producthunt.com/v2/oauth/applications)
- **Data Quality**: High (curated launches, vote counts, maker info)
- **Rate Limits**: 1000 requests/hour
- **Best For**: New product launches, trending consumer/business tools

### 2. **GitHub Trending** ⭐
- **Data Source**: Trending repositories and new developer tools
- **API**: GitHub REST API v3
- **Setup**: Create Personal Access Token at [GitHub Settings](https://github.com/settings/tokens)
- **Permissions**: `public_repo` (read access to public repositories)
- **Data Quality**: High (star counts, language info, topics)
- **Rate Limits**: 5000 requests/hour (authenticated)
- **Best For**: Open source tools, CLI tools, frameworks, libraries

### 3. **Hacker News** 📰
- **Data Source**: Show HN posts and trending developer discussions
- **API**: Firebase REST API (public)
- **Setup**: No authentication required
- **Data Quality**: Medium (community-driven, high engagement)
- **Rate Limits**: No official limits (be respectful)
- **Best For**: Developer tools, technical innovations, community feedback

### 4. **Reddit** 🔗
- **Data Source**: Tool submissions from developer subreddits
- **API**: Reddit API (public endpoints used)
- **Setup**: Optional - can use public API without auth
- **Subreddits**: r/SideProject, r/entrepreneur, r/webdev, r/programming, etc.
- **Data Quality**: Medium (community submissions, varied quality)
- **Rate Limits**: 60 requests/minute (public API)
- **Best For**: Side projects, indie tools, community-built solutions

### 5. **AngelList/Wellfound** 💼
- **Data Source**: Startup directory and recently funded companies
- **API**: AngelList API v1
- **Setup**: Contact AngelList for API access (enterprise)
- **Data Quality**: High (verified startups, funding info)
- **Rate Limits**: Custom (enterprise agreement)
- **Best For**: B2B tools, enterprise software, funded startups

## 🚀 **Getting Started**

### 1. **Environment Setup**

Copy the API keys to your `.env` file:

```bash
# Required
VITE_PERPLEXITY_API_KEY=your_perplexity_key

# Discovery APIs (at least one recommended)
VITE_PRODUCT_HUNT_API_KEY=your_product_hunt_key
VITE_GITHUB_TOKEN=your_github_token

# Optional
VITE_REDDIT_CLIENT_ID=your_reddit_client_id
VITE_REDDIT_CLIENT_SECRET=your_reddit_client_secret
VITE_ANGELLIST_ACCESS_TOKEN=your_angellist_token
```

### 2. **Test the Service**

Visit the admin interface to test discovery:
```
http://localhost:5174/admin/discovery
```

### 3. **Basic Usage**

```typescript
import { discoveryService } from '@/lib/discovery-service';

// Discover from all sources
const tools = await discoveryService.discoverTools();

// Discover from specific sources
const phTools = await discoveryService.discoverFromSource('product-hunt');

// Search by keyword
const aiTools = await discoveryService.searchByKeyword('AI tools');

// Daily discovery job
const dailyResults = await discoveryService.runDailyDiscovery();
```

## 🔧 **API Reference**

### **Main Methods**

#### `discoverTools(filters?: DiscoveryFilters)`
Discovers tools from all configured sources.

```typescript
const tools = await discoveryService.discoverTools({
  sources: ['product-hunt', 'github'],
  minVotes: 10,
  dateRange: {
    from: '2024-01-01',
    to: '2024-12-31'
  },
  categories: ['developer-tools'],
  keywords: ['productivity']
});
```

#### `runDailyDiscovery()`
Automated daily discovery job for scheduled execution.

```typescript
const result = await discoveryService.runDailyDiscovery();
console.log(`Found ${result.total} new tools`);
console.log('By source:', result.bySource);
```

#### `runWeeklyTrendingDiscovery()`
Finds trending tools from the past week with higher engagement thresholds.

#### `searchByKeyword(keyword: string)`
Cross-platform keyword search.

### **Filters**

```typescript
interface DiscoveryFilters {
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
```

### **Discovered Tool Schema**

```typescript
interface DiscoveredTool {
  id: string;                    // Unique identifier
  name: string;                  // Tool name
  description: string;           // Tool description
  website: string;               // Tool website or source URL
  logo?: string;                 // Logo/thumbnail URL
  category?: string;             // Auto-categorized
  pricing?: string;              // Pricing model if detected
  tags: string[];                // Technology/feature tags
  source: string;                // Origin platform
  sourceData: {
    votes?: number;              // Upvotes/stars
    comments?: number;           // Comment count
    author?: string;             // Creator/company
    sourceUrl: string;           // Original post URL
  };
  discoveredAt: string;          // ISO timestamp
  verified: boolean;             // Auto-verification based on engagement
}
```

## 🎯 **Discovery Strategies**

### **Content Filtering**

Each source implements smart filtering to identify relevant tools:

- **Keyword Detection**: API, tool, platform, SaaS, developer, productivity
- **Category Filtering**: Developer tools, productivity, business software
- **Engagement Thresholds**: Minimum votes/stars to filter quality
- **Duplicate Detection**: Cross-platform deduplication by URL/name
- **Quality Scoring**: Engagement + completeness + recency algorithm

### **Categorization**

Automatic categorization using pattern matching:

- **Developer Tools**: CLI, API, framework, library, SDK
- **Productivity**: Task management, automation, workflow
- **Analytics**: Dashboard, metrics, business intelligence
- **Design**: UI/UX, prototyping, graphics
- **DevOps**: Deployment, monitoring, infrastructure
- **Security**: Authentication, encryption, vulnerability
- **AI/ML**: Machine learning, neural networks, AI tools

### **Verification**

Tools are automatically verified based on:
- **High engagement**: >100 votes/stars
- **Complete data**: Logo, description, website
- **Trusted sources**: Verified accounts, known domains
- **Community feedback**: Comments and discussions

## 📊 **Performance & Limits**

### **Rate Limiting**
- **GitHub**: 5000 req/hour (authenticated)
- **Product Hunt**: 1000 req/hour
- **Reddit**: 60 req/minute (public)
- **Hacker News**: No official limits
- **AngelList**: Custom enterprise limits

### **Recommended Schedule**
- **Daily Discovery**: Every 24 hours for new tools
- **Trending Discovery**: Weekly for popular tools
- **Keyword Search**: On-demand for specific needs

### **Data Volume**
- **Typical Daily Yield**: 20-50 new tools across all sources
- **Peak Days**: 100+ tools (during major launches/events)
- **Quality Filter**: ~70% of raw discoveries pass quality filters

## 🔍 **Admin Interface**

The admin interface (`/admin/discovery`) provides:

### **Discovery Controls**
- Source selection (checkboxes for each platform)
- Filter configuration (votes, dates, categories)
- One-click discovery execution
- Real-time progress tracking

### **Search Tools**
- Cross-platform keyword search
- Preset search queries for common categories
- Live result filtering

### **Results Display**
- Rich tool cards with logos, descriptions, tags
- Source indicators with engagement metrics
- Direct links to tools and source posts
- Verification status badges

### **Statistics Dashboard**
- Total tools discovered
- Weekly discovery trends
- Source performance metrics
- Top categories breakdown

## 🛠 **Troubleshooting**

### **Common Issues**

#### "API key not configured"
- Check your `.env` file has the correct variable names
- Ensure API keys are valid and not expired
- Restart development server after adding keys

#### "Rate limit exceeded"
- Reduce discovery frequency
- Implement exponential backoff (built-in)
- Check API quota usage on platform dashboards

#### "No tools found"
- Verify internet connection
- Check API endpoints are accessible
- Review filter criteria (too restrictive)
- Check platform API status pages

#### "Discovery fails silently"
- Check browser console for errors
- Verify CORS settings for APIs
- Test individual sources in admin interface

### **API Status Pages**
- [GitHub Status](https://www.githubstatus.com/)
- [Reddit Status](https://reddit.statuspage.io/)
- Product Hunt: Check their developer documentation
- Hacker News: Usually reliable (Firebase-hosted)

## 🚀 **Production Deployment**

### **Environment Variables**
Ensure all required API keys are set in production:

```bash
# Vercel/Netlify
vercel env add VITE_PRODUCT_HUNT_API_KEY
vercel env add VITE_GITHUB_TOKEN
vercel env add VITE_PERPLEXITY_API_KEY

# Railway/Render
# Add through their dashboard or CLI
```

### **Scheduled Jobs**
Consider setting up scheduled discovery jobs:

```typescript
// Example cron job (Node.js)
import cron from 'node-cron';

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  const result = await discoveryService.runDailyDiscovery();
  console.log(`Daily discovery: ${result.total} tools found`);
});
```

### **Monitoring**
- Track API usage and quotas
- Monitor discovery success rates
- Set up alerts for failed discoveries
- Log tool quality metrics

## 📈 **Future Enhancements**

### **Planned Features**
- **ML-based categorization**: Improve auto-categorization accuracy
- **Sentiment analysis**: Extract user feedback sentiment
- **Price tracking**: Monitor pricing changes over time
- **Integration webhooks**: Real-time notifications
- **Custom sources**: User-defined RSS feeds, newsletters
- **Duplicate prevention**: Advanced similarity detection
- **Quality scoring**: ML-based tool quality assessment

### **Additional Sources**
- **IndieHackers**: Indie maker community
- **Betalist**: Beta startup launches
- **Launching Next**: Pre-launch validation
- **DevHunt**: Developer-focused products
- **ToolHunt**: Business tool aggregator

## 🤝 **Contributing**

To add new discovery sources:

1. Create integration file in `/src/lib/integrations/`
2. Implement the required interface methods
3. Add source to main discovery service
4. Update filters and UI components
5. Add tests and documentation

Example integration structure:
```typescript
export class NewSourceService {
  async getLatestTools(filters?: DiscoveryFilters): Promise<DiscoveredTool[]> {
    // Implementation
  }
  
  private convertToDiscoveredTools(rawData: any[]): DiscoveredTool[] {
    // Convert source data to standard format
  }
}
```

---

## 📞 **Support**

For issues with the Discovery Service:
1. Check this documentation
2. Test individual sources in admin interface
3. Verify API keys and quotas
4. Check platform status pages
5. Create an issue with detailed error logs

The Discovery Service is designed to be robust and fault-tolerant, gracefully handling API failures and rate limits while maximizing tool discovery across all available sources.