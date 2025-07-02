export interface ToolComparisonModel {
  name: string;
  category: string;
  pricing: {
    amount?: number;
    discountedAmount?: number;
    currency?: string;
    type: 'free' | 'freemium' | 'paid';
    billingPeriod?: 'month' | 'year' | 'one-time';
    totalYearlyPrice?: number;
  };
  images: string[];
  rating: { value: number; count: number };
  reviews: number;
  compatibility: string;
  features: string[];
  description: string;
  website: string;
  freeTrial?: boolean;
  supportedPlatforms: string[];
}

export const toolComparisonData: ToolComparisonModel[] = [
  {
    name: 'Visual Studio Code',
    category: 'Code Editor',
    pricing: {
      type: 'free',
      currency: '$',
      amount: 0,
    },
    images: [
      '/icons/unknown-icon.svg', // Placeholder - would be VS Code screenshots
      '/icons/unknown-icon.svg',
      '/icons/unknown-icon.svg',
      '/icons/unknown-icon.svg',
      '/icons/unknown-icon.svg',
    ],
    rating: { value: 4.8, count: 5 },
    reviews: 25000,
    compatibility: 'Windows, macOS, Linux',
    features: ['IntelliSense', 'Git Integration', 'Extensions', 'Debugging', 'Terminal'],
    description: 'Lightweight but powerful source code editor with built-in support for JavaScript, TypeScript and Node.js.',
    website: 'https://code.visualstudio.com',
    freeTrial: true,
    supportedPlatforms: ['Windows', 'macOS', 'Linux'],
  },
  {
    name: 'Figma',
    category: 'Design Tool',
    pricing: {
      type: 'freemium',
      currency: '$',
      amount: 12,
      billingPeriod: 'month',
      totalYearlyPrice: 144,
    },
    images: [
      '/icons/unknown-icon.svg', // Placeholder - would be Figma screenshots
      '/icons/unknown-icon.svg',
      '/icons/unknown-icon.svg',
      '/icons/unknown-icon.svg',
      '/icons/unknown-icon.svg',
    ],
    rating: { value: 4.7, count: 5 },
    reviews: 18000,
    compatibility: 'Web, Desktop Apps',
    features: ['Real-time Collaboration', 'Vector Editing', 'Prototyping', 'Design Systems', 'Dev Handoff'],
    description: 'Collaborative interface design tool with real-time collaboration features and powerful prototyping.',
    website: 'https://figma.com',
    freeTrial: true,
    supportedPlatforms: ['Web', 'Windows', 'macOS'],
  },
  {
    name: 'Docker Desktop',
    category: 'DevOps',
    pricing: {
      type: 'freemium',
      currency: '$',
      amount: 9,
      billingPeriod: 'month',
      totalYearlyPrice: 108,
    },
    images: [
      '/images/hotel-1.jpg', // Placeholder - would be Docker screenshots
      '/images/hotel-1.jpg',
      '/images/hotel-1.jpg',
      '/images/hotel-1.jpg',
      '/images/hotel-1.jpg',
    ],
    rating: { value: 4.6, count: 5 },
    reviews: 22000,
    compatibility: 'Windows, macOS, Linux',
    features: ['Container Management', 'Kubernetes', 'Registry', 'Volume Management', 'Network Config'],
    description: 'Platform for developing, shipping, and running applications in containers with easy desktop management.',
    website: 'https://docker.com',
    freeTrial: true,
    supportedPlatforms: ['Windows', 'macOS', 'Linux'],
  },
  {
    name: 'GitHub',
    category: 'Version Control',
    pricing: {
      type: 'freemium',
      currency: '$',
      amount: 4,
      billingPeriod: 'month',
      totalYearlyPrice: 48,
    },
    images: [
      '/images/hesperia-barcelona.jpg', // Placeholder - would be GitHub screenshots
      '/images/hesperia-barcelona.jpg',
      '/images/hesperia-barcelona.jpg',
      '/images/hesperia-barcelona.jpg',
      '/images/hesperia-barcelona.jpg',
    ],
    rating: { value: 4.8, count: 5 },
    reviews: 45000,
    compatibility: 'Web, Desktop, Mobile',
    features: ['Git Hosting', 'Pull Requests', 'Issues', 'Actions CI/CD', 'Project Management'],
    description: 'Web-based Git repository hosting service with collaboration features and integrated CI/CD.',
    website: 'https://github.com',
    freeTrial: true,
    supportedPlatforms: ['Web', 'Windows', 'macOS', 'iOS', 'Android'],
  },
  {
    name: 'Notion',
    category: 'Productivity',
    pricing: {
      type: 'freemium',
      currency: '$',
      amount: 8,
      billingPeriod: 'month',
      totalYearlyPrice: 96,
    },
    images: [
      '/images/hotel-1.jpg', // Placeholder - would be Notion screenshots
      '/images/hotel-1.jpg',
      '/images/hotel-1.jpg',
      '/images/hotel-1.jpg',
      '/images/hotel-1.jpg',
    ],
    rating: { value: 4.5, count: 5 },
    reviews: 15000,
    compatibility: 'Web, Desktop, Mobile',
    features: ['Block Editor', 'Databases', 'Collaboration', 'Templates', 'API Integration'],
    description: 'All-in-one workspace for notes, tasks, wikis, and databases with powerful collaboration features.',
    website: 'https://notion.so',
    freeTrial: true,
    supportedPlatforms: ['Web', 'Windows', 'macOS', 'iOS', 'Android'],
  },
  {
    name: 'Postman',
    category: 'API Development',
    pricing: {
      type: 'freemium',
      currency: '$',
      amount: 12,
      billingPeriod: 'month',
      totalYearlyPrice: 144,
    },
    images: [
      '/images/hesperia-barcelona.jpg', // Placeholder - would be Postman screenshots
      '/images/hesperia-barcelona.jpg',
      '/images/hesperia-barcelona.jpg',
      '/images/hesperia-barcelona.jpg',
      '/images/hesperia-barcelona.jpg',
    ],
    rating: { value: 4.6, count: 5 },
    reviews: 12000,
    compatibility: 'Web, Desktop',
    features: ['API Testing', 'Collections', 'Environments', 'Documentation', 'Mock Servers'],
    description: 'API development environment for testing, documenting, and monitoring APIs with team collaboration.',
    website: 'https://postman.com',
    freeTrial: true,
    supportedPlatforms: ['Web', 'Windows', 'macOS', 'Linux'],
  },
];

export const toolCategories = [
  'Code Editor',
  'Design Tool',
  'DevOps',
  'Version Control',
  'Productivity',
  'API Development',
  'Database',
  'Testing',
  'Monitoring',
  'Security',
  'Mobile Development',
  'Data Science'
];