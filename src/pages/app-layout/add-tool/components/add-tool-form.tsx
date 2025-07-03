import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addToolFormSchema,
  type AddToolFormData,
  toolCategories,
  platformOptions,
  currencyOptions,
} from './add-tool-form-schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { submitTool } from '@/lib/tool-api';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from 'sonner';

interface AddToolFormProps {
  prefilledData?: Record<string, unknown>;
}

export const AddToolForm = ({ prefilledData }: AddToolFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Generate default values with optional prefilled data
  const getDefaultValues = (): AddToolFormData => {
    const defaults: AddToolFormData = {
      name: '',
      description: '',
      website: '',
      category: '',
      pricingType: 'free',
      features: [''],
      tags: [''],
      compatibility: [],
      logo: '',
      githubUrl: '',
      documentation: '',
      submitterName: '',
      submitterEmail: '',
      submissionNotes: '',
    };

    // Apply prefilled data if available
    if (prefilledData) {
      const prefilled = prefilledData as {
        basicInfo?: {
          name?: string;
          description?: string;
          website?: string;
          category?: string;
          logoUrl?: string;
        };
        pricing?: {
          pricingType?: string;
        };
        links?: {
          githubUrl?: string;
          documentationUrl?: string;
        };
        features?: {
          features?: string[];
          tags?: string[];
        };
      };
      return {
        ...defaults,
        name: prefilled.basicInfo?.name || defaults.name,
        description: prefilled.basicInfo?.description || defaults.description,
        website: prefilled.basicInfo?.website || defaults.website,
        category: prefilled.basicInfo?.category || defaults.category,
        logo: prefilled.basicInfo?.logoUrl || defaults.logo,
        pricingType: (prefilled.pricing?.pricingType as 'free' | 'freemium' | 'paid') || defaults.pricingType,
        githubUrl: prefilled.links?.githubUrl || defaults.githubUrl,
        documentation: prefilled.links?.documentationUrl || defaults.documentation,
        features: prefilled.features?.features?.length ? prefilled.features.features : defaults.features,
        tags: prefilled.features?.tags?.length ? prefilled.features.tags : defaults.tags,
      };
    }

    return defaults;
  };

  const form = useForm<AddToolFormData>({
    resolver: zodResolver(addToolFormSchema),
    defaultValues: getDefaultValues(),
  });

  const watchedPricingType = form.watch('pricingType');
  const watchedFeatures = form.watch('features');
  const watchedTags = form.watch('tags');

  const onSubmit = async (data: AddToolFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit to Supabase with logo file
      const result = await submitTool(data, logoFile || undefined);
      
      if (result.success) {
        console.log('Tool submitted successfully with ID:', result.id);
        setSubmitSuccess(true);
        form.reset();
        setLogoFile(null);
        toast.success('Tool submitted successfully! It will be reviewed by our team.');
      } else {
        setSubmitError(result.error || 'Failed to submit tool. Please try again.');
        toast.error(result.error || 'Failed to submit tool. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to submit tool. Please try again.');
      toast.error('Failed to submit tool. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', [...currentFeatures, '']);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', currentFeatures.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', [...currentTags, '']);
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Tool Submitted Successfully!</h2>
        <p className="text-foreground/70 mb-6">
          Thank you for contributing to the community. Your tool submission will be reviewed and added to our directory.
        </p>
        <Button onClick={() => {
          setSubmitSuccess(false);
          setLogoFile(null);
        }} variant="outline">
          Submit Another Tool
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <p className="text-sm text-foreground/60">Essential details about the tool</p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Visual Studio Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of what this tool does and its main benefits..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/500 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {toolCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Pricing Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Pricing Information</h2>
            <p className="text-sm text-foreground/60">How is this tool priced?</p>
          </div>

          <FormField
            control={form.control}
            name="pricingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium (Free with paid tiers)</SelectItem>
                    <SelectItem value="paid">Paid Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(watchedPricingType === 'freemium' || watchedPricingType === 'paid') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="9.99"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Features & Details</h2>
            <p className="text-sm text-foreground/60">Key features and technical details</p>
          </div>

          <FormField
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <FormLabel>Key Features *</FormLabel>
                <div className="space-y-2">
                  {watchedFeatures.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`features.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Feature ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {watchedFeatures.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="mt-2"
                  disabled={watchedFeatures.length >= 10}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags *</FormLabel>
                <FormDescription>
                  Add relevant tags to help users discover this tool
                </FormDescription>
                <div className="space-y-2">
                  {watchedTags.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`tags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Tag ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {watchedTags.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTag(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  className="mt-2"
                  disabled={watchedTags.length >= 8}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compatibility"
            render={() => (
              <FormItem>
                <FormLabel>Platform Compatibility *</FormLabel>
                <FormDescription>
                  Select all platforms this tool supports
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {platformOptions.map((platform) => (
                    <FormField
                      key={platform}
                      control={form.control}
                      name="compatibility"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={platform}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, platform])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== platform
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {platform}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Optional Information</h2>
            <p className="text-sm text-foreground/60">Additional resources and links</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FileUpload
                onFileSelect={setLogoFile}
                currentImage={form.watch('logo')}
                label="Upload Logo"
                description="PNG, JPG, GIF, WebP up to 5MB"
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      {logoFile ? 'File upload will take priority over URL' : 'External logo URL if no file is uploaded'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="documentation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documentation URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://docs.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submitter Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold">Submitter Information</h2>
            <p className="text-sm text-foreground/60">Your contact details for verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="submissionNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information about this tool..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Share any additional context or personal experience with this tool
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Error State */}
        {submitError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{submitError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Tool'}
          </Button>
        </div>
      </form>
    </Form>
  );
};