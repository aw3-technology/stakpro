import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

interface ToolCardProps {
  tool: SoftwareToolModel & { id: number };
}

export const ToolCard = memo(({ tool }: ToolCardProps) => {
  const handleOpenWebsite = () => {
    window.open(tool.website, '_blank');
  };

  return (
    <Card className="border border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {tool.logo && (
            <img 
              src={tool.logo} 
              alt={`${tool.name} logo`} 
              className="w-8 h-8 object-contain rounded"
              loading="lazy"
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
            <p className="text-xs text-foreground/70 mb-2 line-clamp-2">
              {tool.description}
            </p>
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
                onClick={handleOpenWebsite}
                aria-label={`Visit ${tool.name} website`}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ToolCard.displayName = 'ToolCard';