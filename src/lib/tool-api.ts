import { supabase, type DatabaseTool, type ToolSubmission } from './supabase';
import { AddToolFormData } from '@/pages/app-layout/add-tool/components/add-tool-form-schema';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { downloadAndUploadImage, uploadImageFile, type ImageUploadResult } from './image-upload';

// Category mapping between UI slugs and database names
const categoryMapping: Record<string, string> = {
  'code-editor': 'Code Editor',
  'design-tool': 'Design Tool',
  'devops': 'DevOps',
  'database': 'Database',
  'version-control': 'Version Control',
  'api-development': 'API Development',
  'testing': 'Testing',
  'monitoring': 'Monitoring',
  'security': 'Security',
  'mobile-development': 'Mobile Development',
  'data-science': 'Data Science',
  'productivity': 'Productivity',
  'communication': 'Communication',
  'project-management': 'Project Management',
  'cloud-platform': 'Cloud Platform',
  'framework': 'Framework',
  'library': 'Library',
  'other': 'Other'
};

// Helper function to convert UI slug to database category name
export const slugToCategory = (slug: string): string => {
  return categoryMapping[slug] || slug;
};

// Helper function to convert database category name to UI slug
export const categoryToSlug = (category: string): string => {
  return Object.entries(categoryMapping).find(([_, dbCategory]) => dbCategory === category)?.[0] || 
         category.toLowerCase().replace(/\s+/g, '-');
};

// Submit a new tool with image handling
export const submitTool = async (
  formData: AddToolFormData, 
  logoFile?: File
): Promise<{ success: boolean; error?: string; id?: number }> => {
  try {
    let imageUploadResult: ImageUploadResult | null = null;

    // Handle logo upload if provided
    if (logoFile) {
      console.log('Uploading logo file...');
      imageUploadResult = await uploadImageFile(logoFile, formData.name);
      
      if (!imageUploadResult.success) {
        return { 
          success: false, 
          error: `Logo upload failed: ${imageUploadResult.error}` 
        };
      }
    } else if (formData.logo && formData.logo.startsWith('http')) {
      // Download and upload external logo URL
      console.log('Downloading and uploading external logo...');
      imageUploadResult = await downloadAndUploadImage(formData.logo, formData.name);
      
      // Don't fail the submission if logo download fails, just log it
      if (!imageUploadResult.success) {
        console.warn('Logo download failed:', imageUploadResult.error);
        imageUploadResult = null;
      }
    }

    // Prepare tool data
    const toolData: ToolSubmission & {
      logo_storage_path?: string;
      logo_public_url?: string;
      logo_file_size?: number;
      logo_content_type?: string;
    } = {
      name: formData.name,
      description: formData.description,
      website: formData.website,
      category: formData.category,
      pricing_type: formData.pricingType,
      starting_price: formData.startingPrice,
      currency: formData.currency,
      billing_period: formData.billingPeriod,
      features: formData.features.filter(f => f.trim() !== ''),
      tags: formData.tags.filter(t => t.trim() !== ''),
      compatibility: formData.compatibility,
      logo: formData.logo || undefined,
      github_url: formData.githubUrl || undefined,
      documentation: formData.documentation || undefined,
      submitter_name: formData.submitterName,
      submitter_email: formData.submitterEmail,
      submission_notes: formData.submissionNotes || undefined,
    };

    // Add image storage information if upload was successful
    if (imageUploadResult?.success) {
      toolData.logo_storage_path = imageUploadResult.storagePath;
      toolData.logo_public_url = imageUploadResult.publicUrl;
      toolData.logo_file_size = imageUploadResult.fileSize;
      toolData.logo_content_type = imageUploadResult.contentType;
    }

    console.log('Submitting tool to database...');
    const { data, error } = await supabase
      .from('tools')
      .insert([toolData])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    console.log('Tool submitted successfully with ID:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Submit tool error:', error);
    return { success: false, error: 'Failed to submit tool. Please try again.' };
  }
};

// Get all approved tools for public display
export const getApprovedTools = async (): Promise<(SoftwareToolModel & { id: number })[]> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved tools:', error);
      return [];
    }

    // Transform database format to app format
    return data.map(transformDatabaseToolToAppFormat);
  } catch (error) {
    console.error('Get approved tools error:', error);
    return [];
  }
};

