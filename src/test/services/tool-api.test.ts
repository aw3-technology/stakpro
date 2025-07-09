import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as toolApi from '@/lib/tool-api';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      execute: vi.fn()
    })),
    auth: {
      getUser: vi.fn()
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn()
      }))
    }
  }
}));

describe('Tool API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getApprovedTools', () => {
    it('should fetch approved tools from database', async () => {
      const mockTools = [
        { 
          id: 1, 
          name: 'Tool 1', 
          status: 'approved',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          pricing: { model: 'free' },
          features: ['feature1'],
          integrations: { tools: [] },
          platforms: ['web'],
          description: 'Test tool description',
          category: 'Development',
          website: 'https://example.com',
          logo: null,
          rating: 4.5,
          review_count: 10,
          tags: ['test'],
          compatibility: {}
        }
      ];

      const fromSpy = vi.spyOn(supabase, 'from');
      fromSpy.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockTools, error: null })
      } as any);

      const result = await toolApi.getApprovedTools();

      expect(fromSpy).toHaveBeenCalledWith('tools');
      expect(result).toBeDefined();
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError })
      } as any);

      const result = await toolApi.getApprovedTools();
      
      expect(result).toEqual([]);
    });
  });

  describe('searchTools', () => {
    it('should search tools by query', async () => {
      const mockSearchResults = [
        { 
          id: 1, 
          name: 'React Tool', 
          description: 'A React development tool',
          status: 'approved',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          category: 'Development',
          website: 'https://example.com',
          logo: null,
          rating: 4.5,
          review_count: 10,
          tags: ['react'],
          compatibility: {},
          pricing: { model: 'free' },
          features: ['feature1'],
          integrations: { tools: [] },
          platforms: ['web']
        }
      ];

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSearchResults, error: null })
      } as any);

      const result = await toolApi.searchTools('react');

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty search query', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null })
      } as any);

      const result = await toolApi.searchTools('');
      
      expect(result).toEqual([]);
    });

    it('should filter results by query', async () => {
      const mockResults = [
        { 
          id: 1, 
          name: 'Dev Tool', 
          category: 'Development',
          status: 'approved',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          description: 'A development tool',
          website: 'https://example.com',
          logo: null,
          rating: 4.5,
          review_count: 10,
          tags: ['development'],
          compatibility: {},
          pricing: { model: 'free' },
          features: ['feature1'],
          integrations: { tools: [] },
          platforms: ['web']
        }
      ];

      const fromSpy = vi.spyOn(supabase, 'from');
      
      fromSpy.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockResults, error: null })
      } as any);

      const result = await toolApi.searchTools('development');

      expect(result.length).toBeGreaterThan(0);
      expect(fromSpy).toHaveBeenCalledWith('tools');
    });
  });

  describe('getToolsByCategory', () => {
    it('should fetch tools by category', async () => {
      const mockTools = [
        { 
          id: 1, 
          name: 'Dev Tool 1', 
          category: 'Development',
          status: 'approved',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          description: 'Development tool 1',
          website: 'https://example1.com',
          logo: null,
          rating: 4.5,
          review_count: 10,
          tags: ['development'],
          compatibility: {},
          pricing: { model: 'free' },
          features: ['feature1'],
          integrations: { tools: [] },
          platforms: ['web']
        },
        { 
          id: 2, 
          name: 'Dev Tool 2', 
          category: 'Development',
          status: 'approved',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          description: 'Development tool 2',
          website: 'https://example2.com',
          logo: null,
          rating: 4.0,
          review_count: 15,
          tags: ['development'],
          compatibility: {},
          pricing: { model: 'paid' },
          features: ['feature2'],
          integrations: { tools: [] },
          platforms: ['web']
        }
      ];

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockTools, error: null })
      } as any);

      const result = await toolApi.getToolsByCategory('development');

      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Development');
    });
  });

  describe('submitTool', () => {
    it('should submit a new tool', async () => {
      const mockUser = { id: 'user123' };
      const mockTool = {
        name: 'New Tool',
        description: 'A new development tool',
        category: 'Development',
        website: 'https://newtool.com',
        pricingType: 'free',
        startingPrice: 0,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: ['feature1', 'feature2'],
        tags: ['development', 'tool'],
        compatibility: { web: true },
        submitterName: 'Test User',
        submitterEmail: 'test@example.com'
      };

      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      } as any);

      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 1, ...mockTool, user_id: mockUser.id },
          error: null
        })
      } as any);

      const result = await toolApi.submitTool(mockTool as any);

      expect(result.success).toBe(true);
      expect(result.id).toBe(1);
    });

    it('should handle database errors gracefully', async () => {
      const mockUser = { id: 'user123' };
      
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      } as any);

      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' }
        })
      } as any);

      const result = await toolApi.submitTool({
        name: 'Test Tool',
        description: 'Test Description',
        category: 'Development',
        website: 'https://test.com',
        pricingType: 'free',
        startingPrice: 0,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: [],
        tags: [],
        compatibility: {},
        submitterName: 'Test User',
        submitterEmail: 'test@example.com'
      } as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
    });

    it('should handle successful submissions', async () => {
      const mockUser = { id: 'user123' };
      const mockTool = {
        name: 'Tool without Logo',
        description: 'Tool description',
        category: 'Development',
        website: 'https://tool.com',
        pricingType: 'free',
        startingPrice: 0,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: ['feature1'],
        tags: ['tag1'],
        compatibility: { web: true },
        submitterName: 'Test User',
        submitterEmail: 'test@example.com'
      };

      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      } as any);

      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 1 },
          error: null
        })
      } as any);

      const result = await toolApi.submitTool(mockTool as any);

      expect(result.success).toBe(true);
      expect(result.id).toBe(1);
    });
  });

  describe('getCategoryStats', () => {
    it('should fetch category statistics', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [
          { category: 'Development' },
          { category: 'Development' },
          { category: 'Design' }
        ], error: null })
      } as any);

      const result = await toolApi.getCategoryStats();

      expect(result).toEqual({ development: 2, design: 1 });
    });
  });
});