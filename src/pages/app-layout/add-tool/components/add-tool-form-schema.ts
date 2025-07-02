import { z } from 'zod';

export const addToolFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Tool name must be at least 2 characters').max(100, 'Tool name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  website: z.string().url('Please enter a valid URL'),
  category: z.string().min(1, 'Please select a category'),
  
  // Pricing Information
  pricingType: z.enum(['free', 'freemium', 'paid'], {
    required_error: 'Please select a pricing type',
  }),
  startingPrice: z.number().min(0, 'Price must be a positive number').optional(),
  currency: z.string().optional(),
  billingPeriod: z.enum(['month', 'year', 'one-time']).optional(),
  
  // Details
  features: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'Please add at least one feature').max(10, 'Maximum 10 features allowed'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'Please add at least one tag').max(8, 'Maximum 8 tags allowed'),
  compatibility: z.array(z.string().min(1, 'Platform cannot be empty')).min(1, 'Please select at least one platform'),
  
  // Optional Information
  logo: z.string().url('Please enter a valid URL for the logo').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  documentation: z.string().url('Please enter a valid documentation URL').optional().or(z.literal('')),
  
  // Submission Info
  submitterName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  submitterEmail: z.string().email('Please enter a valid email address'),
  submissionNotes: z.string().max(300, 'Notes must be less than 300 characters').optional(),
});

export type AddToolFormData = z.infer<typeof addToolFormSchema>;

export const toolCategories = [
  'Code Editor',
  'Design Tool', 
  'DevOps',
  'Database',
  'Version Control',
  'API Development',
  'Testing',
  'Monitoring',
  'Security',
  'Mobile Development',
  'Data Science',
  'Productivity',
  'Communication',
  'Project Management',
  'Cloud Platform',
  'Framework',
  'Library',
  'Other'
];

export const platformOptions = [
  'Web',
  'Windows', 
  'macOS',
  'Linux',
  'iOS',
  'Android',
  'Cross-platform'
];

export const currencyOptions = [
  'USD',
  'EUR', 
  'GBP',
  'CAD',
  'AUD'
];