import { cn } from '@/lib/utils';
import { StackImages } from './stack-images';
import { Tag } from './tag';
import { StarIcon } from '@/components/custom/icons/star-icon';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveToolForUser, unsaveToolForUser, isToolSavedByUser } from '@/lib/user-api';
import { Heart, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { toast } from 'sonner';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface ToolCardProps {
  tool: SoftwareToolModel & { id?: number };
  className?: string;
  onSaveChange?: (saved: boolean) => void;
  // Comparison props
  showComparison?: boolean;
  isSelectedForComparison?: boolean;
  onToggleComparison?: (toolId: number) => void;
}

// Helper function to generate tag colors
const getTagColor = (index: number) => {
  const colors = [
    {
      bgColor: 'bg-fuchsia-100',
      darkBgColor: 'dark:bg-fuchsia-900',
      textColor: 'text-fuchsia-900',
      darkTextColor: 'dark:text-fuchsia-100',
    },
    {
      bgColor: 'bg-indigo-100',
      darkBgColor: 'dark:bg-indigo-900',
      textColor: 'text-indigo-900',
      darkTextColor: 'dark:text-indigo-100',
    },
    {
      bgColor: 'bg-emerald-100',
      darkBgColor: 'dark:bg-emerald-900',
      textColor: 'text-emerald-900',
      darkTextColor: 'dark:text-emerald-100',
    },
    {
      bgColor: 'bg-lime-100',
      darkBgColor: 'dark:bg-lime-900',
      textColor: 'text-lime-900',
      darkTextColor: 'dark:text-lime-100',
    },
    {
      bgColor: 'bg-violet-100',
      darkBgColor: 'dark:bg-violet-900',
      textColor: 'text-violet-900',
      darkTextColor: 'dark:text-violet-100',
    },
    {
      bgColor: 'bg-sky-100',
      darkBgColor: 'dark:bg-sky-900',
      textColor: 'text-sky-900',
      darkTextColor: 'dark:text-sky-100',
    },
  ];
  
  return colors[index % colors.length];
};

export const ToolCard = ({ 
  tool, 
  className, 
  onSaveChange,
  showComparison = false,
  isSelectedForComparison = false,
  onToggleComparison
}: ToolCardProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Check if tool is saved on mount
  useEffect(() => {
    if (user && tool.id) {
      checkSavedStatus();
    }
  }, [user, tool.id]);

  const checkSavedStatus = async () => {
    if (!tool.id) return;
    try {
      const saved = await isToolSavedByUser(tool.id);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (!tool.id) {
      console.error('Tool ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        const result = await unsaveToolForUser(tool.id);
        if (result.success) {
          setIsSaved(false);
          onSaveChange?.(false);
          toast.success('Tool removed from saved items');
        } else {
          toast.error('Failed to remove tool');
        }
      } else {
        const result = await saveToolForUser(tool.id);
        if (result.success) {
          setIsSaved(true);
          onSaveChange?.(true);
          toast.success(`${tool.name} saved successfully!`);
        } else {
          toast.error('Failed to save tool');
        }
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatReviews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPricingText = () => {
    if (tool.pricing.type === 'free') return 'Free';
    if (tool.pricing.type === 'freemium') return 'Freemium';
    if (tool.pricing.startingPrice) {
      return `From $${tool.pricing.startingPrice}/${tool.pricing.billingPeriod || 'month'}`;
    }
    return 'Paid';
  };

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className={cn(
            "flex flex-col items-center sm:flex-row justify-center sm:justify-start gap-3 py-6 px-0 sm:px-6 rounded-lg bg-card shadow-shadow-2 backdrop-blur-md hover:shadow-md transition-shadow cursor-pointer relative",
            className
          )}>
        {/* Save Button - positioned absolutely */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-4 right-4 h-8 w-8 p-0 z-50",
            isSaved && "hover:bg-red-100 hover:text-red-600",
            showComparison && "right-12" // Adjust position when comparison is shown
          )}
          onClick={handleSaveToggle}
          disabled={isLoading}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              isSaved ? "fill-rose-500 text-rose-500" : "text-foreground/60"
            )}
          />
        </Button>

        {/* Comparison Checkbox - positioned absolutely */}
        {showComparison && tool.id && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <Checkbox
              checked={isSelectedForComparison}
              onCheckedChange={() => {
                if (onToggleComparison && tool.id) {
                  onToggleComparison(tool.id);
                }
              }}
              className="h-4 w-4"
            />
            <Scale className="h-4 w-4 text-foreground/60" />
          </div>
        )}

        <StackImages
          coverImageUrl={tool.logo}
          coverImageAlt={tool.name}
        />
        <div className="flex flex-col px-4 gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-medium leading-6 text-foreground">
              {tool.name}
            </span>
            <span className="text-sm text-foreground leading-5">
              {tool.description}
            </span>
          </div>
          
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {tool.tags.slice(0, 3).map((tag, index) => {
              const colors = getTagColor(index);
              return (
                <Tag
                  key={tag}
                  small={true}
                  className={cn(
                    colors.bgColor,
                    colors.darkBgColor,
                    colors.textColor,
                    colors.darkTextColor
                  )}
                >
                  #{tag}
                </Tag>
              );
            })}
          </div>

          {/* Rating and Pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <StarIcon className="size-4 text-yellow-500" />
                <span className="text-sm font-medium">{tool.rating}</span>
              </div>
              <span className="text-sm text-foreground/60">
                {formatReviews(tool.reviewCount)} reviews
              </span>
            </div>
            <div className="text-sm font-medium text-foreground/80">
              {getPricingText()}
            </div>
          </div>

          {/* Footer with features */}
          <div className="flex items-start gap-2">
            <span className="text-sm text-foreground/50 leading-5 font-normal">
              {tool.features.slice(0, 2).join(' • ')}
              {tool.features.length > 2 && ` • +${tool.features.length - 2} more`}
            </span>
          </div>
        </div>
          </div>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-80" side="top">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {tool.logo ? (
                  <img 
                    src={tool.logo} 
                    alt={`${tool.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-muted-foreground">
                    {tool.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-semibold">{tool.name}</h4>
                <p className="text-sm text-muted-foreground">{tool.category}</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground/80 line-clamp-3">
              {tool.description}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tool.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.tags.length - 3} more
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{tool.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatReviews(tool.reviewCount)})
                </span>
              </div>
              <div className="text-sm font-medium">
                {getPricingText()}
              </div>
            </div>
            
            {tool.features.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-1">Key Features:</p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 4).map((feature, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Login Dialog */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </>
  );
};