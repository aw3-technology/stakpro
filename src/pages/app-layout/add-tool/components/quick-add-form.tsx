import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link2, AlertCircle, AlertTriangle, CheckCircle, Edit3 } from 'lucide-react';
import { scrapeToolData, analyzeUrlOnly } from '@/lib/url-scraper';
import { submitTool } from '@/lib/tool-api';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL')
});

interface ScrapedToolData {
  title?: string;
  description?: string;
  logo?: string;
  category?: string;
  pricing?: {
    type: 'free' | 'freemium' | 'paid';
    startingPrice?: number;
  };
  features?: string[];
  tags?: string[];
  githubUrl?: string;
  documentation?: string;
  website?: string;
  originalUrl?: string;
  isFallback?: boolean;
}

interface QuickAddFormProps {
  onSuccess?: () => void;
  onFallbackToManual?: (prefilledData?: Record<string, unknown>) => void;
}

export default function QuickAddForm({ onSuccess, onFallbackToManual }: QuickAddFormProps) {
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedToolData | null>(null);
  const [scrapeError, setScrapeError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: '' }
  });

  const handleUrlScrape = async (values: z.infer<typeof urlSchema>) => {
    setIsScrapingUrl(true);
    setScrapeError('');
    
    try {
      // First try full web scraping
      const result = await scrapeToolData(values.url);
      
      if (result.success && result.data) {
        setScrapedData({
          ...result.data,
          website: values.url,
          originalUrl: values.url
        });
      } else {
        // Fallback to URL-only analysis
        console.warn('Full scraping failed, using URL analysis:', result.error);
        const fallbackData = analyzeUrlOnly(values.url);
        setScrapedData({
          ...fallbackData,
          website: values.url,
          originalUrl: values.url,
          isFallback: true
        });
        
        // Show warning about limited data
        setScrapeError('Limited data extracted due to website restrictions. You can edit the information manually.');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unable to extract data from this URL. ';
      if (error instanceof Error) {
        if (error.message.includes('All proxy services failed')) {
          errorMessage += 'The website may be blocking automated access. ';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Network error occurred. ';
        }
      }
      errorMessage += 'Please try manual entry or check the URL.';
      
      setScrapeError(errorMessage);
      
      // Still provide basic fallback data
      try {
        const fallbackData = analyzeUrlOnly(values.url);
        setScrapedData({
          ...fallbackData,
          website: values.url,
          originalUrl: values.url,
          isFallback: true
        });
      } catch (fallbackError) {
        console.error('Fallback analysis failed:', fallbackError);
        setScrapeError('Unable to analyze URL. Please enter tool information manually.');
      }
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleSubmit = async () => {
    if (!scrapedData) return;
    
    setIsSubmitting(true);
    
    try {
      // Transform scraped data to match the expected form schema format
      const toolData = {
        name: scrapedData.title || 'Unnamed Tool',
        description: scrapedData.description || 'No description available',
        website: scrapedData.website || '',
        category: scrapedData.category || 'Other',
        pricingType: scrapedData.pricing?.type || 'freemium',
        startingPrice: scrapedData.pricing?.startingPrice,
        features: scrapedData.features || ['Core functionality'],
        tags: scrapedData.tags || ['software'],
        compatibility: ['Web'], // Default compatibility
        logo: scrapedData.logo || '',
        githubUrl: scrapedData.githubUrl || '',
        documentation: scrapedData.documentation || '',
        submitterName: 'Quick Add User',
        submitterEmail: 'quickadd@stakpro.com',
        submissionNotes: 'Submitted via Quick Add feature'
      };

      await submitTool(toolData);
      onSuccess?.();
    } catch (error) {
      console.error('Submission error:', error);
      setScrapeError('Failed to submit tool. Please try again or use manual entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditManually = () => {
    if (scrapedData && onFallbackToManual) {
      // Convert scraped data to form format
      const prefilledData = {
        basicInfo: {
          name: scrapedData.title || '',
          description: scrapedData.description || '',
          website: scrapedData.website || '',
          category: scrapedData.category || 'Other',
          logoUrl: scrapedData.logo || ''
        },
        pricing: {
          pricingType: scrapedData.pricing?.type || 'freemium',
          startingPrice: scrapedData.pricing?.startingPrice || ''
        },
        features: {
          features: scrapedData.features || [],
          tags: scrapedData.tags || []
        },
        links: {
          githubUrl: scrapedData.githubUrl || '',
          documentationUrl: scrapedData.documentation || ''
        }
      };
      
      onFallbackToManual(prefilledData);
    }
  };

  const handleReset = () => {
    setScrapedData(null);
    setScrapeError('');
    urlForm.reset();
  };

  return (
    <div className="space-y-6">
      {/* URL Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Quick Add Tool
          </CardTitle>
          <CardDescription>
            Enter a tool's website URL and we'll automatically extract the information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={urlForm.handleSubmit(handleUrlScrape)} className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  {...urlForm.register('url')}
                  disabled={isScrapingUrl || !!scrapedData}
                />
                <Button 
                  type="submit" 
                  disabled={isScrapingUrl || !!scrapedData}
                  className="shrink-0"
                >
                  {isScrapingUrl ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    'Extract Info'
                  )}
                </Button>
              </div>
              {urlForm.formState.errors.url && (
                <p className="text-sm text-red-500 mt-1">
                  {urlForm.formState.errors.url.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {scrapeError && (
        <Card className={`${scrapeError.includes('Limited data') ? 'border-yellow-200 bg-yellow-50' : 'border-orange-200 bg-orange-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {scrapeError.includes('Limited data') ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${scrapeError.includes('Limited data') ? 'text-yellow-800' : 'text-orange-800'}`}>
                  {scrapeError.includes('Limited data') ? 'Limited Data Extracted' : 'Extraction Issue'}
                </p>
                <p className={`text-sm ${scrapeError.includes('Limited data') ? 'text-yellow-700' : 'text-orange-700'}`}>
                  {scrapeError}
                </p>
                {scrapeError.includes('Limited data') && (
                  <p className="text-yellow-600 text-xs mt-1">
                    You can still edit the information manually or proceed with the basic data.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scraped Data Preview */}
      {scrapedData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle>Extracted Information</CardTitle>
                {scrapedData.isFallback && (
                  <Badge variant="secondary" className="text-xs">
                    Basic Info Only
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEditManually}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Manually
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Try Another URL
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Tool Name</Label>
                <p className="text-sm text-gray-600">{scrapedData.title || 'Not found'}</p>
              </div>
              <div>
                <Label className="font-medium">Category</Label>
                <p className="text-sm text-gray-600">{scrapedData.category || 'Other'}</p>
              </div>
            </div>

            {scrapedData.description && (
              <div>
                <Label className="font-medium">Description</Label>
                <Textarea 
                  value={scrapedData.description} 
                  readOnly 
                  className="text-sm resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Logo */}
            {scrapedData.logo && (
              <div>
                <Label className="font-medium">Logo</Label>
                <div className="flex items-center gap-3 mt-1">
                  <img 
                    src={scrapedData.logo} 
                    alt="Tool logo" 
                    className="w-8 h-8 rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {scrapedData.logo}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing */}
            {scrapedData.pricing && (
              <div>
                <Label className="font-medium">Pricing</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {scrapedData.pricing.type}
                  </Badge>
                  {scrapedData.pricing.startingPrice && (
                    <span className="text-sm text-gray-600">
                      Starting at ${scrapedData.pricing.startingPrice}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {scrapedData.tags && scrapedData.tags.length > 0 && (
              <div>
                <Label className="font-medium">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scrapedData.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {scrapedData.features && scrapedData.features.length > 0 && (
              <div>
                <Label className="font-medium">Features</Label>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {scrapedData.features.slice(0, 5).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {scrapedData.githubUrl && (
                <div>
                  <Label className="font-medium">GitHub</Label>
                  <p className="text-blue-600 break-all">{scrapedData.githubUrl}</p>
                </div>
              )}
              {scrapedData.documentation && (
                <div>
                  <Label className="font-medium">Documentation</Label>
                  <p className="text-blue-600 break-all">{scrapedData.documentation}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting Tool...
                  </>
                ) : (
                  'Submit Tool for Review'
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Tool will be reviewed before appearing publicly
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}