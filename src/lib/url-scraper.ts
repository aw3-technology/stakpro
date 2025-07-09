// URL scraping utility for automatic tool data extraction
interface ScrapedData {
  title?: string;
  description?: string;
  logo?: string;
  category?: string;
  pricing?: {
    type: 'free' | 'freemium' | 'paid';
    startingPrice?: number;
  };
  features?: string[];
  tags?: string[];
  githubUrl?: string;
  documentation?: string;
}

interface ScrapeResult {
  success: boolean;
  data?: ScrapedData;
  error?: string;
}

// Common tool categories and their keywords
const categoryKeywords = {
  'Code Editor': ['editor', 'ide', 'code', 'development environment', 'programming'],
  'Design Tool': ['design', 'ui', 'ux', 'figma', 'sketch', 'prototype', 'mockup'],
  'DevOps': ['deploy', 'docker', 'kubernetes', 'ci/cd', 'pipeline', 'infrastructure'],
  'Database': ['database', 'sql', 'nosql', 'mongodb', 'postgresql', 'redis'],
  'Version Control': ['git', 'github', 'gitlab', 'version control', 'repository'],
  'API Development': ['api', 'rest', 'graphql', 'postman', 'testing', 'endpoint'],
  'Testing': ['test', 'testing', 'automation', 'unit test', 'e2e', 'qa'],
  'Monitoring': ['monitor', 'analytics', 'logging', 'metrics', 'observability'],
  'Security': ['security', 'auth', 'authentication', 'encryption', 'firewall'],
  'Mobile Development': ['mobile', 'ios', 'android', 'react native', 'flutter'],
  'Data Science': ['data', 'analytics', 'machine learning', 'ai', 'jupyter'],
  'Productivity': ['productivity', 'task', 'project management', 'collaboration'],
  'Communication': ['chat', 'messaging', 'video', 'collaboration', 'team'],
  'Cloud Platform': ['cloud', 'aws', 'azure', 'gcp', 'hosting', 'serverless'],
  'Framework': ['framework', 'library', 'react', 'vue', 'angular', 'node'],
};

// Pricing keywords
const pricingKeywords = {
  free: ['free', 'open source', 'no cost', '0$', '$0'],
  freemium: ['freemium', 'free plan', 'free tier', 'premium', 'pro plan'],
  paid: ['paid', 'subscription', 'premium only', 'enterprise', 'starting at']
};

// Multiple proxy services for better reliability
const proxyServices = [
  {
    name: 'allorigins',
    url: (targetUrl: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
    extractContent: (data: any) => data.contents
  },
  {
    name: 'cors-anywhere',
    url: (targetUrl: string) => `https://cors-anywhere.herokuapp.com/${targetUrl}`,
    extractContent: (data: any) => data
  },
  {
    name: 'thingproxy',
    url: (targetUrl: string) => `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
    extractContent: (data: any) => data
  }
];

// Try multiple proxy services with timeout
async function fetchWithProxy(url: string, timeout = 10000): Promise<string | null> {
  for (const proxy of proxyServices) {
    try {
      console.log(`Trying proxy: ${proxy.name}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(proxy.url(url), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Proxy ${proxy.name} failed with status: ${response.status}`);
        continue;
      }
      
      const data = await response.text();
      const html = proxy.extractContent(data);
      
      if (html && html.length > 100) { // Basic validation that we got HTML content
        console.log(`Successfully fetched with ${proxy.name}`);
        return html;
      }
      
    } catch (error) {
      console.warn(`Proxy ${proxy.name} failed:`, error);
      continue;
    }
  }
  
  return null;
}

export const scrapeToolData = async (url: string): Promise<ScrapeResult> => {
  try {
    // Validate URL
    new URL(url);
    
    // Try to fetch with multiple proxy services
    const html = await fetchWithProxy(url);
    
    if (!html) {
      throw new Error('All proxy services failed');
    }
    
    // Parse HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const scrapedData: ScrapedData = {};
    
    // Extract title
    scrapedData.title = extractTitle(doc, url);
    
    // Extract description
    scrapedData.description = extractDescription(doc);
    
    // Extract logo
    scrapedData.logo = extractLogo(doc, url);
    
    // Detect category
    scrapedData.category = detectCategory(doc, scrapedData.title, scrapedData.description);
    
    // Detect pricing
    scrapedData.pricing = detectPricing(doc);
    
    // Extract features
    scrapedData.features = extractFeatures(doc);
    
    // Generate tags
    scrapedData.tags = generateTags(scrapedData.title, scrapedData.description, scrapedData.category);
    
    // Look for GitHub link
    scrapedData.githubUrl = extractGithubUrl(doc);
    
    // Look for documentation
    scrapedData.documentation = extractDocumentationUrl(doc, url);
    
    return {
      success: true,
      data: scrapedData
    };
    
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scrape website'
    };
  }
};

// Fallback method using just URL analysis
export const analyzeUrlOnly = (url: string): ScrapedData => {
  const domain = new URL(url).hostname.replace('www.', '');
  const domainParts = domain.split('.');
  const name = domainParts[0];
  
  // Capitalize first letter and handle common patterns
  let title = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Handle common naming patterns
  if (name.includes('-')) {
    title = name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  } else if (name.includes('.')) {
    title = name.split('.').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  // Enhanced category detection from domain
  let category = 'Other';
  const lowerDomain = domain.toLowerCase();
  const pathname = new URL(url).pathname.toLowerCase();
  const fullText = `${lowerDomain} ${pathname}`;
  
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => fullText.includes(keyword.toLowerCase()))) {
      category = cat;
      break;
    }
  }
  
  // Generate better description based on domain
  let description = `Software tool from ${domain}`;
  if (category !== 'Other') {
    description = `${title} - A ${category.toLowerCase()} tool`;
  }
  
  // Generate basic features based on category
  const features: string[] = [];
  if (category === 'Code Editor') {
    features.push('Code editing', 'Syntax highlighting', 'File management');
  } else if (category === 'Design Tool') {
    features.push('Design creation', 'Prototyping', 'Collaboration');
  } else if (category === 'DevOps') {
    features.push('Deployment automation', 'CI/CD pipelines', 'Infrastructure management');
  } else if (category === 'Database') {
    features.push('Data storage', 'Query management', 'Database administration');
  } else {
    features.push('Core functionality', 'User interface', 'Performance optimization');
  }
  
  // Generate relevant tags
  const tags = [name.toLowerCase(), domain.split('.')[0]];
  if (category !== 'Other') {
    tags.push(category.toLowerCase().replace(' ', '-'));
  }
  
  return {
    title,
    description,
    category,
    pricing: { type: 'freemium' }, // Default assumption
    tags,
    features
  };
};

// Helper functions
function extractTitle(doc: Document, url: string): string {
  // Try multiple sources for title
  const titleSources = [
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
    doc.querySelector('title')?.textContent,
    doc.querySelector('h1')?.textContent,
  ];
  
  for (const title of titleSources) {
    if (title && title.trim()) {
      return cleanText(title);
    }
  }
  
  // Fallback to domain name
  const domain = new URL(url).hostname.replace('www.', '');
  return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
}

function extractDescription(doc: Document): string {
  const descSources = [
    doc.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
    doc.querySelector('meta[name="description"]')?.getAttribute('content'),
    doc.querySelector('.hero p, .intro p, .description')?.textContent,
  ];
  
  for (const desc of descSources) {
    if (desc && desc.trim() && desc.length > 20) {
      return cleanText(desc);
    }
  }
  
  return '';
}

function extractLogo(doc: Document, url: string): string {
  const logoSources = [
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
    doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href'),
    doc.querySelector('link[rel="icon"]')?.getAttribute('href'),
    doc.querySelector('.logo img, .brand img, .header img')?.getAttribute('src'),
  ];
  
  for (const logo of logoSources) {
    if (logo) {
      // Convert relative URLs to absolute
      if (logo.startsWith('/')) {
        const baseUrl = new URL(url);
        return `${baseUrl.protocol}//${baseUrl.host}${logo}`;
      }
      if (logo.startsWith('http')) {
        return logo;
      }
    }
  }
  
  return '';
}

