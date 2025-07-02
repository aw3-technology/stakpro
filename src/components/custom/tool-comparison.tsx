import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Scale, ExternalLink, Sparkles } from 'lucide-react';
import { perplexity } from '@/lib/perplexity';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

interface ToolComparisonProps {
  tools: (SoftwareToolModel & { id: number })[];
  onClose: () => void;
}

export const ToolComparison = ({ tools, onClose }: ToolComparisonProps) => {
  const [comparison, setComparison] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPricingText = (pricing: SoftwareToolModel['pricing']) => {
    if (pricing.type === 'free') return 'Free';
    if (pricing.type === 'freemium') return 'Freemium';
    if (pricing.startingPrice) {
      return `From $${pricing.startingPrice}/${pricing.billingPeriod || 'month'}`;
    }
    return 'Paid';
  };

  const generateComparison = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const toolsForComparison = tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        pricing: getPricingText(tool.pricing)
      }));

      const comparisonResult = await perplexity.compareTools(toolsForComparison);
      setComparison(comparisonResult);
    } catch (err) {
      console.error('Error generating comparison:', err);
      setError('Failed to generate comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format markdown content to HTML
  const formatMarkdown = (content: string): string => {
    return content
      .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^(\d+\.) (.*?)$/gm, '<li class="ml-4 mb-1">$2</li>')
      .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc mb-1">$2</li>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/^/, '<p class="mb-2">')
      .replace(/$/, '</p>');
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-500" />
            <CardTitle>Tool Comparison</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <CardDescription>
          Compare {tools.length} tools to find the best fit for your needs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tools being compared */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="p-4 border rounded-lg bg-foreground/5">
              <div className="flex items-center gap-2 mb-2">
                {tool.logo && (
                  <img 
                    src={tool.logo} 
                    alt={`${tool.name} logo`} 
                    className="w-6 h-6 object-contain"
                  />
                )}
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              
              <p className="text-sm text-foreground/70 mb-2">{tool.description}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getPricingText(tool.pricing)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-sm">{tool.rating}/5</span>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* AI Comparison */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">AI-Powered Analysis</h3>
            </div>
            
            {!comparison && (
              <Button 
                onClick={generateComparison}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Comparison'
                )}
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {comparison && (
            <div className="p-4 bg-foreground/5 rounded-lg">
              <div 
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(comparison) }}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="sm"
              onClick={() => window.open(tool.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit {tool.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};