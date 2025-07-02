import { useState, useEffect } from 'react';
import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { FavoriteIcon } from '@/components/custom/favorite-icon';
import { StarIcon } from '@/components/custom/icons/star-icon';
import { SavedCard } from '@/components/custom/saved-card';
import { StackImages } from '@/components/custom/stack-images';
import { Tag } from '@/components/custom/tag';
import { MapPin, Loader2, Heart, AlertCircle, Trash2 } from 'lucide-react';
import { TextAnimate } from '@/components/magicui/text-animate';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSavedTools, unsaveToolForUser, type SavedTool } from '@/lib/user-api';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export const Saved = () => {
  const { user, loading: authLoading } = useAuth();
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    loadSavedTools();
  }, [user, authLoading]);

  const loadSavedTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const tools = await getUserSavedTools();
      setSavedTools(tools);
    } catch (err) {
      console.error('Error loading saved tools:', err);
      setError('Failed to load saved tools');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (toolId: number) => {
    try {
      const result = await unsaveToolForUser(toolId);
      if (result.success) {
        setSavedTools(prev => prev.filter(tool => tool.id !== toolId));
      } else {
        setError(result.error || 'Failed to unsave tool');
      }
    } catch (err) {
      console.error('Error unsaving tool:', err);
      setError('Failed to unsave tool');
    }
  };

  const getPricingText = (tool: SavedTool) => {
    if (tool.pricing.type === 'free') return 'Free';
    if (tool.pricing.type === 'freemium') return 'Freemium';
    if (tool.pricing.startingPrice) {
      return `$${tool.pricing.startingPrice}/${tool.pricing.billingPeriod || 'month'}`;
    }
    return 'Paid';
  };

  const getStarCount = (rating: number) => {
    return Math.floor(rating);
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <AppLayoutContent
        title={
          <h1 className="leading-8 font-normal">
            Saved Tools
          </h1>
        }
        description={
          <p className="text-foreground/70 leading-5">
            Sign in to save and organize your favorite tools
          </p>
        }
      >
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">Save Tools to Access Later</h3>
          <p className="text-foreground/60 mb-6">
            Create an account to save tools, create collections, and access them anywhere.
          </p>
        </div>
      </AppLayoutContent>
    );
  }

  return (
    <AppLayoutContent
      title={
        <div className='flex items-center gap-2'>
          <TextAnimate animation="blurInUp" delay={0.1} duration={0.2} by="character" once as="h1" className='leading-8 font-normal'>
             Saved Tools
          </TextAnimate>

          <TextAnimate animation="blurInUp" delay={0.3} duration={0.2} by="character" once as="span" className='text-xl md:text-2xl lg:text-3xl text-foreground/70 leading-5'>
            {`(${savedTools.length})`}
          </TextAnimate>
        </div>
      }
      description={
        <TextAnimate animation="blurInUp" delay={0.3} duration={0.3} by="character" once as="p" className='text-foreground/70 leading-5'>
          Your personally curated collection of software tools
        </TextAnimate>
      }
    >
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
          <span className="ml-2 text-foreground/70">Loading saved tools...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && savedTools.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Saved Tools Yet</h3>
          <p className="text-foreground/60 mb-6">
            Start building your collection by saving tools you discover.
          </p>
          <Link to="/explore">
            <Button>
              Explore Tools
            </Button>
          </Link>
        </div>
      )}

      {/* Saved Tools Grid */}
      {!loading && !error && savedTools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedTools.map((tool, index) => (
            <SavedCard key={tool.name} delay={0.75 + (index * 0.25)}>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleUnsave(tool.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <FavoriteIcon className="size-6 fill-rose-500" />
              </div>
              <div className="flex flex-col gap-8 items-center justify-center pt-9">
                <StackImages
                  coverImageUrl={tool.logo}
                  coverImageAlt={tool.name}
                />
                <div className="flex flex-col gap-4 items-center justify-center">
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <div className="flex gap-1">
                      {Array.from({ length: getStarCount(tool.rating) }).map((_, starIndex) => (
                        <StarIcon
                          key={starIndex}
                          className="size-4 text-yellow-500"
                        />
                      ))}
                    </div>
                    <span className="text-base font-medium text-foreground">
                      {tool.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="bg-review-card text-foreground-light-solid">
                      {tool.rating}/5
                    </Tag>
                    <span className="text-sm font-bold text-foreground/70">
                      {tool.rating >= 4.5 ? 'Excellent' : tool.rating >= 4.0 ? 'Very Good' : 'Good'}
                    </span>
                  </div>
                  <span className="text-sm text-foreground/40 flex items-center gap-2">
                    <MapPin className="size-4" />
                    {tool.category} • {getPricingText(tool)}
                  </span>
                  {tool.notes && (
                    <div className="text-xs text-foreground/60 italic px-4 text-center">
                      "{tool.notes}"
                    </div>
                  )}
                </div>
              </div>
            </SavedCard>
          ))}
        </div>
      )}
    </AppLayoutContent>
  );
};