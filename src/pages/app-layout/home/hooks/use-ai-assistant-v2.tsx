import { Message } from '@/components/custom/chat-container';
import { perplexity } from '@/lib/perplexity';
import { searchTools } from '@/lib/tool-api';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, Search, Layers, Loader2, ExternalLink, Star } from 'lucide-react';

// Loading message component
const LoadingMessage = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-foreground/60">
    <Loader2 className="h-4 w-4 animate-spin" />
    {text}
  </div>
);

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
    
    // Create a loading message with a unique ID
    const loadingMessageId = Date.now();
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'assistant',
      content: <LoadingMessage text="Analyzing your request..." />,
    };
    
    // Add loading message
    messages.push(loadingMessage);

    try {
      // Analyze the user's intent
      const lowerMessage = message.toLowerCase();
      
      // Check for recommendation intent
      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('need') || 
          (lowerMessage.includes('best') && lowerMessage.includes('tool')) || 
          lowerMessage.includes('for my project') || lowerMessage.includes('for a')) {
        
        try {
          // Update loading message
          setMessages(prev => prev.map(msg => 
            msg.id === loadingMessageId 
              ? { ...msg, content: <LoadingMessage text="Getting personalized recommendations..." /> }
              : msg
          ));
          
          const contextualAnalysis = await perplexity.analyzeUserContext(message);
          
          // Replace loading message with actual content
          const responseMessage: Message = {
            id: loadingMessageId,
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">AI Tool Recommendations</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(contextualAnalysis) }} />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'}>
                    <Search className="h-4 w-4 mr-2" />
                    Browse All Tools
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.location.href = '/add-tool'}>
                    Add a Tool
                  </Button>
                </div>
              </div>
            ),
          };
          
          // Replace the loading message
          messages[0] = responseMessage;
          
        } catch (error) {
          console.error('Error in recommendation flow:', error);
          
          // Replace loading message with error
          messages[0] = {
            id: loadingMessageId,
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-red-600">
                  I encountered an error while getting recommendations. This might be due to API configuration.
                </p>
                <p className="text-xs text-foreground/60">
                  Error: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'} className="mt-2">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Tools Manually
                </Button>
              </div>
            ),
          };
        }
      } else if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('show') || lowerMessage.includes('list')) {
        // Direct search functionality
        try {
          // Update loading message
          setMessages(prev => prev.map(msg => 
            msg.id === loadingMessageId 
              ? { ...msg, content: <LoadingMessage text="Searching our database for relevant tools..." /> }
              : msg
          ));
          
          const [enhancedQueries, directSearch] = await Promise.all([
            perplexity.enhanceSearchQuery(message),
            searchTools(message)
          ]);
          
          // Process search results
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
          
          // Replace loading message with results
          messages[0] = {
            id: loadingMessageId,
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
                      I couldn't find specific tools matching your search in our database.
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
        } catch (error) {
          console.error('Error in search flow:', error);
          messages[0] = {
            id: loadingMessageId,
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-red-600">
                  I encountered an error while searching. Please try again.
                </p>
                <p className="text-xs text-foreground/60">
                  Error: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            ),
          };
        }
      } else {
        // General query - get AI response
        try {
          const response = await perplexity.getToolRecommendations(message);
          
          messages[0] = {
            id: loadingMessageId,
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(response) }} />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'}>
                    <Search className="h-4 w-4 mr-2" />
                    Browse All Tools
                  </Button>
                </div>
              </div>
            ),
          };
        } catch (error) {
          console.error('Error calling Perplexity:', error);
          messages[0] = {
            id: loadingMessageId,
            role: 'assistant',
            content: (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-foreground/70">
                  I'm your AI-powered tool discovery assistant! Try asking me to:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground/60 space-y-1">
                  <li>Recommend tools for your project</li>
                  <li>Search for specific tools</li>
                  <li>Compare different tools</li>
                  <li>Find the latest tool trends</li>
                </ul>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/explore'} className="mt-2 w-fit">
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Tools
                </Button>
              </div>
            ),
          };
        }
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      messages[0] = {
        id: loadingMessageId,
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
      };
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

// Helper function to format markdown content
const formatMarkdown = (content: string): string => {
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