// Get all submitted tools for admin review
export const getAllSubmittedTools = async (): Promise<DatabaseTool[]> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submitted tools:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get submitted tools error:', error);
    return [];
  }
};

// Approve a tool (admin function)
export const approveTool = async (id: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('tools')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.error('Error approving tool:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Approve tool error:', error);
    return { success: false, error: 'Failed to approve tool. Please try again.' };
  }
};

// Reject a tool (admin function)
export const rejectTool = async (id: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('tools')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting tool:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Reject tool error:', error);
    return { success: false, error: 'Failed to reject tool. Please try again.' };
  }
};

// Get tools by category
export const getToolsByCategory = async (categorySlug: string): Promise<(SoftwareToolModel & { id: number })[]> => {
  try {
    // Convert UI slug to database category name
    const categoryName = slugToCategory(categorySlug);
    
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'approved')
      .eq('category', categoryName)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching tools by category:', error);
      return [];
    }

    return data.map(transformDatabaseToolToAppFormat);
  } catch (error) {
    console.error('Get tools by category error:', error);
    return [];
  }
};

// Get tool counts by category
export const getCategoryStats = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('category')
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching category stats:', error);
      return {};
    }

    // Count tools by category
    const categoryStats: Record<string, number> = {};
    data.forEach(tool => {
      const slug = categoryToSlug(tool.category);
      categoryStats[slug] = (categoryStats[slug] || 0) + 1;
    });

    return categoryStats;
  } catch (error) {
    console.error('Get category stats error:', error);
    return {};
  }
};

// Get all available categories from the database
export const getAvailableCategories = async (): Promise<{slug: string; name: string; count: number}[]> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('category')
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching available categories:', error);
      return [];
    }

    // Count and organize categories
    const categoryCounts: Record<string, number> = {};
    data.forEach(tool => {
      categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
    });

    // Convert to array with slug mapping
    return Object.entries(categoryCounts)
      .map(([categoryName, count]) => ({
        slug: categoryToSlug(categoryName),
        name: categoryName,
        count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  } catch (error) {
    console.error('Get available categories error:', error);
    return [];
  }
};

// Search tools
export const searchTools = async (query: string): Promise<(SoftwareToolModel & { id: number })[]> => {
  try {
    // Sanitize the query for PostgreSQL text search
    const searchQuery = query.trim().toLowerCase();
    
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'approved')
      .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
      .order('rating', { ascending: false })
      .limit(50); // Limit results for performance

    if (error) {
      console.error('Error searching tools:', error);
      return [];
    }

    // Additional filtering for tags (since Supabase doesn't support array contains with ILIKE)
    const filteredData = data.filter(tool => {
      // Check if any tag contains the search query
      const tagMatch = tool.tags?.some((tag: string) => 
        tag.toLowerCase().includes(searchQuery)
      );
      
      // Include if name, description, category matched (already filtered by DB)
      // or if any tag matches
      return tagMatch || 
        tool.name.toLowerCase().includes(searchQuery) ||
        tool.description.toLowerCase().includes(searchQuery) ||
        tool.category.toLowerCase().includes(searchQuery);
    });

    return filteredData.map(transformDatabaseToolToAppFormat);
  } catch (error) {
    console.error('Search tools error:', error);
    return [];
  }
};

// Transform database tool format to app format
const transformDatabaseToolToAppFormat = (dbTool: DatabaseTool): SoftwareToolModel & { id: number } => {
  // Prefer stored logo, fallback to external logo, then default
  const logoUrl = (dbTool as any).logo_public_url || dbTool.logo || '/icons/unknown-icon.svg';
  
  return {
    id: dbTool.id,
    name: dbTool.name,
    category: dbTool.category,
    logo: logoUrl,
    pricing: {
      type: dbTool.pricing_type,
      startingPrice: dbTool.starting_price,
      currency: dbTool.currency,
      billingPeriod: dbTool.billing_period,
    },
    description: dbTool.description,
    features: dbTool.features,
    rating: dbTool.rating,
    reviewCount: dbTool.review_count,
    website: dbTool.website,
    tags: dbTool.tags,
    compatibility: dbTool.compatibility,
    lastUpdated: new Date(dbTool.updated_at).toISOString().split('T')[0],
  };
};