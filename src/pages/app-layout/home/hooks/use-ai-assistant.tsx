import { Message } from '@/components/custom/chat-container';
import { perplexity } from '@/lib/perplexity';
import { searchTools } from '@/lib/tool-api';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, Search, Layers, Loader2, ExternalLink, Star } from 'lucide-react';


// Helper function to create tool card component
const createToolCard = (tool: SoftwareToolModel & { id: number }) => (
  <Card key={tool.id} className="border border-border/50 hover:border-border transition-colors">
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        {tool.logo && (
          <img 
            src={tool.logo} 
            alt={`${tool.name} logo`} 
            className="w-8 h-8 object-contain rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm truncate">{tool.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs text-foreground/60">{tool.rating}</span>
            </div>
          </div>
          <p className="text-xs text-foreground/70 mb-2 line-clamp-2">{tool.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tool.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => window.open(tool.website, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const useAIAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processUserMessage = useCallback(async (message: string, setMessages: React.Dispatch<React.SetStateAction<Message[]>>): Promise<Message[]> => {
    setIsProcessing(true);
    const messages: Message[] = [];

    try {
      // Analyze the user's intent
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('need')) {
        // Tool recommendation flow
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="font-medium">AI Tool Recommendations</span>
              </div>
              <p className="text-sm text-foreground/70">
                I'll help you find the perfect tools for your needs. Analyzing your requirements...
              </p>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                Getting personalized recommendations...
              </div>
            </div>
          ),
        });

        // Get contextual analysis instead of basic recommendations
        const contextualAnalysis = await perplexity.analyzeUserContext(message);

        // Enhanced search using AI keywords
        const searchKeywords = await perplexity.enhanceSearchQuery(message);
        const searchPromises = searchKeywords.slice(0, 3).map(keyword => searchTools(keyword));
        const searchResults = await Promise.allSettled(searchPromises);
        
        // Combine and deduplicate results
        const foundTools = new Map<number, SoftwareToolModel & { id: number }>();
        searchResults.forEach(result => {
          if (result.status === 'fulfilled') {
            result.value.slice(0, 3).forEach(tool => {
              foundTools.set(tool.id, tool);
            });
          }
        });

        const relevantTools = Array.from(foundTools.values()).slice(0, 6);
        
        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(contextualAnalysis) }} />
              </div>

              {/* Show relevant tools from our database */}
              {relevantTools.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Tools in Our Database</span>
                    <Badge variant="secondary" className="text-xs">
                      {relevantTools.length} found
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relevantTools.map(tool => createToolCard(tool))}
                  </div>
                </div>
              )}

              {/* Enhanced action buttons based on sophisticated discovery */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const event = new CustomEvent('ai-followup', { 
                      detail: { message: 'Give me targeted recommendations based on my specific context' }
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Targeted Recommendations
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const event = new CustomEvent('ai-followup', { 
                      detail: { message: 'Compare the trade-offs between these recommended tools' }
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Compare Trade-offs
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const event = new CustomEvent('ai-followup', { 
                      detail: { message: 'Analyze implementation complexity and timeline for these tools' }
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  Implementation Analysis
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const event = new CustomEvent('ai-followup', { 
                      detail: { message: 'Calculate total cost of ownership for these tools' }
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  Cost Analysis
                </Button>
              </div>

              {/* Browse and search options */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Button size="sm" variant="ghost" onClick={() => window.location.href = '/explore'}>
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Tools
                </Button>
                {searchKeywords.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => window.location.href = `/explore?search=${encodeURIComponent(searchKeywords[0])}`}
                  >
                    Search "{searchKeywords[0]}"
                  </Button>
                )}
              </div>
            </div>
          ),
        });
      } else if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('versus')) {
        // Tool comparison flow - try to find mentioned tools
        const toolNames = message.split(/\s+(?:vs|versus|and|,|\|)\s+/i);
        const searchPromises = toolNames.map(name => searchTools(name.trim()));
        const searchResults = await Promise.allSettled(searchPromises);
        
        const foundTools: (SoftwareToolModel & { id: number })[] = [];
        searchResults.forEach(result => {
          if (result.status === 'fulfilled' && result.value.length > 0) {
            foundTools.push(result.value[0]); // Take the best match
          }
        });

        if (foundTools.length >= 2) {
          // We found tools to compare
          messages.push({
            id: Date.now(),
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Tool Comparison</span>
                </div>
                <p className="text-sm text-foreground/70">
                  I found these tools in our database. Let me get an AI-powered comparison for you...
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {foundTools.slice(0, 4).map(tool => createToolCard(tool))}
                </div>
              </div>
            ),
          });

          // Get AI comparison
          const toolsForComparison = foundTools.map(tool => ({
            name: tool.name,
            description: tool.description,
            pricing: tool.pricing.type === 'free' ? 'Free' : 
                    tool.pricing.type === 'freemium' ? 'Freemium' :
                    tool.pricing.startingPrice ? `$${tool.pricing.startingPrice}/${tool.pricing.billingPeriod || 'month'}` : 'Paid'
          }));

          const comparison = await perplexity.compareTools(toolsForComparison);
          
          messages.push({
            id: Date.now() + 1,
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(comparison) }} />
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.href = `/explore?compare=${foundTools.map(t => t.id).join(',')}`}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Compare in Detail
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => window.location.href = '/explore'}>
                    Find More Tools
                  </Button>
                </div>
              </div>
            ),
          });
        } else {
          // Fallback for when we can't find specific tools
          messages.push({
            id: Date.now(),
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Tool Comparison</span>
                </div>
                <p className="text-sm text-foreground/70">
                  I couldn't find specific tools matching your request in our database. Try being more specific with tool names, like:
                </p>
                <div className="space-y-1 text-sm text-foreground/60">
                  <p>• "Compare VS Code vs Sublime Text"</p>
                  <p>• "Docker vs Kubernetes"</p>
                  <p>• "React vs Vue vs Angular"</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'}>
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Tools
                </Button>
              </div>
            ),
          });
        }
      } else if (lowerMessage.includes('implementation') && (lowerMessage.includes('analysis') || lowerMessage.includes('complexity') || lowerMessage.includes('timeline'))) {
        // Implementation analysis flow
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing implementation complexity and requirements...
            </div>
          ),
        });

        // Extract tool names from the message context
        const toolNames = message.split(/\b(?:for|with|using|of)\s+/i).pop()?.split(/\s*,\s*|\s+and\s+|\s+or\s+/) || [];
        const implementationAnalysis = await perplexity.analyzeImplementation(toolNames, message);
        
        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-500" />
                <span className="font-medium">Implementation Analysis</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(implementationAnalysis) }} />
              </div>
            </div>
          ),
        });
      } else if (lowerMessage.includes('cost') && (lowerMessage.includes('analysis') || lowerMessage.includes('ownership') || lowerMessage.includes('calculate'))) {
        // Cost analysis flow
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating total cost of ownership...
            </div>
          ),
        });

        // Extract context from the message
        const toolNames = message.split(/\b(?:for|with|using|of)\s+/i).pop()?.split(/\s*,\s*|\s+and\s+|\s+or\s+/) || [];
        const teamSize = message.match(/(\d+)\s*(?:person|people|developer|team|member)/i)?.[1] || 'small team';
        const growth = message.includes('scale') || message.includes('grow') ? 'expecting growth' : 'stable size';
        
        const costAnalysis = await perplexity.analyzeTotalCost(toolNames, teamSize, growth);
        
        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-medium">Total Cost Analysis</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(costAnalysis) }} />
              </div>
            </div>
          ),
        });
      } else if (lowerMessage.includes('targeted') && lowerMessage.includes('recommendation')) {
        // Targeted recommendations based on context
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your context for targeted recommendations...
            </div>
          ),
        });

        const targetedRecommendations = await perplexity.getToolRecommendations(message);
        
        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Targeted Recommendations</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(targetedRecommendations) }} />
              </div>
            </div>
          ),
        });
      } else if (lowerMessage.includes('trade-off') || (lowerMessage.includes('compare') && lowerMessage.includes('trade'))) {
        // Trade-off analysis between tools
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing trade-offs between recommended tools...
            </div>
          ),
        });

        // Try to identify tools from context or use general comparison
        const tradeOffAnalysis = await perplexity.getToolRecommendations(`${message} - focus on trade-offs and decision factors`);
        
        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Trade-off Analysis</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(tradeOffAnalysis) }} />
              </div>
            </div>
          ),
        });
      } else if (lowerMessage.includes('trends') || lowerMessage.includes('latest') || lowerMessage.includes('popular')) {
        // Trends analysis
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing latest tool trends...
            </div>
          ),
        });

        const trends = await perplexity.getToolTrends();
        
        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-medium">Latest Tool Trends</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(trends) }} />
              </div>
            </div>
          ),
        });
      } else if (lowerMessage.includes('stack') || lowerMessage.includes('setup')) {
        // Tool stack generation
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-500" />
                <span className="font-medium">Tool Stack Builder</span>
              </div>
              <p className="text-sm text-foreground/70">
                I can help you build a complete tool stack. Please provide:
              </p>
              <ul className="text-sm text-foreground/60 list-disc list-inside">
                <li>Project type (e.g., web app, mobile app, data science)</li>
                <li>Team size</li>
                <li>Budget (rough estimate)</li>
              </ul>
              <p className="text-sm text-foreground/70">
                Example: "Build a tool stack for a web app with 5 developers and $500/month budget"
              </p>
            </div>
          ),
        });
      } else if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('show') || lowerMessage.includes('list')) {
        // Direct search functionality
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching our database for relevant tools...
            </div>
          ),
        });

        // Use AI to enhance the search query and search our database
        const [enhancedQueries, directSearch] = await Promise.all([
          perplexity.enhanceSearchQuery(message),
          searchTools(message)
        ]);

        // Combine search results
        const allSearches = [directSearch];
        if (enhancedQueries.length > 0) {
          const enhancedSearches = await Promise.allSettled(
            enhancedQueries.slice(0, 2).map(query => searchTools(query))
          );
          enhancedSearches.forEach(result => {
            if (result.status === 'fulfilled') {
              allSearches.push(result.value);
            }
          });
        }

        // Deduplicate and limit results
        const foundTools = new Map<number, SoftwareToolModel & { id: number }>();
        allSearches.forEach(results => {
          results.slice(0, 4).forEach(tool => {
            foundTools.set(tool.id, tool);
          });
        });

        const searchResults = Array.from(foundTools.values()).slice(0, 8);

        messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Search Results</span>
                <Badge variant="secondary" className="text-xs">
                  {searchResults.length} tools found
                </Badge>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.map(tool => createToolCard(tool))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => window.location.href = `/explore?search=${encodeURIComponent(message)}`}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      View All Results
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => window.location.href = '/explore'}>
                      Browse Categories
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    I couldn't find specific tools matching your search in our database. Let me search the web for you...
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={async () => {
                        // Add loading message
                        const loadingMessage: Message = {
                          id: Date.now(),
                          role: 'assistant',
                          content: (
                            <div className="flex items-center gap-2 text-sm text-foreground/60">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Searching the web for relevant tools...
                            </div>
                          ),
                        };
                        
                        // Add the loading message immediately
                        setMessages(prev => [...prev, loadingMessage]);
                        
                        try {
                          const onlineResults = await perplexity.searchToolsOnline(message);
                          
                          // Replace loading message with results
                          setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = {
                              id: Date.now() + 1,
                              role: 'assistant',
                              content: (
                                <div className="flex flex-col gap-4">
                                  <div className="flex items-center gap-2">
                                    <Search className="h-5 w-5 text-blue-500" />
                                    <span className="font-medium">Online Search Results</span>
                                    <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                      Found {onlineResults.tools.length} tools online
                                    </Badge>
                                  </div>

                                  {onlineResults.tools.length > 0 ? (
                                    <div className="space-y-3">
                                      <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {onlineResults.summary}
                                      </p>
                                      <div className="space-y-2">
                                        {onlineResults.tools.slice(0, 6).map((tool, index) => (
                                          <div key={index} className="border border-blue-200 dark:border-blue-800 rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20">
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <h4 className="font-semibold text-sm">{tool.name}</h4>
                                                <p className="text-xs text-foreground/70 mt-1">{tool.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                  {tool.category && (
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                      {tool.category}
                                                    </span>
                                                  )}
                                                  {tool.pricing && (
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                                      {tool.pricing}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                              {tool.website && (
                                                <a
                                                  href={tool.website}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-primary hover:text-primary/80 text-xs font-medium ml-2 shrink-0"
                                                >
                                                  Visit →
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          onClick={() => window.location.href = `/explore?search=${encodeURIComponent(message)}&force_online=true`}
                                        >
                                          <Search className="h-4 w-4 mr-2" />
                                          View More Results
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => window.location.href = '/add-tool'}>
                                          Submit These Tools
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <p className="text-sm text-foreground/70">
                                        I couldn't find tools matching your search in our database or online.
                                      </p>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'}>
                                          <Search className="h-4 w-4 mr-2" />
                                          Browse All Tools
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => window.location.href = '/add-tool'}>
                                          Add Your Tool
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ),
                            };
                            return newMessages;
                          });
                        } catch (error) {
                          console.error('Online search failed:', error);
                          // Replace loading with error message
                          setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = {
                              id: Date.now() + 1,
                              role: 'assistant',
                              content: (
                                <div className="space-y-3">
                                  <p className="text-sm text-red-600 dark:text-red-400">
                                    Sorry, the web search failed. Please try again or browse our tool categories.
                                  </p>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'}>
                                      <Search className="h-4 w-4 mr-2" />
                                      Browse All Tools
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/add-tool'}>
                                      Add Your Tool
                                    </Button>
                                  </div>
                                </div>
                              ),
                            };
                            return newMessages;
                          });
                        }
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Online
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'}>
                      Browse All Tools
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/add-tool'}>
                      Add Your Tool
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ),
        });
      } else {
        // Default help message
        messages.push({
          id: Date.now(),
          role: 'assistant',
          content: (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-foreground/70">
                I'm your AI-powered tool discovery assistant! Here's what I can help you with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FeatureCard
                  icon={<Sparkles className="h-5 w-5 text-purple-500" />}
                  title="Get Recommendations"
                  description="Tell me what you're building and I'll suggest the best tools"
                  example="I need tools for building a React app"
                />
                <FeatureCard
                  icon={<Search className="h-5 w-5 text-blue-500" />}
                  title="Search Tools"
                  description="Find specific tools in our database"
                  example="Find code editors for Python"
                />
                <FeatureCard
                  icon={<Layers className="h-5 w-5 text-blue-500" />}
                  title="Compare Tools"
                  description="Get detailed comparisons between different tools"
                  example="Compare Figma vs Sketch"
                />
                <FeatureCard
                  icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                  title="Discover Trends"
                  description="Learn about the latest tools and industry trends"
                  example="What are the latest DevOps trends?"
                />
              </div>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      messages.push({
        id: Date.now(),
        role: 'assistant',
        content: (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-600">
              I encountered an error while processing your request. Please try again.
            </p>
            <p className="text-xs text-foreground/60">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        ),
      });
    } finally {
      setIsProcessing(false);
    }

    return messages;
  }, []);

  return {
    processUserMessage,
    isProcessing,
  };
};

// Helper component for feature cards
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  example 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
}) => (
  <div className="flex flex-col gap-2 p-3 rounded-lg bg-foreground/5 border border-foreground/10">
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-medium text-sm">{title}</span>
    </div>
    <p className="text-xs text-foreground/60">{description}</p>
    <p className="text-xs text-foreground/40 italic">"{example}"</p>
  </div>
);

// Helper function to format markdown content
const formatMarkdown = (content: string): string => {
  // Basic markdown to HTML conversion
  return content
    .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/^/, '<p class="mb-2">')
    .replace(/$/, '</p>');
};