function detectCategory(doc: Document, title?: string, description?: string): string {
  const content = `${title} ${description} ${doc.body?.textContent?.substring(0, 1000)}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => content.includes(keyword.toLowerCase()));
    if (matches.length >= 1) {
      return category;
    }
  }
  
  return 'Other';
}

function detectPricing(doc: Document): { type: 'free' | 'freemium' | 'paid'; startingPrice?: number } {
  const content = doc.body?.textContent?.toLowerCase() || '';
  
  // Look for pricing indicators
  for (const [type, keywords] of Object.entries(pricingKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return { type: type as 'free' | 'freemium' | 'paid' };
    }
  }
  
  // Look for price patterns
  const pricePattern = /\$(\d+)/g;
  const prices = [...content.matchAll(pricePattern)];
  if (prices.length > 0) {
    const price = parseInt(prices[0][1]);
    return {
      type: 'paid',
      startingPrice: price
    };
  }
  
  return { type: 'freemium' }; // Default
}

function extractFeatures(doc: Document): string[] {
  const features: string[] = [];
  
  // Look for feature lists
  const featureLists = doc.querySelectorAll('ul li, .features li, .feature-list li');
  featureLists.forEach(item => {
    const text = item.textContent?.trim();
    if (text && text.length > 5 && text.length < 100) {
      features.push(cleanText(text));
    }
  });
  
  return features.slice(0, 5); // Limit to 5 features
}

function generateTags(title?: string, description?: string, category?: string): string[] {
  const tags: string[] = [];
  const content = `${title} ${description}`.toLowerCase();
  
  // Add category-based tags
  if (category && category !== 'Other') {
    tags.push(category.toLowerCase().replace(' ', '-'));
  }
  
  // Extract common tech terms
  const techTerms = [
    'react', 'vue', 'angular', 'node', 'python', 'javascript', 'typescript',
    'api', 'rest', 'graphql', 'sql', 'nosql', 'cloud', 'aws', 'docker',
    'kubernetes', 'git', 'github', 'open-source', 'saas', 'web', 'mobile'
  ];
  
  techTerms.forEach(term => {
    if (content.includes(term)) {
      tags.push(term);
    }
  });
  
  return [...new Set(tags)].slice(0, 5); // Remove duplicates and limit
}

function extractGithubUrl(doc: Document): string {
  const links = doc.querySelectorAll('a[href*="github.com"]');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href && href.includes('github.com')) {
      return href;
    }
  }
  return '';
}

function extractDocumentationUrl(doc: Document, baseUrl: string): string {
  const docKeywords = ['docs', 'documentation', 'api', 'guide', 'help'];
  const links = doc.querySelectorAll('a');
  
  for (const link of links) {
    const href = link.getAttribute('href');
    const text = link.textContent?.toLowerCase() || '';
    
    if (href && docKeywords.some(keyword => 
      text.includes(keyword) || href.includes(keyword)
    )) {
      // Convert relative to absolute URL
      if (href.startsWith('/')) {
        const base = new URL(baseUrl);
        return `${base.protocol}//${base.host}${href}`;
      }
      if (href.startsWith('http')) {
        return href;
      }
    }
  }
  
  return '';
}

function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').substring(0, 500);
}