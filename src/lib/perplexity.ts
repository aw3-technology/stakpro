// Perplexity AI Integration Service

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PerplexityService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor() {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    if (!apiKey) {
      console.warn('Perplexity API key not found in environment variables');
    }
    console.log('Perplexity API key configured:', apiKey ? 'Yes' : 'No');
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: PerplexityRequest): Promise<PerplexityResponse> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Get AI-powered tool recommendations based on user requirements
  async getToolRecommendations(requirements: string, currentTools: string[] = []): Promise<string> {
    const systemPrompt = `You are an expert software tool advisor. Based on the user's requirements, recommend the best software tools and explain why they would be suitable. Focus on practical, widely-used tools that solve real problems. If the user already has some tools, consider how new recommendations would complement them.`;

    const userPrompt = `I need software tool recommendations for: ${requirements}${
      currentTools.length > 0 ? `\n\nI'm already using: ${currentTools.join(', ')}` : ''
    }\n\nPlease recommend 3-5 tools with brief explanations of why each would be helpful.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro', // Using Sonar Pro model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message.content || 'Unable to generate recommendations';
    } catch (error) {
      console.error('Error getting tool recommendations:', error);
      throw error;
    }
  }

  // Analyze a tool based on its description and features
  async analyzeToolDetails(
    toolName: string,
    description: string,
    features: string[],
    useCase?: string
  ): Promise<string> {
    const prompt = `Analyze the software tool "${toolName}" and provide insights:

Description: ${description}
Features: ${features.join(', ')}
${useCase ? `Use Case: ${useCase}` : ''}

Please provide:
1. Key strengths of this tool
2. Potential limitations or considerations
3. Best use cases and target users
4. Similar alternatives to consider
5. Integration possibilities with other tools`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 800,
      });

      return response.choices[0]?.message.content || 'Unable to analyze tool';
    } catch (error) {
      console.error('Error analyzing tool:', error);
      throw error;
    }
  }

  // Compare multiple tools
  async compareTools(tools: Array<{ name: string; description: string; pricing: string }>): Promise<string> {
    const toolList = tools.map(t => `- ${t.name}: ${t.description} (${t.pricing})`).join('\n');
    
    const prompt = `Compare these software tools and help me choose:

${toolList}

Please provide:
1. A comparison table of key features
2. Pros and cons of each tool
3. Pricing value analysis
4. Recommendation based on different use cases`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'llama-3-sonar-small-32k',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1200,
      });

      return response.choices[0]?.message.content || 'Unable to compare tools';
    } catch (error) {
      console.error('Error comparing tools:', error);
      throw error;
    }
  }

  // Generate a tool stack recommendation
  async generateToolStack(projectType: string, teamSize: string, budget: string): Promise<string> {
    const prompt = `Create a complete software tool stack recommendation for:

Project Type: ${projectType}
Team Size: ${teamSize}
Budget: ${budget}

Please recommend a complete stack including:
1. Development tools (IDE, version control)
2. Collaboration tools
3. Project management
4. CI/CD and deployment
5. Monitoring and analytics
6. Any other relevant tools

For each tool, briefly explain why it's included and how it fits the requirements.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return response.choices[0]?.message.content || 'Unable to generate tool stack';
    } catch (error) {
      console.error('Error generating tool stack:', error);
      throw error;
    }
  }

  // Enhanced search with AI understanding
  async enhanceSearchQuery(userQuery: string): Promise<string[]> {
    const prompt = `The user is searching for software tools with this query: "${userQuery}"

Generate 5-7 related search terms that would help find relevant tools. Include:
- Synonyms and related terms
- Category names
- Specific tool features
- Common tool names in this space

Return only a comma-separated list of search terms.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message.content || '';
      return content.split(',').map(term => term.trim()).filter(Boolean);
    } catch (error) {
      console.error('Error enhancing search:', error);
      return [userQuery]; // Fallback to original query
    }
  }

  // Get latest tool trends and insights
  async getToolTrends(category?: string): Promise<string> {
    const prompt = `What are the latest trends and developments in ${
      category ? `${category} software tools` : 'software development tools'
    }? Include:

1. Emerging tools gaining popularity
2. New features in established tools
3. Industry shifts and patterns
4. AI/automation trends
5. Open source vs proprietary trends

Keep it concise and practical for developers.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro', // Using Sonar Pro model
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      return response.choices[0]?.message.content || 'Unable to fetch trends';
    } catch (error) {
      console.error('Error getting tool trends:', error);
      throw error;
    }
  }

  // Search for tools online when database search returns no results
  async searchToolsOnline(query: string): Promise<{
    tools: Array<{
      name: string;
      description: string;
      website?: string;
      category?: string;
      pricing?: string;
    }>;
    summary: string;
  }> {
    const systemPrompt = `You are a software tool discovery expert. Search the web for software tools that match the user's query. Return a JSON response with this exact structure:
{
  "tools": [
    {
      "name": "Tool Name",
      "description": "Brief description of what the tool does and its key features",
      "website": "https://toolwebsite.com",
      "category": "Category Name",
      "pricing": "Free/Paid/Freemium/etc"
    }
  ],
  "summary": "Brief summary of the search results and why these tools match the query"
}

Focus on popular, well-established tools. Include 3-5 relevant tools maximum.`;

    const userPrompt = `Find software tools for: ${query}

Please search the web and return information about relevant software tools in the JSON format specified.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro', // Using Sonar Pro model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more structured responses
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message.content || '';
      
      // Try to parse JSON response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            tools: parsed.tools || [],
            summary: parsed.summary || 'Found tools matching your search.'
          };
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, falling back to text format');
      }

      // Fallback: return raw content as summary
      return {
        tools: [],
        summary: content || 'No tools found for your search query.'
      };
    } catch (error) {
      console.error('Error searching tools online:', error);
      throw error;
    }
  }

  // Advanced contextual analysis for sophisticated discovery
  async analyzeUserContext(userMessage: string): Promise<string> {
    const systemPrompt = `You are an expert software consultant with deep knowledge of business needs, technology stacks, and implementation challenges. Your role is to provide sophisticated, contextual analysis that goes beyond simple feature matching.

When analyzing user requirements:
1. CONTEXT UNDERSTANDING: Infer team size, industry, technical expertise, budget constraints, and existing tech stack from clues in their message
2. INTELLIGENT QUESTIONING: Ask 2-3 highly targeted clarifying questions that will significantly impact recommendations
3. TRADE-OFF ANALYSIS: Explain key decision factors and trade-offs they should consider
4. IMPLEMENTATION REALITY: Address practical concerns like adoption challenges, learning curves, and integration complexity
5. TOTAL COST PERSPECTIVE: Consider not just license costs but implementation, training, and maintenance costs
6. FUTURE-PROOFING: Consider scalability and long-term viability

Respond in a conversational, consultative tone as if you're an experienced colleague providing strategic guidance. Be specific and actionable.`;

    const userPrompt = `User request: "${userMessage}"

Provide a contextual analysis and initial recommendations. Structure your response as:

**Context Analysis:** What I understand about your situation
**Key Considerations:** Important factors for your decision
**Initial Recommendations:** 2-3 specific tools with brief rationale
**Strategic Questions:** 2-3 targeted questions to refine recommendations

Keep it concise but insightful - aim for the depth of an experienced consultant's initial assessment.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      });

      return response.choices[0]?.message.content || 'Unable to analyze context';
    } catch (error) {
      console.error('Error analyzing user context:', error);
      throw error;
    }
  }

  // Implementation guidance and complexity analysis
  async analyzeImplementation(tools: string[], context: string): Promise<string> {
    const systemPrompt = `You are a technical implementation expert who understands the practical realities of software adoption. Provide realistic timelines, common pitfalls, and success strategies.

Focus on:
- Realistic implementation timelines
- Technical complexity and prerequisites
- Change management and user adoption challenges
- Integration requirements and potential conflicts
- Resource requirements (time, people, expertise)
- Success metrics and milestone planning
- Common failure modes and how to avoid them`;

    const userPrompt = `Analyze implementation for these tools: ${tools.join(', ')}
Context: ${context}

Provide practical implementation guidance covering timeline, complexity, and success factors.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1000,
      });

      return response.choices[0]?.message.content || 'Unable to analyze implementation';
    } catch (error) {
      console.error('Error analyzing implementation:', error);
      throw error;
    }
  }

  // Total cost of ownership analysis
  async analyzeTotalCost(tools: string[], teamSize: string, projectedGrowth: string): Promise<string> {
    const systemPrompt = `You are a financial analyst specializing in software ROI and total cost of ownership. Provide comprehensive cost analysis beyond just license fees.

Consider:
- Direct costs (licenses, subscriptions, hardware)
- Indirect costs (training, implementation, integration)
- Ongoing costs (support, maintenance, upgrades)
- Hidden costs (productivity loss during transition, customization)
- Scale economics and pricing tiers
- ROI timeline and break-even analysis
- Cost comparison between alternatives`;

    const userPrompt = `Analyze total cost of ownership for: ${tools.join(', ')}
Team size: ${teamSize}
Projected growth: ${projectedGrowth}

Provide a realistic TCO analysis with both costs and potential ROI.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      return response.choices[0]?.message.content || 'Unable to analyze costs';
    } catch (error) {
      console.error('Error analyzing costs:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const perplexity = new PerplexityService();

// Export types for use in components
export type { PerplexityMessage, PerplexityRequest, PerplexityResponse };