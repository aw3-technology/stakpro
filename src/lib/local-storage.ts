import { AddToolFormData } from '@/pages/app-layout/add-tool/components/add-tool-form-schema';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

const TOOLS_STORAGE_KEY = 'stakpro-submitted-tools';

export const saveToolToLocalStorage = (toolData: AddToolFormData): string => {
  const tools = getSubmittedTools();
  const id = `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const tool: SoftwareToolModel & { submittedBy: string; submittedAt: string; status: 'pending' | 'approved' | 'rejected' } = {
    name: toolData.name,
    category: toolData.category,
    logo: toolData.logo || '/icons/unknown-icon.svg',
    pricing: {
      type: toolData.pricingType,
      startingPrice: toolData.startingPrice,
      currency: toolData.currency || 'USD',
      billingPeriod: toolData.billingPeriod,
    },
    description: toolData.description,
    features: toolData.features.filter(f => f.trim() !== ''),
    rating: 0, // New tools start with no rating
    reviewCount: 0,
    website: toolData.website,
    tags: toolData.tags.filter(t => t.trim() !== ''),
    compatibility: toolData.compatibility,
    lastUpdated: new Date().toISOString().split('T')[0],
    submittedBy: toolData.submitterName,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };

  tools.push({ id, ...tool });
  localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
  return id;
};

export const getSubmittedTools = () => {
  try {
    const stored = localStorage.getItem(TOOLS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const approveSubmittedTool = (id: string) => {
  const tools = getSubmittedTools();
  const toolIndex = tools.findIndex((t: any) => t.id === id);
  if (toolIndex !== -1) {
    tools[toolIndex].status = 'approved';
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
  }
};

export const getApprovedTools = (): SoftwareToolModel[] => {
  return getSubmittedTools()
    .filter((tool: any) => tool.status === 'approved')
    .map((tool: any) => {
      const { id, submittedBy, submittedAt, status, ...cleanTool } = tool;
      return cleanTool;
    });
};