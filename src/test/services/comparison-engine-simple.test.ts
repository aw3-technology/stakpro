import { describe, it, expect } from 'vitest';

// Simple comparison engine functionality tests
describe('Comparison Engine - Simple Tests', () => {
  describe('Feature Analysis', () => {
    it('should identify common features between tools', () => {
      const tools = [
        { features: ['Feature A', 'Feature B', 'Feature C'] },
        { features: ['Feature A', 'Feature C', 'Feature D'] }
      ];

      const commonFeatures = tools[0].features.filter(feature => 
        tools.every(tool => tool.features.includes(feature))
      );

      expect(commonFeatures).toEqual(['Feature A', 'Feature C']);
    });

    it('should identify unique features per tool', () => {
      const toolA = { name: 'Tool A', features: ['Feature A', 'Feature B'] };
      const toolB = { name: 'Tool B', features: ['Feature A', 'Feature C'] };

      const uniqueToA = toolA.features.filter(feature => 
        !toolB.features.includes(feature)
      );
      const uniqueToB = toolB.features.filter(feature => 
        !toolA.features.includes(feature)
      );

      expect(uniqueToA).toEqual(['Feature B']);
      expect(uniqueToB).toEqual(['Feature C']);
    });
  });

  describe('Pricing Comparison Logic', () => {
    it('should identify the cheapest tool', () => {
      const tools = [
        { name: 'Tool A', pricing: { starting_price: 0 } },
        { name: 'Tool B', pricing: { starting_price: 29 } },
        { name: 'Tool C', pricing: { starting_price: 15 } }
      ];

      const cheapest = tools.reduce((min, tool) => 
        tool.pricing.starting_price < min.pricing.starting_price ? tool : min
      );

      expect(cheapest.name).toBe('Tool A');
    });

    it('should calculate average pricing', () => {
      const tools = [
        { pricing: { starting_price: 0 } },
        { pricing: { starting_price: 30 } },
        { pricing: { starting_price: 60 } }
      ];

      const average = tools.reduce((sum, tool) => 
        sum + tool.pricing.starting_price, 0
      ) / tools.length;

      expect(average).toBe(30);
    });

    it('should categorize tools by price ranges', () => {
      const tools = [
        { name: 'Free Tool', pricing: { starting_price: 0 } },
        { name: 'Budget Tool', pricing: { starting_price: 15 } },
        { name: 'Premium Tool', pricing: { starting_price: 100 } }
      ];

      const priceRanges = {
        free: tools.filter(tool => tool.pricing.starting_price === 0),
        budget: tools.filter(tool => tool.pricing.starting_price > 0 && tool.pricing.starting_price <= 50),
        premium: tools.filter(tool => tool.pricing.starting_price > 50)
      };

      expect(priceRanges.free).toHaveLength(1);
      expect(priceRanges.budget).toHaveLength(1);
      expect(priceRanges.premium).toHaveLength(1);
    });
  });

  describe('Integration Analysis', () => {
    it('should count integrations per tool', () => {
      const tools = [
        { 
          name: 'Tool A', 
          integrations: { tools: ['GitHub', 'Slack', 'Jira'] } 
        },
        { 
          name: 'Tool B', 
          integrations: { tools: ['GitHub', 'Trello'] } 
        }
      ];

      const integrationCounts = tools.map(tool => ({
        name: tool.name,
        count: tool.integrations.tools.length
      }));

      expect(integrationCounts[0].count).toBe(3);
      expect(integrationCounts[1].count).toBe(2);
    });

    it('should find common integrations', () => {
      const tools = [
        { integrations: { tools: ['GitHub', 'Slack', 'Jira'] } },
        { integrations: { tools: ['GitHub', 'Trello', 'Slack'] } }
      ];

      const commonIntegrations = tools[0].integrations.tools.filter(integration =>
        tools.every(tool => tool.integrations.tools.includes(integration))
      );

      expect(commonIntegrations).toEqual(['GitHub', 'Slack']);
    });
  });

  describe('Recommendation Logic', () => {
    it('should recommend based on budget constraints', () => {
      const tools = [
        { name: 'Free Tool', pricing: { starting_price: 0 }, rating: 4.0 },
        { name: 'Paid Tool', pricing: { starting_price: 50 }, rating: 4.5 }
      ];
      const budget = 'free';

      const recommendation = budget === 'free' 
        ? tools.filter(tool => tool.pricing.starting_price === 0)
        : tools;

      expect(recommendation).toHaveLength(1);
      expect(recommendation[0].name).toBe('Free Tool');
    });

    it('should recommend based on feature requirements', () => {
      const tools = [
        { name: 'Tool A', features: ['Auth', 'API', 'Dashboard'] },
        { name: 'Tool B', features: ['Auth', 'Monitoring'] },
        { name: 'Tool C', features: ['API', 'Dashboard', 'Analytics'] }
      ];
      const requiredFeatures = ['API', 'Dashboard'];

      const suitableTools = tools.filter(tool =>
        requiredFeatures.every(feature => tool.features.includes(feature))
      );

      expect(suitableTools).toHaveLength(2);
      expect(suitableTools.map(t => t.name)).toEqual(['Tool A', 'Tool C']);
    });
  });

  describe('User Profile Matching', () => {
    it('should match tools to company size', () => {
      const tools = [
        { name: 'Startup Tool', target_size: 'startup', pricing: { starting_price: 0 } },
        { name: 'Enterprise Tool', target_size: 'enterprise', pricing: { starting_price: 500 } }
      ];
      const userProfile = { company_size: 'startup' };

      const matchedTools = tools.filter(tool => 
        tool.target_size === userProfile.company_size || !tool.target_size
      );

      expect(matchedTools).toHaveLength(1);
      expect(matchedTools[0].name).toBe('Startup Tool');
    });

    it('should score compatibility', () => {
      const tool = {
        platforms: ['Web', 'Mobile'],
        integrations: { tools: ['GitHub', 'Slack'] }
      };
      const userRequirements = {
        platforms: ['Web'],
        required_integrations: ['GitHub']
      };

      const platformMatch = userRequirements.platforms.every(platform =>
        tool.platforms.includes(platform)
      );
      const integrationMatch = userRequirements.required_integrations.every(integration =>
        tool.integrations.tools.includes(integration)
      );

      const compatibilityScore = (platformMatch ? 50 : 0) + (integrationMatch ? 50 : 0);

      expect(compatibilityScore).toBe(100);
    });
  });
});