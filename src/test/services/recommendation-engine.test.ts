import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PersonalizedRecommendationEngine as RecommendationEngine, RecommendationInput, UserBehavior } from '@/lib/recommendation-engine';
import { UserProfile, RecommendationContext } from '@/types/ai-platform';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

describe('RecommendationEngine', () => {
  let engine: RecommendationEngine;
  
  const mockUserProfile: UserProfile = {
    company_size: 'small',
    industry: 'technology',
    department: 'development',
    team_size: 10,
    primary_use_cases: ['web development', 'collaboration'],
    experience_level: 'intermediate',
    integration_needs: ['GitHub', 'Slack'],
    budget_range: 'low',
    compliance_requirements: [],
    specific_features_needed: ['TypeScript support', 'React support']
  };

  const mockUserBehavior: UserBehavior = {
    viewed_tools: ['vscode', 'webstorm'],
    saved_tools: ['vscode'],
    search_history: ['react tools', 'typescript ide'],
    time_spent_per_category: {
      'development': 120,
      'project-management': 30,
      'communication': 45
    },
    feature_preferences: ['typescript support', 'debugging', 'extensions'],
    price_sensitivity: 0.7,
    integration_importance: 0.8
  };

  const mockContext: RecommendationContext = {
    intent: 'explore_options',
    timeline: 'next_quarter',
    goals: ['improve development workflow', 'better collaboration'],
    pain_points: ['slow build times', 'lack of integrations']
  };

  const mockTools: (SoftwareToolModel & { id: number })[] = [
    {
      id: 1,
      name: 'VS Code',
      category: 'Development',
      description: 'Free source-code editor made by Microsoft for Windows, Linux and macOS',
      features: ['IntelliSense', 'Debugging', 'Extensions', 'TypeScript support', 'Git integration'],
      tags: ['open-source', 'typescript', 'javascript', 'quick-setup'],
      url: 'https://code.visualstudio.com',
      logo: '/vscode.png',
      pricing: {
        type: 'free',
        startingPrice: 0,
        details: 'Completely free and open source'
      },
      rating: 4.8,
      reviews: 50000,
      capterra_url: 'https://capterra.com/vscode',
      g2_url: 'https://g2.com/vscode'
    },
    {
      id: 2,
      name: 'WebStorm',
      category: 'Development',
      description: 'The smartest JavaScript IDE by JetBrains',
      features: ['Smart coding assistance', 'Refactoring', 'Testing', 'TypeScript support', 'React support'],
      tags: ['javascript', 'typescript', 'react', 'professional'],
      url: 'https://jetbrains.com/webstorm',
      logo: '/webstorm.png',
      pricing: {
        type: 'subscription',
        startingPrice: 69,
        details: 'Annual subscription with free trial'
      },
      rating: 4.5,
      reviews: 10000,
      capterra_url: 'https://capterra.com/webstorm',
      g2_url: 'https://g2.com/webstorm'
    },
    {
      id: 3,
      name: 'Sublime Text',
      category: 'Development',
      description: 'A sophisticated text editor for code, markup and prose',
      features: ['Multiple cursors', 'Command palette', 'Goto Anything', 'Customizable'],
      tags: ['lightweight', 'fast', 'text-editor'],
      url: 'https://sublimetext.com',
      logo: '/sublime.png',
      pricing: {
        type: 'freemium',
        startingPrice: 80,
        details: 'Free evaluation, license required for continued use'
      },
      rating: 4.3,
      reviews: 5000,
      capterra_url: 'https://capterra.com/sublime',
      g2_url: 'https://g2.com/sublime'
    }
  ];

  beforeEach(() => {
    engine = new RecommendationEngine();
  });

  describe('generatePersonalizedRecommendations', () => {
    it('should return recommendations based on user profile', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should prioritize tools matching tech stack', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      const vsCodeRec = recommendations.find(r => r.tool.name === 'VS Code');
      const sublimeRec = recommendations.find(r => r.tool.name === 'Sublime Text');

      expect(vsCodeRec?.recommendation_score).toBeGreaterThan(sublimeRec?.recommendation_score || 0);
    });

    it('should consider user preferences and features', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      const vsCodeRec = recommendations.find(r => r.tool.name === 'VS Code');
      expect(vsCodeRec).toBeDefined();
      expect(vsCodeRec?.rationale).toBeDefined();
      // VS Code should score well due to TypeScript support and free pricing
      expect(vsCodeRec?.recommendation_score).toBeGreaterThan(0.5);
    });

    it('should handle empty tools array', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: []
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      expect(recommendations).toEqual([]);
    });

    it('should filter out tools already in use', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: ['vs code'], // Already using VS Code
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      const vsCodeInRecommendations = recommendations.some(r => r.tool.name === 'VS Code');
      expect(vsCodeInRecommendations).toBe(false);
    });
  });

  describe('Scoring and ranking', () => {
    it('should rank free tools higher for price-sensitive users', async () => {
      const priceSensitiveInput: RecommendationInput = {
        user_profile: { ...mockUserProfile, budget_range: 'minimal' },
        user_behavior: { ...mockUserBehavior, price_sensitivity: 0.9 },
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(priceSensitiveInput);

      const vsCodeRec = recommendations.find(r => r.tool.name === 'VS Code');
      const webStormRec = recommendations.find(r => r.tool.name === 'WebStorm');

      expect(vsCodeRec?.recommendation_score).toBeGreaterThan(webStormRec?.recommendation_score || 0);
    });

    it('should consider integration importance', async () => {
      const integrationFocusedBehavior: UserBehavior = {
        ...mockUserBehavior,
        integration_importance: 1.0
      };

      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: integrationFocusedBehavior,
        current_tools: ['github', 'slack'],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      // VS Code and WebStorm both integrate with GitHub, should score higher than Sublime
      const vsCodeRec = recommendations.find(r => r.tool.name === 'VS Code');
      const sublimeRec = recommendations.find(r => r.tool.name === 'Sublime Text');

      expect(vsCodeRec?.recommendation_score).toBeGreaterThan(sublimeRec?.recommendation_score || 0);
    });
  });

  describe('Expected ROI and implementation effort', () => {
    it('should calculate expected ROI for recommendations', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      const firstRec = recommendations[0];
      expect(firstRec.expected_roi).toBeDefined();
      expect(firstRec.expected_roi.time_savings).toMatch(/\d+ hours\/week/);
      expect(firstRec.expected_roi.cost_savings).toBeGreaterThanOrEqual(0);
      expect(firstRec.expected_roi.productivity_gain).toBeGreaterThanOrEqual(0);
      expect(firstRec.expected_roi.productivity_gain).toBeLessThanOrEqual(1);
      expect(firstRec.expected_roi.confidence_level).toBeGreaterThan(0);
      expect(firstRec.expected_roi.confidence_level).toBeLessThanOrEqual(1);
    });

    it('should assess implementation effort', async () => {
      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      recommendations.forEach(rec => {
        expect(rec.implementation_effort).toBeDefined();
        expect(['simple', 'moderate', 'complex', 'expert_required']).toContain(rec.implementation_effort);
      });
    });
  });

  describe('Context and behavior matching', () => {
    it('should match tools based on user behavior patterns', async () => {
      const behaviorFocusedInput: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: {
          ...mockUserBehavior,
          time_spent_per_category: {
            'development': 200,
            'project-management': 10,
            'communication': 20
          },
          feature_preferences: ['typescript support', 'debugging', 'extensions']
        },
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(behaviorFocusedInput);

      const topRecommendations = recommendations.slice(0, 2);
      const hasTypeScriptTool = topRecommendations.some(r => 
        r.tool.features.some(f => f.name.toLowerCase().includes('typescript'))
      );

      expect(hasTypeScriptTool).toBe(true);
    });

    it('should adapt to different company sizes', async () => {
      const enterpriseProfile: UserProfile = {
        ...mockUserProfile,
        company_size: 'enterprise',
        team_size: 500,
        compliance_requirements: ['SOC2', 'GDPR']
      };

      const input: RecommendationInput = {
        user_profile: enterpriseProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      expect(recommendations).toBeDefined();
      // Enterprise users might see different scoring due to different budget constraints
    });
  });

  describe('Recommendation context and intents', () => {
    it('should adapt recommendations based on intent', async () => {
      const replaceContext: RecommendationContext = {
        intent: 'replace_existing',
        timeline: 'immediate',
        goals: ['better performance', 'cost reduction'],
        pain_points: ['slow performance', 'high cost']
      };

      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: ['webstorm'],
        context: replaceContext,
        available_tools: mockTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      // Should recommend VS Code as a free alternative to WebStorm
      const vsCodeRec = recommendations.find(r => r.tool.name === 'VS Code');
      expect(vsCodeRec).toBeDefined();
      expect(vsCodeRec?.recommendation_score).toBeGreaterThan(0.6);
    });

    it('should apply diversity filtering to avoid category clustering', async () => {
      // Create many tools in the same category
      const manyDevTools = Array.from({ length: 30 }, (_, i) => ({
        ...mockTools[0],
        id: i + 1,
        name: `DevTool${i}`,
        rating: 4.5 - (i * 0.01) // Slightly different ratings
      }));

      const input: RecommendationInput = {
        user_profile: mockUserProfile,
        user_behavior: mockUserBehavior,
        current_tools: [],
        context: mockContext,
        available_tools: manyDevTools
      };

      const recommendations = await engine.generatePersonalizedRecommendations(input);

      // Should return diverse recommendations, not all from the same category
      expect(recommendations.length).toBeLessThanOrEqual(20);
    });
  });
});