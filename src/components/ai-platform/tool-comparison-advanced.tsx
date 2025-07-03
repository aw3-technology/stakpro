import React, { useState, useEffect } from 'react';
import { ROIEstimate, UserProfile } from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Check, 
  X, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap, 
  DollarSign,
  Clock,
  Users,
  BarChart3,
  Calculator,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { advancedComparisonEngine, AdvancedComparisonResult, ComparisonCriteria } from '@/lib/comparison-engine';

interface AdvancedToolComparisonProps {
  tools: (SoftwareToolModel & { id: number })[];
  onClose: () => void;
  userProfile?: UserProfile;
}

export const AdvancedToolComparison: React.FC<AdvancedToolComparisonProps> = ({
  tools,
  onClose,
  userProfile
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [comparisonResult, setComparisonResult] = useState<AdvancedComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [roiCalculations, setRoiCalculations] = useState<Record<string, ROIEstimate>>({});
  const [criteria, _setCriteria] = useState<ComparisonCriteria>({
    features: [],
    pricing: true,
    security: true,
    integrations: true,
    usability: true,
    performance: true,
    support: true,
    scalability: true
  });

  useEffect(() => {
    performAdvancedComparison();
  }, [tools, criteria]);

  const performAdvancedComparison = async () => {
    if (tools.length === 0) return;
    
    setLoading(true);
    try {
      const defaultProfile: UserProfile = userProfile || {
        industry: 'technology',
        company_size: 'medium',
        job_title: 'Product Manager',
        department: 'product',
        experience_level: 'intermediate',
        primary_use_cases: ['productivity', 'collaboration'],
        current_tool_stack: []
      };

      const result = await advancedComparisonEngine.performAdvancedComparison(
        tools,
        criteria,
        defaultProfile
      );
      
      setComparisonResult(result);
      setRoiCalculations(result.roi_estimates);
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Failed to generate comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getFeatureComparison = () => {
    const allFeatures = new Set<string>();
    tools.forEach(tool => {
      tool.features.forEach(feature => allFeatures.add(typeof feature === 'string' ? feature : feature));
    });

    return Array.from(allFeatures).map(featureName => ({
      name: featureName,
      availability: tools.map(tool => ({
        toolId: tool.id.toString(),
        available: tool.features.some(f => f === featureName),
        tier: 'all_tiers'
      }))
    }));
  };

  const startTrial = (tool: SoftwareToolModel & { id: number }) => {
    toast.success(`Trial started for ${tool.name}`);
    // Integration with trial management system
  };

  const addToShortlist = (tool: SoftwareToolModel & { id: number }) => {
    toast.success(`${tool.name} added to shortlist`);
    // Save to user's shortlist
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Analyzing tools with AI...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!comparisonResult) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 z-50 overflow-y-auto">
        <Card className="mx-auto max-w-7xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">AI-Powered Tool Comparison</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comparing {tools.length} tools with advanced AI analysis
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close Comparison
            </Button>
          </CardHeader>
          
          <CardContent>
            {/* AI Recommendations Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900 dark:text-green-100">Overall Winner</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">{comparisonResult.recommendations.overall_winner}</p>
              </Card>
              
              <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Best Value</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">{comparisonResult.recommendations.best_value}</p>
              </Card>
              
              <Card className="p-4 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900 dark:text-purple-100">For Beginners</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">{comparisonResult.recommendations.best_for_beginners}</p>
              </Card>
              
              <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900 dark:text-orange-100">Enterprise</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">{comparisonResult.recommendations.best_for_enterprise}</p>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${tools.length}, 1fr)` }}>
                  {tools.map((tool) => (
                    <Card key={tool.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{tool.category}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* AI Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rating Score</span>
                            <span className={cn("text-sm font-bold", getScoreColor(tool.rating / 5))}>
                              {Math.round((tool.rating / 5) * 100)}%
                            </span>
                          </div>
                          <Progress value={(tool.rating / 5) * 100} className="h-2" />
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{tool.rating}</span>
                            </div>
                            <p className="text-muted-foreground">Rating</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span>Popular</span>
                            </div>
                            <p className="text-muted-foreground">Market Position</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span>85%</span>
                            </div>
                            <p className="text-muted-foreground">Security Score</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-purple-500" />
                              <span>{tool.reviewCount}</span>
                            </div>
                            <p className="text-muted-foreground">Reviews</p>
                          </div>
                        </div>

                        {/* Categories */}
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            <Zap className="h-3 w-3 mr-1" />
                            {tool.category}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {tool.features.length} features available
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                          <Button 
                            size="sm" 
                            onClick={() => startTrial(tool)}
                            className="flex-1"
                          >
                            Start Trial
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => addToShortlist(tool)}
                          >
                            Add to Shortlist
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Feature Comparison Matrix</h3>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-medium">Feature</th>
                          {tools.map(tool => (
                            <th key={tool.id} className="text-center p-3 font-medium min-w-[120px]">
                              {tool.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getFeatureComparison().map((feature, index) => (
                          <tr key={feature.name} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                            <td className="p-3 font-medium">{feature.name}</td>
                            {feature.availability.map((avail, toolIndex) => (
                              <td key={toolIndex} className="text-center p-3">
                                {avail.available ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    {avail.tier !== 'all_tiers' && (
                                      <Badge variant="outline" className="text-xs">
                                        {avail.tier.replace('_', ' ')}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <X className="h-4 w-4 text-red-600 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing">
                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${tools.length}, 1fr)` }}>
                  {tools.map((tool) => (
                    <Card key={tool.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          {tool.name} Pricing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Standard Plan</h4>
                            <Badge variant="default">Most Popular</Badge>
                          </div>
                          
                          <div className="text-2xl font-bold mb-2">
                            {formatCurrency(tool.pricing.startingPrice || 10)}
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </div>
                          
                          <ul className="space-y-1 text-sm">
                            {tool.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-600" />
                                {feature}
                              </li>
                            ))}
                            {tool.features.length > 3 && (
                              <li className="text-muted-foreground">
                                +{tool.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        {tool.pricing.type === 'freemium' && (
                          <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-700">Free Tier Available</h4>
                            <p className="text-sm text-green-600">
                              Try before you buy with limited features
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations">
                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${tools.length}, 1fr)` }}>
                  {tools.map((tool) => (
                    <Card key={tool.id}>
                      <CardHeader>
                        <CardTitle>{tool.name} Integrations</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Popular integrations available
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {['Slack', 'Google Workspace', 'GitHub', 'Zapier', 'Microsoft Teams'].slice(0, 5).map((integration, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{integration}</span>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={index < 2 ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {index < 2 ? 'native' : 'api'}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    index < 3 ? "bg-green-500" : "bg-yellow-500"
                                  )} />
                                  <span className="text-xs text-muted-foreground">
                                    {index < 3 ? '95%' : '75%'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            +20 more integrations available
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${tools.length}, 1fr)` }}>
                  {tools.map((tool) => (
                    <Card key={tool.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          {tool.name} Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Security Score */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Security Score</span>
                            <span className={cn("text-sm font-bold", getScoreColor(0.85))}>
                              85%
                            </span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>

                        {/* Certifications */}
                        <div>
                          <h4 className="font-semibold mb-2">Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">SOC 2</Badge>
                            <Badge variant="outline">GDPR</Badge>
                            <Badge variant="outline">ISO 27001</Badge>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div>
                          <h4 className="font-semibold mb-2">Performance</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Uptime</span>
                              <span className="font-medium">99.9%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Response Time</span>
                              <span className="font-medium">150ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Error Rate</span>
                              <span className="font-medium">0.1%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* ROI Calculator Tab */}
              <TabsContent value="roi">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">ROI Calculator</h3>
                    <p className="text-sm text-muted-foreground">
                      Estimated return on investment for each tool
                    </p>
                  </div>

                  <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${tools.length}, 1fr)` }}>
                    {tools.map((tool) => {
                      const roi = roiCalculations[tool.id.toString()] || {
                        time_savings: '10 hours/week',
                        cost_savings: 5000,
                        productivity_gain: 0.25,
                        confidence_level: 0.75
                      };

                      return (
                        <Card key={tool.id}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calculator className="h-5 w-5" />
                              {tool.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                <p className="text-sm font-medium">Time Savings</p>
                                <p className="text-lg font-bold text-green-600">{roi.time_savings}</p>
                              </div>
                              
                              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                                <p className="text-sm font-medium">Cost Savings</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {formatCurrency(roi.cost_savings)}
                                </p>
                              </div>
                            </div>

                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                              <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                              <p className="text-sm font-medium">Productivity Gain</p>
                              <p className="text-lg font-bold text-purple-600">
                                +{Math.round(roi.productivity_gain * 100)}%
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                Confidence: {Math.round(roi.confidence_level * 100)}%
                              </p>
                              <Progress value={roi.confidence_level * 100} className="h-1 mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};