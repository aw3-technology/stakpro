// Admin page for testing and managing the discovery service
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { discoveryService, type DiscoveredTool, type DiscoveryFilters } from '@/lib/discovery-service';
import { Loader2, ExternalLink, Star, MessageCircle, GitBranch, Users, TrendingUp, Search, Play, Calendar } from 'lucide-react';

export const DiscoveryAdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredTools, setDiscoveredTools] = useState<DiscoveredTool[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['product-hunt', 'github', 'hacker-news', 'reddit', 'angellist']);
  const [filters, setFilters] = useState<DiscoveryFilters>({});
  const [stats, setStats] = useState<any>(null);

  // Discovery methods
  const runDiscovery = async (type: 'all' | 'daily' | 'trending' | 'source') => {
    setIsLoading(true);
    try {
      let tools: DiscoveredTool[] = [];
      
      switch (type) {
        case 'all':
          tools = await discoveryService.discoverTools({
            ...filters,
            sources: selectedSources as any
          });
          break;
        case 'daily':
          const dailyResult = await discoveryService.runDailyDiscovery();
          tools = dailyResult.newTools;
          break;
        case 'trending':
          tools = await discoveryService.runWeeklyTrendingDiscovery();
          break;
        case 'source':
          if (selectedSources.length === 1) {
            tools = await discoveryService.discoverFromSource(selectedSources[0], filters);
          }
          break;
      }
      
      setDiscoveredTools(tools);
    } catch (error) {
      console.error('Discovery error:', error);
      alert(`Discovery failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const searchByKeyword = async (keyword: string) => {
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    try {
      const tools = await discoveryService.searchByKeyword(keyword);
      setDiscoveredTools(tools);
    } catch (error) {
      console.error('Search error:', error);
      alert(`Search failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await discoveryService.getDiscoveryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discovery Service Admin</h1>
          <p className="text-foreground/60">Test and manage automated tool discovery from multiple sources</p>
        </div>
        <Button onClick={loadStats} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Stats
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-foreground/60">Total Discovered</p>
                  <p className="text-2xl font-bold">{stats.totalDiscovered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-foreground/60">Last Week</p>
                  <p className="text-2xl font-bold">{stats.lastWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-foreground/60">Top Source</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(stats.bySource).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'None'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-foreground/60">Categories</p>
                  <p className="text-2xl font-bold">{stats.topCategories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discover">Discover Tools</TabsTrigger>
          <TabsTrigger value="search">Search Tools</TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discovery Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Source Selection */}
              <div className="space-y-2">
                <Label>Data Sources</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'product-hunt', label: 'Product Hunt', icon: '🚀' },
                    { id: 'github', label: 'GitHub Trending', icon: '⭐' },
                    { id: 'hacker-news', label: 'Hacker News', icon: '📰' },
                    { id: 'reddit', label: 'Reddit', icon: '🔗' },
                    { id: 'angellist', label: 'AngelList', icon: '💼' }
                  ].map(source => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={source.id}
                        checked={selectedSources.includes(source.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSources([...selectedSources, source.id]);
                          } else {
                            setSelectedSources(selectedSources.filter(s => s !== source.id));
                          }
                        }}
                      />
                      <Label htmlFor={source.id} className="cursor-pointer">
                        {source.icon} {source.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discovery Actions */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => runDiscovery('all')} 
                  disabled={isLoading || selectedSources.length === 0}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Discover All Sources
                </Button>
                <Button 
                  onClick={() => runDiscovery('daily')} 
                  disabled={isLoading}
                  variant="outline"
                >
                  Daily Discovery
                </Button>
                <Button 
                  onClick={() => runDiscovery('trending')} 
                  disabled={isLoading}
                  variant="outline"
                >
                  Weekly Trending
                </Button>
                {selectedSources.length === 1 && (
                  <Button 
                    onClick={() => runDiscovery('source')} 
                    disabled={isLoading}
                    variant="outline"
                  >
                    {selectedSources[0]} Only
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for tools by keyword..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchByKeyword((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    searchByKeyword(input.value);
                  }}
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['AI tools', 'CLI tools', 'API tools', 'productivity', 'developer tools', 'analytics'].map(keyword => (
                  <Button
                    key={keyword}
                    size="sm"
                    variant="outline"
                    onClick={() => searchByKeyword(keyword)}
                    disabled={isLoading}
                  >
                    {keyword}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Votes/Stars</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    onChange={(e) => setFilters({
                      ...filters,
                      minVotes: parseInt(e.target.value) || undefined
                    })}
                  />
                </div>
                <div>
                  <Label>Date Range</Label>
                  <Select onValueChange={(value) => {
                    const days = parseInt(value);
                    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
                    const to = new Date().toISOString();
                    setFilters({ ...filters, dateRange: { from, to } });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Last 24 hours</SelectItem>
                      <SelectItem value="7">Last week</SelectItem>
                      <SelectItem value="30">Last month</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {discoveredTools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Discovery Results
              <Badge variant="secondary">{discoveredTools.length} tools</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discoveredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Discovering tools...</span>
        </div>
      )}
    </div>
  );
};

// Tool Card Component
const ToolCard: React.FC<{ tool: DiscoveredTool }> = ({ tool }) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'product-hunt': return '🚀';
      case 'github': return <GitBranch className="h-4 w-4" />;
      case 'hacker-news': return '📰';
      case 'reddit': return '🔗';
      case 'angellist': return '💼';
      default: return '🔍';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'product-hunt': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'github': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'hacker-news': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reddit': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'angellist': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {tool.logo && (
            <img 
              src={tool.logo} 
              alt={`${tool.name} logo`} 
              className="w-10 h-10 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{tool.name}</h3>
              {tool.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
            </div>
            <p className="text-xs text-foreground/70 mb-2 line-clamp-2">{tool.description}</p>
            
            {/* Source and stats */}
            <div className="flex items-center justify-between mb-2">
              <Badge className={`text-xs px-2 py-1 ${getSourceColor(tool.source)}`}>
                {getSourceIcon(tool.source)} {tool.source}
              </Badge>
              <div className="flex items-center gap-3 text-xs text-foreground/60">
                {tool.sourceData.votes && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {tool.sourceData.votes}
                  </div>
                )}
                {tool.sourceData.comments && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {tool.sourceData.comments}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {tool.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {tool.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{tool.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(tool.website, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(tool.sourceData.sourceUrl, '_blank')}
              >
                Source
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoveryAdminPage;