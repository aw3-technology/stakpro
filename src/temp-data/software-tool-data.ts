export interface SoftwareToolModel {
  name: string;
  category: string;
  logo: string;
  pricing: {
    type: 'free' | 'freemium' | 'paid';
    startingPrice?: number;
    currency?: string;
    billingPeriod?: 'month' | 'year' | 'one-time';
  };
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  website: string;
  tags: string[];
  compatibility: string[];
  lastUpdated: string;
}

export const softwareToolData: SoftwareToolModel[] = [
  {
    name: 'Visual Studio Code',
    category: 'Code Editor',
    logo: '/icons/vscode.svg',
    pricing: {
      type: 'free'
    },
    description: 'Lightweight but powerful source code editor with built-in support for JavaScript, TypeScript and Node.js.',
    features: [
      'IntelliSense code completion',
      'Built-in Git integration',
      'Extensive extension marketplace',
      'Integrated terminal',
      'Debugging support'
    ],
    rating: 4.8,
    reviewCount: 25000,
    website: 'https://code.visualstudio.com',
    tags: ['editor', 'development', 'microsoft', 'open-source'],
    compatibility: ['Windows', 'macOS', 'Linux'],
    lastUpdated: '2024-01-15'
  },
  {
    name: 'Figma',
    category: 'Design Tool',
    logo: '/icons/figma.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 12,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'Collaborative interface design tool with real-time collaboration features.',
    features: [
      'Real-time collaboration',
      'Vector editing tools',
      'Prototyping capabilities',
      'Design systems',
      'Developer handoff'
    ],
    rating: 4.7,
    reviewCount: 18000,
    website: 'https://figma.com',
    tags: ['design', 'ui/ux', 'collaboration', 'prototyping'],
    compatibility: ['Web', 'Desktop'],
    lastUpdated: '2024-01-10'
  },
  {
    name: 'Docker',
    category: 'DevOps',
    logo: '/icons/docker.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 9,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'Platform for developing, shipping, and running applications in containers.',
    features: [
      'Container virtualization',
      'Application isolation',
      'Scalable deployments',
      'Cross-platform support',
      'Registry for image sharing'
    ],
    rating: 4.6,
    reviewCount: 22000,
    website: 'https://docker.com',
    tags: ['containers', 'devops', 'deployment', 'virtualization'],
    compatibility: ['Windows', 'macOS', 'Linux'],
    lastUpdated: '2024-01-12'
  },
  {
    name: 'Notion',
    category: 'Productivity',
    logo: '/icons/notion.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 8,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    features: [
      'Block-based editor',
      'Database functionality',
      'Team collaboration',
      'Template library',
      'API integration'
    ],
    rating: 4.5,
    reviewCount: 15000,
    website: 'https://notion.so',
    tags: ['productivity', 'notes', 'collaboration', 'database'],
    compatibility: ['Web', 'Desktop', 'Mobile'],
    lastUpdated: '2024-01-08'
  },
  {
    name: 'Slack',
    category: 'Communication',
    logo: '/icons/slack.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 7.25,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'Business communication platform with channels, direct messaging, and integrations.',
    features: [
      'Channel-based messaging',
      'File sharing',
      'App integrations',
      'Voice and video calls',
      'Workflow automation'
    ],
    rating: 4.4,
    reviewCount: 30000,
    website: 'https://slack.com',
    tags: ['communication', 'team', 'messaging', 'collaboration'],
    compatibility: ['Web', 'Desktop', 'Mobile'],
    lastUpdated: '2024-01-05'
  },
  {
    name: 'GitHub',
    category: 'Version Control',
    logo: '/icons/github.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 4,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'Web-based Git repository hosting service with collaboration features.',
    features: [
      'Git repository hosting',
      'Pull requests',
      'Issue tracking',
      'Actions CI/CD',
      'Project management'
    ],
    rating: 4.8,
    reviewCount: 45000,
    website: 'https://github.com',
    tags: ['git', 'version-control', 'collaboration', 'open-source'],
    compatibility: ['Web', 'Desktop', 'Mobile'],
    lastUpdated: '2024-01-14'
  },
  {
    name: 'Postman',
    category: 'API Development',
    logo: '/icons/postman.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 12,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'API development environment for testing, documenting, and monitoring APIs.',
    features: [
      'API testing',
      'Request collections',
      'Environment variables',
      'Documentation generation',
      'Mock servers'
    ],
    rating: 4.6,
    reviewCount: 12000,
    website: 'https://postman.com',
    tags: ['api', 'testing', 'development', 'documentation'],
    compatibility: ['Web', 'Desktop'],
    lastUpdated: '2024-01-11'
  },
  {
    name: 'Trello',
    category: 'Project Management',
    logo: '/icons/trello.svg',
    pricing: {
      type: 'freemium',
      startingPrice: 5,
      currency: '$',
      billingPeriod: 'month'
    },
    description: 'Kanban-style project management tool with boards, lists, and cards.',
    features: [
      'Kanban boards',
      'Card-based tasks',
      'Team collaboration',
      'Power-ups',
      'Calendar integration'
    ],
    rating: 4.3,
    reviewCount: 20000,
    website: 'https://trello.com',
    tags: ['project-management', 'kanban', 'collaboration', 'organization'],
    compatibility: ['Web', 'Desktop', 'Mobile'],
    lastUpdated: '2024-01-07'
  }
];

export const toolCategories = [
  'Code Editor',
  'Design Tool',
  'DevOps',
  'Productivity',
  'Communication',
  'Version Control',
  'API Development',
  'Project Management',
  'Database',
  'Testing',
  'Monitoring',
  'Security'
];