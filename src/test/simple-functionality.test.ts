import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Core Functionality Tests', () => {
  describe('Utility Functions', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toBe('base-class additional-class');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', {
        'active': true,
        'disabled': false,
      });
      expect(result).toBe('base active');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end');
      expect(result).toBe('base end');
    });

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('Data Validation', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('invalid-email')).toBe(false);
      expect(emailRegex.test('test@')).toBe(false);
      expect(emailRegex.test('@example.com')).toBe(false);
    });

    it('should validate URL format', () => {
      const urlRegex = /^https?:\/\/.+/;
      
      expect(urlRegex.test('https://example.com')).toBe(true);
      expect(urlRegex.test('http://example.com')).toBe(true);
      expect(urlRegex.test('example.com')).toBe(false);
      expect(urlRegex.test('ftp://example.com')).toBe(false);
    });

    it('should validate tool name requirements', () => {
      const isValidToolName = (name: string) => {
        return !!(name && name.length >= 2 && name.length <= 100);
      };

      expect(isValidToolName('VS Code')).toBe(true);
      expect(isValidToolName('A')).toBe(false);
      expect(isValidToolName('')).toBe(false);
      expect(isValidToolName('A'.repeat(101))).toBe(false);
    });
  });

  describe('Array Operations', () => {
    it('should filter unique items', () => {
      const items = [1, 2, 2, 3, 3, 4];
      const unique = [...new Set(items)];
      expect(unique).toEqual([1, 2, 3, 4]);
    });

    it('should sort items alphabetically', () => {
      const tools = ['WebStorm', 'VS Code', 'Atom'];
      const sorted = tools.sort();
      expect(sorted).toEqual(['Atom', 'VS Code', 'WebStorm']);
    });

    it('should group items by category', () => {
      const tools = [
        { name: 'VS Code', category: 'Development' },
        { name: 'Figma', category: 'Design' },
        { name: 'WebStorm', category: 'Development' }
      ];

      const grouped = tools.reduce((acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      }, {} as Record<string, typeof tools>);

      expect(grouped.Development).toHaveLength(2);
      expect(grouped.Design).toHaveLength(1);
    });
  });

  describe('String Operations', () => {
    it('should format tool descriptions', () => {
      const description = '  A powerful code editor  ';
      const formatted = description.trim();
      expect(formatted).toBe('A powerful code editor');
    });

    it('should create tool slugs', () => {
      const createSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      };

      expect(createSlug('VS Code')).toBe('vs-code');
      expect(createSlug('WebStorm IDE')).toBe('webstorm-ide');
      expect(createSlug('Node.js Runtime')).toBe('nodejs-runtime');
    });

    it('should truncate long text', () => {
      const truncate = (text: string, maxLength: number) => {
        return text.length > maxLength 
          ? text.substring(0, maxLength) + '...'
          : text;
      };

      const longText = 'This is a very long description that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
      expect(truncate('Short', 20)).toBe('Short');
    });
  });

  describe('Object Manipulation', () => {
    it('should deep clone objects', () => {
      const original = { 
        name: 'Tool', 
        features: ['feature1', 'feature2'],
        config: { enabled: true }
      };
      
      const cloned = JSON.parse(JSON.stringify(original));
      cloned.name = 'New Tool';
      cloned.features.push('feature3');
      
      expect(original.name).toBe('Tool');
      expect(original.features).toHaveLength(2);
      expect(cloned.name).toBe('New Tool');
      expect(cloned.features).toHaveLength(3);
    });

    it('should merge objects correctly', () => {
      const defaults = { theme: 'light', notifications: true };
      const userPrefs = { theme: 'dark' };
      
      const merged = { ...defaults, ...userPrefs };
      
      expect(merged).toEqual({
        theme: 'dark',
        notifications: true
      });
    });

    it('should extract specific properties', () => {
      const tool = {
        id: 1,
        name: 'VS Code',
        description: 'Code editor',
        internal_field: 'secret'
      };

      const { internal_field, ...publicTool } = tool;
      
      expect(publicTool).toEqual({
        id: 1,
        name: 'VS Code',
        description: 'Code editor'
      });
      expect(publicTool).not.toHaveProperty('internal_field');
    });
  });

  describe('Date Operations', () => {
    it('should format dates consistently', () => {
      const date = new Date('2025-01-01T12:00:00Z');
      const formatted = date.toLocaleDateString('en-US');
      
      expect(formatted).toBe('1/1/2025');
    });

    it('should calculate relative time', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const daysDiff = Math.floor((now.getTime() - yesterday.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(daysDiff).toBe(1);
    });

    it('should validate date ranges', () => {
      const isValidDateRange = (start: Date, end: Date) => {
        return start <= end;
      };

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      const invalidEnd = new Date('2024-12-01');

      expect(isValidDateRange(startDate, endDate)).toBe(true);
      expect(isValidDateRange(startDate, invalidEnd)).toBe(false);
    });
  });

  describe('Search and Filter Logic', () => {
    const sampleTools = [
      { name: 'VS Code', category: 'Development', tags: ['editor', 'microsoft'] },
      { name: 'Figma', category: 'Design', tags: ['ui', 'design'] },
      { name: 'WebStorm', category: 'Development', tags: ['ide', 'jetbrains'] },
      { name: 'React', category: 'Development', tags: ['library', 'javascript'] }
    ];

    it('should filter by category', () => {
      const devTools = sampleTools.filter(tool => tool.category === 'Development');
      expect(devTools).toHaveLength(3);
    });

    it('should search by name', () => {
      const query = 'vs';
      const results = sampleTools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('VS Code');
    });

    it('should search by tags', () => {
      const results = sampleTools.filter(tool =>
        tool.tags.some(tag => tag.includes('script'))
      );
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('React');
    });

    it('should combine multiple filters', () => {
      const results = sampleTools.filter(tool =>
        tool.category === 'Development' && 
        tool.tags.some(tag => tag.includes('ide'))
      );
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('WebStorm');
    });
  });
});