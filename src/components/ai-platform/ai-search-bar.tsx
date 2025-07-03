import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Mic, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { aiSearchEngine } from '@/lib/ai-search';
import { SearchContext, SearchQuery } from '@/types/ai-platform';

interface AISearchBarProps {
  onSearch: (query: SearchQuery) => void;
  placeholder?: string;
  className?: string;
  enableVoiceSearch?: boolean;
  showFilters?: boolean;
}

export const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  placeholder = "Describe what you're looking for... (e.g., 'I need a tool to manage customer feedback that integrates with Slack')",
  className,
  enableVoiceSearch = true,
  showFilters = true
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchIntent, setSearchIntent] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock user context - in real app, get from user profile
  const searchContext: SearchContext = {
    user_profile: {
      industry: 'technology',
      company_size: 'medium',
      job_title: 'Product Manager',
      department: 'product',
      experience_level: 'intermediate',
      primary_use_cases: ['project management', 'team collaboration'],
      current_tool_stack: ['slack', 'notion', 'figma']
    },
    current_tools: ['slack', 'notion', 'figma'],
    recent_searches: ['project management', 'design tools', 'customer feedback'],
    browsing_history: []
  };

  useEffect(() => {
    if (query.length > 2) {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await aiSearchEngine.getSmartAutocomplete(query, searchContext);
          setSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error getting suggestions:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      const processedQuery = await aiSearchEngine.processNaturalLanguageQuery(
        searchQuery,
        searchContext
      );
      
      setSearchIntent(processedQuery.intent);
      onSearch(processedQuery);
    } catch (error) {
      console.error('Error processing search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleSearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const getIntentBadge = () => {
    if (!searchIntent) return null;

    const intentConfig = {
      discovery: { label: 'Discovery', color: 'bg-blue-100 text-blue-800' },
      comparison: { label: 'Comparison', color: 'bg-purple-100 text-purple-800' },
      evaluation: { label: 'Evaluation', color: 'bg-green-100 text-green-800' },
      replacement: { label: 'Replacement', color: 'bg-orange-100 text-orange-800' },
      integration: { label: 'Integration', color: 'bg-teal-100 text-teal-800' }
    };

    const config = intentConfig[searchIntent as keyof typeof intentConfig];
    if (!config) return null;

    return (
      <Badge className={cn('text-xs', config.color)}>
        <Sparkles className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className={cn('relative w-full max-w-4xl mx-auto', className)}>
      {/* Intent Badge */}
      {searchIntent && (
        <div className="mb-2 flex justify-center">
          {getIntentBadge()}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10 pr-24 py-3 text-base border-2 focus:border-primary/50"
          disabled={isSearching}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {enableVoiceSearch && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={startVoiceSearch}
              disabled={isListening || isSearching}
              className={cn(
                'h-8 w-8 p-0',
                isListening && 'bg-red-100 text-red-600'
              )}
            >
              <Mic className={cn('h-4 w-4', isListening && 'animate-pulse')} />
            </Button>
          )}

          {showFilters && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-4">
                  <h4 className="font-semibold">Quick Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Free tools only',
                      'AI-powered',
                      'Team collaboration',
                      'Under $50/month',
                      'Enterprise ready',
                      'No-code solutions'
                    ].map((filter) => (
                      <Badge
                        key={filter}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => {
                          const newQuery = query ? `${query} ${filter.toLowerCase()}` : filter.toLowerCase();
                          setQuery(newQuery);
                          handleSearch(newQuery);
                        }}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Button
            type="button"
            onClick={() => handleSearch()}
            disabled={!query.trim() || isSearching}
            className="h-8 px-3"
          >
            Search
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              AI Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example Queries */}
      {!query && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-muted-foreground">Try:</span>
          {[
            "Tools for project management with Slack integration",
            "Free design tools for startups",
            "Customer feedback software with analytics",
            "AI-powered writing assistants"
          ].map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              className="text-xs h-6"
              onClick={() => {
                setQuery(example);
                handleSearch(example);
              }}
            >
              {example}
            </Button>
          ))}
        </div>
      )}

      {/* Voice Search Indicator */}
      {isListening && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-red-600">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
        </div>
      )}
    </div>
  );
};