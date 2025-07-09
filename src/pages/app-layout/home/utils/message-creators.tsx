import { Message } from '@/components/custom/chat-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Loader2, 
  TrendingUp,
  ExternalLink 
} from 'lucide-react';
import { ToolCard } from '../components/ToolCard';
import { formatMarkdown } from './formatters';

export function createLoadingMessage(text: string): Message {
  return {
    id: Date.now(),
    role: 'assistant',
    content: (
      <div className="flex items-center gap-2 text-sm text-foreground/60">
        <Loader2 className="h-4 w-4 animate-spin" />
        {text}
      </div>
    ),
  };
}

export function createErrorMessage(error: unknown): Message {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  return {
    id: Date.now(),
    role: 'assistant',
    content: (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600">
          I encountered an error while processing your request.
        </p>
        <p className="text-xs text-foreground/60">
          Error: {errorMessage}
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.location.href = '/explore'}
          className="mt-2 w-fit"
        >
          <Search className="h-4 w-4 mr-2" />
          Browse Tools Manually
        </Button>
      </div>
    ),
  };
}

export function createRecommendationMessage(content: string): Message {
  return {
    id: Date.now() + 1,
    role: 'assistant',
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="font-medium">AI Tool Recommendations</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.href = '/explore'}
          >
            <Search className="h-4 w-4 mr-2" />
            Browse All Tools
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.href = '/add-tool'}
          >
            Add a Tool
          </Button>
        </div>
      </div>
    ),
  };
}

export function createSearchMessage(tools: any[], searchQuery: string): Message {
  return {
    id: Date.now() + 1,
    role: 'assistant',
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          <span className="font-medium">Search Results</span>
          <Badge variant="secondary" className="text-xs">
            {tools.length} tools found
          </Badge>
        </div>

        {tools.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`}
              >
                <Search className="h-4 w-4 mr-2" />
                View All Results
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => window.location.href = '/explore'}
              >
                Browse Categories
              </Button>
            </div>
          </div>
        ) : (
          <NoResultsMessage searchQuery={searchQuery} />
        )}
      </div>
    ),
  };
}

export function createComparisonMessage(tools: any[], comparison: string): Message {
  return {
    id: Date.now() + 1,
    role: 'assistant',
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          <span className="font-medium">Tool Comparison</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {tools.slice(0, 4).map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(comparison) }} />
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.href = `/explore?compare=${tools.map(t => t.id).join(',')}`}
          >
            <Layers className="h-4 w-4 mr-2" />
            Compare in Detail
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => window.location.href = '/explore'}
          >
            Find More Tools
          </Button>
        </div>
      </div>
    ),
  };
}

function NoResultsMessage({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/70">
        I couldn't find specific tools matching your search in our database.
      </p>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.location.href = '/explore'}
        >
          <Search className="h-4 w-4 mr-2" />
          Browse All Tools
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.location.href = '/add-tool'}
        >
          Add Your Tool
        </Button>
      </div>
    </div>
  );
}