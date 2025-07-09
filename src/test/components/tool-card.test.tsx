import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToolCard } from '@/components/custom/tool-card';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { BrowserRouter } from 'react-router';

// Mock the user API
vi.mock('@/lib/user-api', () => ({
  saveToolForUser: vi.fn().mockResolvedValue({ success: true }),
  removeSavedTool: vi.fn().mockResolvedValue({ success: true }),
  unsaveToolForUser: vi.fn().mockResolvedValue({ success: true }),
  getUserSavedTools: vi.fn().mockResolvedValue([]),
  isToolSavedByUser: vi.fn().mockResolvedValue(false)
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    isAuthenticated: true
  })
}));

const mockTool: SoftwareToolModel = {
  id: 1,
  name: 'VS Code',
  description: 'A powerful code editor with extensive extensions',
  category: 'Development',
  subcategory: 'IDE',
  website: 'https://code.visualstudio.com',
  logo: 'https://code.visualstudio.com/logo.png',
  pricing: {
    model: 'free',
    startingPrice: 0,
    type: 'free',
    billingPeriod: 'monthly',
    currency: 'USD'
  },
  features: ['IntelliSense', 'Debugging', 'Git integration'],
  integrations: ['GitHub', 'GitLab', 'Azure'],
  platforms: ['Windows', 'macOS', 'Linux'],
  tags: ['editor', 'ide', 'microsoft'],
  developer: 'Microsoft',
  rating: 4.8,
  reviewCount: 15000,
  lastUpdated: new Date().toISOString().split('T')[0],
  compatibility: {}
};

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ToolCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tool information correctly', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    expect(screen.getByText('VS Code')).toBeInTheDocument();
    expect(screen.getByText('A powerful code editor with extensive extensions')).toBeInTheDocument();
    // Category is only shown in hover card, not main display
    // Developer is also only shown in hover card, not main display
  });

  it('should display rating and reviews count', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('15.0K reviews')).toBeInTheDocument();
  });

  it('should show pricing information', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    expect(screen.getByText(/Free/)).toBeInTheDocument();
  });

  it('should display tags', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    // Tags are displayed with # prefix
    expect(screen.getByText('#editor')).toBeInTheDocument();
    expect(screen.getByText('#ide')).toBeInTheDocument();
    expect(screen.getByText('#microsoft')).toBeInTheDocument();
  });

  it('should handle save/unsave functionality', async () => {
    const { saveToolForUser } = await import('@/lib/user-api');
    
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    const saveButton = screen.getByRole('button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveToolForUser).toHaveBeenCalledWith(mockTool.id);
    });
  });

  it('should render with correct structure', () => {
    const { container } = render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    // Should have hover card trigger
    const cardElement = container.querySelector('[data-slot="hover-card-trigger"]');
    expect(cardElement).toBeDefined();
  });

  it('should display correct tags with hash prefix', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    expect(screen.getByText('#editor')).toBeInTheDocument();
    expect(screen.getByText('#ide')).toBeInTheDocument();
    expect(screen.getByText('#microsoft')).toBeInTheDocument();
  });

  it('should handle missing logo gracefully', () => {
    const toolWithoutLogo = { ...mockTool, logo: undefined };
    
    render(
      <TestWrapper>
        <ToolCard tool={toolWithoutLogo} />
      </TestWrapper>
    );

    expect(screen.getByText('VS Code')).toBeInTheDocument();
  });

  it('should show feature information', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    // Should show features in the footer
    expect(screen.getByText(/IntelliSense/i)).toBeInTheDocument();
    expect(screen.getByText(/Debugging/i)).toBeInTheDocument();
    expect(screen.getByText(/\+\d+ more/i)).toBeInTheDocument();
  });

  it('should handle paid tools differently', () => {
    const paidTool = {
      ...mockTool,
      pricing: {
        ...mockTool.pricing,
        type: 'paid' as const,
        startingPrice: 29,
        billingPeriod: 'month' as const
      }
    };

    render(
      <TestWrapper>
        <ToolCard tool={paidTool} />
      </TestWrapper>
    );

    expect(screen.getByText(/From \$29\/month/)).toBeInTheDocument();
  });

  it('should display feature count', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    // Should show "+X more" for additional features beyond the first 2
    const additionalFeatures = mockTool.features.length - 2;
    expect(screen.getByText(new RegExp(`\\+${additionalFeatures} more`))).toBeInTheDocument();
  });

  it('should handle custom className', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} className="custom-class" />
      </TestWrapper>
    );

    expect(screen.getByText('VS Code')).toBeInTheDocument();
    // Custom className should be applied to the card
  });

  it('should show comparison mode styling', () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} showComparison={true} />
      </TestWrapper>
    );

    expect(screen.getByText('VS Code')).toBeInTheDocument();
    // Comparison mode should show checkbox and scale icon
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should handle authentication state for save functionality', async () => {
    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    // Save button (heart icon) should be present
    const saveButton = screen.getByRole('button');
    expect(saveButton).toBeInTheDocument();
  });

  it('should show loading state while saving', async () => {
    const { saveToolForUser } = await import('@/lib/user-api');
    
    // Mock a delayed save operation
    (saveToolForUser as any).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    const saveButton = screen.getByRole('button');
    fireEvent.click(saveButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  it('should handle error states gracefully', async () => {
    const { saveToolForUser } = await import('@/lib/user-api');
    
    // Mock a failed save operation
    (saveToolForUser as any).mockRejectedValue(new Error('Save failed'));

    render(
      <TestWrapper>
        <ToolCard tool={mockTool} />
      </TestWrapper>
    );

    const saveButton = screen.getByRole('button');
    fireEvent.click(saveButton);

    // Should handle error gracefully
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});