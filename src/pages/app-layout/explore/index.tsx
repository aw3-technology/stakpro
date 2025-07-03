import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { ToolCard } from '@/components/custom/tool-card';
import { InformationHeader } from '@/components/custom/information-header';
import { ToolComparison } from '@/components/custom/tool-comparison';
import { CategoryOverview } from '@/components/custom/category-overview';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRightIcon, SearchIcon, Loader2, AlertCircle, Scale, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AISearchBar } from '@/components/ai-platform/ai-search-bar';
import { SearchQuery } from '@/types/ai-platform';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { getApprovedTools, getToolsByCategory, searchTools, getAvailableCategories } from '@/lib/tool-api';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { perplexity } from '@/lib/perplexity';
import { aiSearchEngine } from '@/lib/ai-search';

export const Explore = () => {
  const [allTools, setAllTools] = useState<(SoftwareToolModel & { id: number })[]>([]);
  const [displayTools, setDisplayTools] = useState<(SoftwareToolModel & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [_searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<number>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{slug: string; name: string; count: number}[]>([]);
  const [onlineSearchResults, setOnlineSearchResults] = useState<{
    tools: Array<{
      name: string;
      description: string;
      website?: string;
      category?: string;
      pricing?: string;
    }>;
    summary: string;
  } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load all tools and category stats on mount, handle URL parameters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load tools and category data in parallel
        const [tools, categories] = await Promise.all([
          getApprovedTools(),
          getAvailableCategories()
        ]);
        
        setAllTools(tools);
        setDisplayTools(tools);
        setAvailableCategories(categories);

        // Handle URL parameters from AI assistant
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const compareParam = urlParams.get('compare');
        const forceOnline = urlParams.get('force_online') === 'true';

        if (searchParam) {
          // Set search query and trigger search
          setSearchQuery(searchParam);
          if (forceOnline) {
            // Force online search without trying database first
            setTimeout(() => performOnlineSearch(searchParam), 100);
          } else {
            // Normal search (database first, then online fallback)
            setTimeout(() => performSearch(searchParam), 100);
          }
        }

        if (compareParam) {
          // Handle comparison request from AI
          const toolIds = compareParam.split(',').map(id => parseInt(id)).filter(Boolean);
          if (toolIds.length >= 2) {
            toolIds.forEach(id => {
              setSelectedForComparison(prev => new Set([...prev, id]));
            });
            setCompareMode(true);
            // Small delay then show comparison
            setTimeout(() => setShowComparison(true), 500);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load tools. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // AI-powered search handler with NLP
  const handleAISearch = useCallback(async (searchQuery: SearchQuery) => {
    try {
      setSearching(true);
      setSearchQuery(searchQuery.text);
      setOnlineSearchResults(null);
      
      // Use enhanced NLP search
      const nlpResult = await aiSearchEngine.searchWithNLP(
        searchQuery.text,
        searchQuery.context,
        allTools
      );
      
      // Convert enhanced tools back to software tool models for display
      const toolResults = nlpResult.tools.map(enhancedTool => {
        const originalTool = allTools.find(tool => tool.id.toString() === enhancedTool.id);
        return originalTool;
      }).filter(Boolean) as (SoftwareToolModel & { id: number })[];
      
      // Apply AI-extracted filters
      if (searchQuery.filters.categories.length > 0) {
        setSelectedCategory(searchQuery.filters.categories[0]);
      }
      if (searchQuery.filters.pricing_models.length > 0) {
        setSelectedPricing(searchQuery.filters.pricing_models[0]);
      }
      
      // Set the NLP search results
      setDisplayTools(toolResults);
      
      // Show search explanation as info
      if (nlpResult.explanation) {
        console.log('Search explanation:', nlpResult.explanation);
      }
      
    } catch (error) {
      console.error('AI search error:', error);
      setError('AI search failed. Please try again.');
      // Fallback to regular search
      await performSearch(searchQuery.text);
    } finally {
      setSearching(false);
    }
  }, [allTools]);

  // Enhanced search function with AI query enhancement
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // If search is empty, show all tools with current filters
      setOnlineSearchResults(null);
      applyFilters(allTools, '', selectedCategory, selectedPricing);
      return;
    }

    try {
      setSearching(true);
      
      // Try to enhance the search query with AI
      let searchQueries = [query];
      try {
        const enhancedQueries = await perplexity.enhanceSearchQuery(query);
        if (enhancedQueries.length > 0) {
          searchQueries = [...new Set([query, ...enhancedQueries])]; // Remove duplicates
        }
      } catch (aiError) {
        console.warn('AI search enhancement failed, using original query:', aiError);
      }

      // Search with all queries and combine results
      const searchPromises = searchQueries.map(q => searchTools(q.trim()));
      const searchResultsArrays = await Promise.allSettled(searchPromises);
      
      // Combine and deduplicate results
      const allSearchResults = new Map<number, SoftwareToolModel & { id: number }>();
      searchResultsArrays.forEach(result => {
        if (result.status === 'fulfilled') {
          result.value.forEach(tool => {
            allSearchResults.set(tool.id, tool);
          });
        }
      });

      const combinedResults = Array.from(allSearchResults.values());
      
      // If no database results found, search online with Perplexity
      if (combinedResults.length === 0 && query.trim()) {
        try {
          console.log('No database results found, searching online with Perplexity...');
          const onlineResults = await perplexity.searchToolsOnline(query);
          
          if (onlineResults.tools.length > 0) {
            // Set a flag or state to show online results differently
            setOnlineSearchResults(onlineResults);
            setDisplayTools([]); // Clear display tools to show online results instead
            return;
          }
        } catch (onlineError) {
          console.error('Online search failed:', onlineError);
          // Continue with empty results
        }
      } else {
        // Clear online results if we have database results
        setOnlineSearchResults(null);
      }
      
      // Apply other filters to search results
      applyFilters(combinedResults, query, selectedCategory, selectedPricing);
    } catch (err) {
      console.error('Search error:', err);
      // Fall back to local search if API fails
      applyFilters(allTools, query, selectedCategory, selectedPricing);
    } finally {
      setSearching(false);
    }
  }, [allTools, selectedCategory, selectedPricing]);

  // Perform online search directly (skip database search)
  const performOnlineSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setOnlineSearchResults(null);
      applyFilters(allTools, '', selectedCategory, selectedPricing);
      return;
    }

    try {
      setSearching(true);
      setDisplayTools([]); // Clear display tools to show online results
      
      console.log('Performing direct online search with Perplexity...');
      const onlineResults = await perplexity.searchToolsOnline(query);
      
      if (onlineResults.tools.length > 0) {
        setOnlineSearchResults(onlineResults);
      } else {
        // If no online results either, show empty state
        setOnlineSearchResults({
          tools: [],
          summary: 'No tools found matching your search query.'
        });
      }
    } catch (error) {
      console.error('Online search failed:', error);
      // Fall back to showing empty results with error message
      setOnlineSearchResults({
        tools: [],
        summary: 'Search failed. Please try again or browse our tool categories.'
      });
    } finally {
      setSearching(false);
    }
  }, [allTools, selectedCategory, selectedPricing]);

  // Apply all filters
  const applyFilters = useCallback((
    tools: (SoftwareToolModel & { id: number })[],
    query: string,
    category: string,
    pricing: string
  ) => {
    let filtered = [...tools];

    // Apply search filter locally if query exists
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        tool.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(tool => 
        tool.category.toLowerCase().replace(/\s+/g, '-') === category
      );
    }

    // Apply pricing filter
    if (pricing !== 'all') {
      filtered = filtered.filter(tool => tool.pricing.type === pricing);
    }

    setDisplayTools(filtered);
  }, []);


  // Handle category change
  const handleCategoryChange = useCallback(async (category: string) => {
    setSelectedCategory(category);
    
    // Clear online results when changing filters
    setOnlineSearchResults(null);
    
    if (searchQuery.trim()) {
      // If there's a search query, re-run the search with new category filter
      performSearch(searchQuery);
    } else if (category !== 'all') {
      // Load category-specific tools from backend
      try {
        setSearching(true);
        const categoryTools = await getToolsByCategory(category);
        applyFilters(categoryTools, searchQuery, category, selectedPricing);
      } catch (err) {
        console.error('Category filter error:', err);
        // Fall back to filtering all tools
        applyFilters(allTools, searchQuery, category, selectedPricing);
      } finally {
        setSearching(false);
      }
    } else {
      // Show all tools with filters
      applyFilters(allTools, searchQuery, category, selectedPricing);
    }
  }, [searchQuery, selectedPricing, allTools, performSearch, applyFilters]);

  // Handle pricing change
  const handlePricingChange = useCallback((pricing: string) => {
    setSelectedPricing(pricing);
    
    // Clear online results when changing filters
    setOnlineSearchResults(null);
    
    if (searchQuery.trim()) {
      // If there's a search query, apply filters to current results
      applyFilters(displayTools, searchQuery, selectedCategory, pricing);
    } else {
      // Apply filters to all tools
      applyFilters(allTools, searchQuery, selectedCategory, pricing);
    }
  }, [searchQuery, selectedCategory, displayTools, allTools, applyFilters]);

  // Handle tool selection for comparison
  const toggleToolSelection = useCallback((toolId: number) => {
    setSelectedForComparison(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else if (newSet.size < 5) { // Limit to 5 tools max
        newSet.add(toolId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedForComparison(new Set());
  }, []);

  const getSelectedTools = useCallback(() => {
    return displayTools.filter(tool => selectedForComparison.has(tool.id));
  }, [displayTools, selectedForComparison]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const visibleTools = showAll ? displayTools : displayTools.slice(0, 6);
  const totalCount = displayTools.length;
  const isFiltered = searchQuery || selectedCategory !== 'all' || selectedPricing !== 'all';

  return (
    <AppLayoutContent
      title={
        <h1 className="font-medium leading-8">
          Discover Software Tools
        </h1>
      }
      description={
        <p className="text-foreground/70 leading-5">
          Browse {allTools.length} curated software tools – find, save, or submit your favorites!
        </p>
      }
    >
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <InformationHeader
          title={
            <span className="text-base font-medium text-foreground/60 leading-5">
              Find your perfect tools
            </span>
          }
        />
        <div className="space-y-4">
          {/* AI-Powered Search */}
          <div className="w-full">
            <AISearchBar 
              onSearch={handleAISearch}
              placeholder="Describe what you're looking for... (e.g., 'project management tool that integrates with Slack')"
              className="w-full"
            />
          </div>
          
          {/* Traditional Filters */}
          <div className="flex flex-wrap gap-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={loading}>
            <SelectTrigger className="border border-input shadow-sm shadow-shadow-2 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Categories ({allTools.length})
              </SelectItem>
              {availableCategories.map(({ slug, name, count }) => (
                <SelectItem key={slug} value={slug}>
                  {name} ({count})
                </SelectItem>
              ))}
              {/* Show additional empty categories if they exist in our mapping */}
              {['code-editor', 'design-tool', 'devops', 'database', 'framework', 'testing', 'other'].map(slug => {
                const existing = availableCategories.find(cat => cat.slug === slug);
                if (!existing) {
                  const name = slug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ');
                  return (
                    <SelectItem key={slug} value={slug}>
                      {name} (0)
                    </SelectItem>
                  );
                }
                return null;
              }).filter(Boolean)}
            </SelectContent>
          </Select>
          <Select value={selectedPricing} onValueChange={handlePricingChange} disabled={loading}>
            <SelectTrigger className="border border-input shadow-sm shadow-shadow-2 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pricing</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              <SelectItem value="freemium">Freemium</SelectItem>
              <SelectItem value="paid">Paid Tools</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Compare Mode Toggle */}
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              if (!compareMode) {
                clearSelection(); // Clear selection when exiting compare mode
              }
            }}
            className="flex items-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Compare Mode
          </Button>
          </div>
        </div>

        {/* Comparison Bar */}
        {compareMode && selectedForComparison.size > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {selectedForComparison.size} tool{selectedForComparison.size > 1 ? 's' : ''} selected for comparison
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button
                onClick={() => setShowComparison(true)}
                disabled={selectedForComparison.size < 2}
                size="sm"
              >
                <Scale className="h-4 w-4 mr-2" />
                Compare Tools
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Category Overview */}
      {!loading && !error && availableCategories.length > 0 && (
        <CategoryOverview
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryChange}
          totalTools={allTools.length}
        />
      )}

      {/* Tool Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <ToolComparison
              tools={getSelectedTools()}
              onClose={() => {
                setShowComparison(false);
                clearSelection();
              }}
            />
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <InformationHeader
          className="text-sm"
          title={
            <span className="text-base font-medium text-foreground/60 leading-5">
              {isFiltered
                ? `Found ${totalCount} tools` 
                : `${totalCount} approved tools`}
            </span>
          }
          extra={
            totalCount > 6 && !showAll && (
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/60 text-sm flex items-center gap-1"
                onClick={() => setShowAll(true)}
              >
                View all {totalCount}
                <ChevronRightIcon className="size-4" />
              </Button>
            )
          }
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
          <span className="ml-2 text-foreground/70">Loading tools...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Online Search Results */}
      {!loading && !error && onlineSearchResults && (
        <div className="space-y-4">
          <Alert className="border-blue-200 dark:border-blue-800">
            <SearchIcon className="h-4 w-4" />
            <AlertTitle>Found online tools for "{searchQuery}"</AlertTitle>
            <AlertDescription className="mt-2">
              {onlineSearchResults.summary}
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            {onlineSearchResults.tools.map((tool, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{tool.name}</h3>
                    <p className="text-sm text-foreground/70 mt-1">{tool.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-foreground/60">
                      {tool.category && (
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {tool.category}
                        </span>
                      )}
                      {tool.pricing && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
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
                      className="text-primary hover:text-primary/80 text-sm font-medium ml-4"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              These tools were found by searching the web. Consider{' '}
              <Link to="/add-tool" className="underline hover:no-underline">
                submitting them
              </Link>{' '}
              to our database to help other users discover them.
            </p>
          </div>
        </div>
      )}

      {/* Tools List */}
      {!loading && !error && !onlineSearchResults && (
        <div className="space-y-4">
          {visibleTools.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-foreground/60">
                {isFiltered
                  ? 'No tools match your filters. Try adjusting your search criteria.'
                  : 'No tools found. Be the first to add one!'}
              </span>
              <div className="mt-4">
                <Link
                  to="/add-tool"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Add a tool →
                </Link>
              </div>
            </div>
          ) : (
            visibleTools.map((tool, index) => (
              <ToolCard 
                key={`${tool.id}-${index}`} 
                tool={tool}
                showComparison={compareMode}
                isSelectedForComparison={selectedForComparison.has(tool.id)}
                onToggleComparison={toggleToolSelection}
              />
            ))
          )}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !error && !onlineSearchResults && displayTools.length > 6 && !showAll && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="px-4 h-8.5 text-sm text-foreground/70"
            onClick={() => setShowAll(true)}
          >
            View all {displayTools.length} tools
          </Button>
        </div>
      )}

      {/* Show Less Button */}
      {!loading && !error && !onlineSearchResults && showAll && displayTools.length > 6 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="px-4 h-8.5 text-sm text-foreground/70"
            onClick={() => setShowAll(false)}
          >
            Show fewer
          </Button>
        </div>
      )}
    </AppLayoutContent>
  );
};