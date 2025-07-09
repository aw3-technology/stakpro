import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.describe('Authentication Flow', () => {
    test('should allow user to sign up', async ({ page }) => {
      await page.goto('/sign-up');
      
      // Fill registration form
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');
      await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
      
      // Submit form
      await page.click('button[type="submit"]:has-text("Sign Up")');
      
      // Should redirect to home or show success message
      await expect(page).toHaveURL(/\/|dashboard/);
    });

    test('should allow user to login', async ({ page }) => {
      await page.goto('/login');
      
      // Fill login form
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');
      
      // Submit form
      await page.click('button[type="submit"]:has-text("Login")');
      
      // Should redirect to authenticated area
      await expect(page).toHaveURL(/\/|dashboard|home/);
    });

    test('should handle password reset', async ({ page }) => {
      await page.goto('/login');
      
      // Click forgot password
      await page.click('a:has-text("Forgot"), button:has-text("Forgot")');
      
      // Should navigate to password reset
      await expect(page).toHaveURL(/password-reset|forgot/);
      
      // Fill email
      await page.fill('input[type="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=email sent, text=check your email')).toBeVisible();
    });
  });

  test.describe('Tool Management Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authenticated state or login
      await page.goto('/');
    });

    test('should allow saving and managing tools', async ({ page }) => {
      // Navigate to explore page
      await page.goto('/explore');
      
      // Wait for tools to load
      await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
      
      // Save a tool
      const firstTool = page.locator('[data-testid="tool-card"]').first();
      const saveButton = firstTool.locator('button:has-text("Save")');
      
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // Navigate to saved tools
        await page.goto('/saved');
        
        // Should see saved tool
        await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
      }
    });

    test('should allow tool submission', async ({ page }) => {
      await page.goto('/add-tool');
      
      // Fill tool submission form
      await page.fill('input[name="name"]', 'Test Tool');
      await page.fill('textarea[name="description"]', 'A test development tool');
      await page.fill('input[name="website"]', 'https://testtool.com');
      
      // Select category
      await page.selectOption('select[name="category"]', 'Development');
      
      // Submit form
      await page.click('button[type="submit"]:has-text("Submit")');
      
      // Should show success message
      await expect(page.locator('text=submitted, text=review')).toBeVisible();
    });

    test('should support tool comparison', async ({ page }) => {
      await page.goto('/explore');
      
      // Select tools for comparison
      const toolCards = page.locator('[data-testid="tool-card"]');
      await expect(toolCards).toHaveCount.toBeGreaterThan(1);
      
      // Look for comparison functionality
      const compareCheckboxes = page.locator('input[type="checkbox"]:near([data-testid="tool-card"])');
      
      if (await compareCheckboxes.first().isVisible()) {
        await compareCheckboxes.first().check();
        await compareCheckboxes.nth(1).check();
        
        // Trigger comparison
        const compareButton = page.locator('button:has-text("Compare")');
        await compareButton.click();
        
        // Should show comparison interface
        await expect(page.locator('.comparison-table, [data-testid="comparison"]')).toBeVisible();
      }
    });
  });

  test.describe('AI Assistant Flow', () => {
    test('should provide tool recommendations via chat', async ({ page }) => {
      await page.goto('/');
      
      // Start a conversation
      const chatInput = page.locator('textarea[placeholder*="message"]');
      await chatInput.fill('I need tools for a React project with TypeScript');
      await page.click('button[type="submit"]');
      
      // Should get AI response
      await expect(page.locator('[data-role="assistant"]')).toBeVisible({ timeout: 15000 });
      
      // Response should contain tool recommendations
      await expect(page.locator('text=VS Code, text=WebStorm, text=React')).toBeVisible();
    });

    test('should handle follow-up questions', async ({ page }) => {
      await page.goto('/');
      
      // Initial question
      const chatInput = page.locator('textarea[placeholder*="message"]');
      await chatInput.fill('What are good databases for web apps?');
      await page.click('button[type="submit"]');
      
      // Wait for response
      await expect(page.locator('[data-role="assistant"]')).toBeVisible({ timeout: 15000 });
      
      // Ask follow-up
      await chatInput.fill('Which one is best for a startup?');
      await page.click('button[type="submit"]');
      
      // Should get contextual response
      await expect(page.locator('[data-role="assistant"]').nth(1)).toBeVisible({ timeout: 15000 });
    });

    test('should provide personalized recommendations', async ({ page }) => {
      await page.goto('/');
      
      // Provide context about tech stack
      const chatInput = page.locator('textarea[placeholder*="message"]');
      await chatInput.fill('I\'m building a Node.js API with PostgreSQL. What testing tools should I use?');
      await page.click('button[type="submit"]');
      
      // Should get relevant testing tool recommendations
      await expect(page.locator('[data-role="assistant"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('text=Jest, text=Mocha, text=testing')).toBeVisible();
    });
  });

  test.describe('Search and Discovery Flow', () => {
    test('should support comprehensive search workflow', async ({ page }) => {
      await page.goto('/explore');
      
      // Start with category browsing
      const categoryFilter = page.locator('select[name="category"], button:has-text("Development")');
      if (await categoryFilter.isVisible()) {
        await categoryFilter.click();
        await page.locator('text=Development').click();
      }
      
      // Refine with text search
      const searchInput = page.locator('input[type="search"]');
      await searchInput.fill('React');
      await page.keyboard.press('Enter');
      
      // Apply filters
      const filtersButton = page.locator('button:has-text("Filters")');
      if (await filtersButton.isVisible()) {
        await filtersButton.click();
        
        // Filter by free tools
        const freeFilter = page.locator('input[type="checkbox"]:near(text="Free")');
        if (await freeFilter.isVisible()) {
          await freeFilter.check();
        }
        
        // Apply filters
        const applyButton = page.locator('button:has-text("Apply")');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
      }
      
      // Should show filtered results
      await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
    });

    test('should support discovery through AI recommendations', async ({ page }) => {
      await page.goto('/');
      
      // Ask for recommendations
      const chatInput = page.locator('textarea[placeholder*="message"]');
      await chatInput.fill('Recommend tools for my tech stack');
      await page.click('button[type="submit"]');
      
      // Should get recommendations with links to tools
      await expect(page.locator('[data-role="assistant"]')).toBeVisible({ timeout: 15000 });
      
      // Look for actionable recommendations
      const toolLinks = page.locator('a:has-text("View Tool"), button:has-text("Explore")');
      if (await toolLinks.first().isVisible()) {
        await toolLinks.first().click();
        
        // Should navigate to tool details or explore page
        await expect(page).toHaveURL(/explore|tool/);
      }
    });
  });

  test.describe('Navigation and UX Flow', () => {
    test('should provide smooth navigation experience', async ({ page }) => {
      await page.goto('/');
      
      // Test main navigation
      await page.click('a[href="/explore"]');
      await expect(page).toHaveURL('/explore');
      await expect(page.locator('h1')).toBeVisible();
      
      // Navigate to saved tools
      await page.click('a[href="/saved"]');
      await expect(page).toHaveURL('/saved');
      
      // Return to home
      await page.click('a[href="/"]');
      await expect(page).toHaveURL('/');
      
      // Check that chat state is maintained
      if (await page.locator('[data-role="user"]').isVisible()) {
        await expect(page.locator('[data-role="user"]')).toBeVisible();
      }
    });

    test('should handle responsive design across devices', async ({ page }) => {
      // Test desktop
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto('/');
      await expect(page.locator('nav, .navbar')).toBeVisible();
      
      // Test tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await expect(page.locator('textarea[placeholder*="message"]')).toBeVisible();
      
      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await expect(page.locator('textarea[placeholder*="message"]')).toBeVisible();
      
      // Mobile navigation should work
      const mobileMenuButton = page.locator('button:has-text("Menu"), .mobile-menu-button');
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await expect(page.locator('.mobile-menu, [data-testid="mobile-nav"]')).toBeVisible();
      }
    });

    test('should handle error states gracefully', async ({ page }) => {
      // Navigate to non-existent page
      await page.goto('/non-existent-page');
      
      // Should show 404 page
      await expect(page.locator('h1:has-text("404"), h1:has-text("Not Found")')).toBeVisible();
      
      // Should have navigation back to home
      await page.click('a[href="/"], button:has-text("Home")');
      await expect(page).toHaveURL('/');
    });
  });
});