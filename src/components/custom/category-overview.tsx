import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

interface CategoryData {
  slug: string;
  name: string;
  count: number;
}

interface CategoryOverviewProps {
  categories: CategoryData[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  totalTools: number;
}

export const CategoryOverview = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  totalTools 
}: CategoryOverviewProps) => {
  const topCategories = categories.slice(0, 5);
  const maxCount = Math.max(...categories.map(cat => cat.count));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Category Overview</CardTitle>
        </div>
        <CardDescription>
          Browse tools by category • {totalTools} total tools across {categories.length} categories
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalTools}</div>
            <div className="text-xs text-blue-600/70">Total Tools</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{categories.length}</div>
            <div className="text-xs text-green-600/70">Categories</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{topCategories[0]?.count || 0}</div>
            <div className="text-xs text-purple-600/70">Most Popular</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(totalTools / categories.length).toFixed(1)}
            </div>
            <div className="text-xs text-orange-600/70">Avg per Category</div>
          </div>
        </div>

        {/* Top categories */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <TrendingUp className="h-4 w-4" />
            Top Categories
          </div>
          
          <div className="space-y-2">
            {topCategories.map((category) => {
              const percentage = maxCount > 0 ? (category.count / maxCount) * 100 : 0;
              const isSelected = selectedCategory === category.slug;
              
              return (
                <div key={category.slug} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Button
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onCategorySelect(category.slug)}
                      className="justify-start h-auto p-2 font-normal"
                    >
                      <span className="truncate">{category.name}</span>
                    </Button>
                    <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-foreground/10 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isSelected 
                          ? 'bg-primary' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All categories button */}
        {categories.length > 5 && (
          <div className="pt-2 border-t">
            <Button
              variant={selectedCategory === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect('all')}
              className="w-full"
            >
              View All Categories ({categories.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};