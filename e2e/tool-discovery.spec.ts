import { test, expect } from '@playwright/test';

test.describe('Tool Discovery and Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
  });

  test('should display the explore page with search functionality', async ({ page }) => {
    // Check page title and search input
    await expect(page.locator('h1')).toContainText(/explore|discover/i);
    await expect(page.locator('input[type="search"], input[placeholder*="search"]')).toBeVisible();
  });

  test('should perform text search for tools', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    
    // Search for React tools
    await searchInput.fill('React');
    await page.keyboard.press('Enter');
    
    // Should show search results
    await expect(page.locator('[data-testid="tool-card"], .tool-card')).toHaveCount.toBeGreaterThan(0);
    
    // Results should be relevant to React
    await expect(page.locator('text=React')).toBeVisible();
  });

  test('should filter tools by category', async ({ page }) => {
    // Look for category filters
    const categoryFilter = page.locator('select[name="category"], button:has-text("Development")').first();
    
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      
      // Select Development category
      await page.locator('text=Development').click();
      
      // Should show development tools
      await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
    }
  });

  test('should display tool cards with essential information', async ({ page }) => {
    // Wait for tools to load
    await expect(page.locator('[data-testid="tool-card"], .tool-card')).toHaveCount.toBeGreaterThan(0);
    
    const firstTool = page.locator('[data-testid="tool-card"], .tool-card').first();
    
    // Should show tool name, description, and other key info
    await expect(firstTool.locator('h3, .tool-name')).toBeVisible();
    await expect(firstTool.locator('p, .tool-description')).toBeVisible();
    await expect(firstTool.locator('.tool-category, [data-testid="category"]')).toBeVisible();
  });

  test('should handle tool card interactions', async ({ page }) => {
    await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
    
    const firstTool = page.locator('[data-testid="tool-card"]').first();
    
    // Should be able to save/bookmark tool
    const saveButton = firstTool.locator('button:has-text("Save"), button[aria-label*="save"]');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      // Should show saved state or confirmation
    }
    
    // Should be able to view more details
    const toolName = await firstTool.locator('h3, .tool-name').textContent();
    await firstTool.click();
    
    // Should navigate to tool details or show modal
    // (Implementation depends on your design)
  });

  test('should show no results message for invalid search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first();
    
    // Search for something that shouldn't exist
    await searchInput.fill('xyzinvalidtoolsearch123');
    await page.keyboard.press('Enter');
    
    // Should show no results message
    await expect(page.locator('text=No tools found, text=No results')).toBeVisible();
  });

  test('should support pagination or load more functionality', async ({ page }) => {
    // Look for pagination or "Load More" button
    const loadMoreButton = page.locator('button:has-text("Load More"), button:has-text("Show More")');
    const paginationNext = page.locator('button:has-text("Next"), .pagination button').last();
    
    if (await loadMoreButton.isVisible()) {
      const initialToolCount = await page.locator('[data-testid="tool-card"]').count();
      await loadMoreButton.click();
      
      // Should load more tools
      await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(initialToolCount);
    } else if (await paginationNext.isVisible()) {
      await paginationNext.click();
      // Should navigate to next page
      await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
    }
  });

  test('should maintain search state on page refresh', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first();
    
    // Perform a search
    await searchInput.fill('JavaScript');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
    
    // Refresh page
    await page.reload();
    
    // Search should be maintained
    await expect(searchInput).toHaveValue('JavaScript');
  });

  test('should handle advanced search filters', async ({ page }) => {
    // Look for advanced filters
    const filtersButton = page.locator('button:has-text("Filters"), button:has-text("Advanced")');
    
    if (await filtersButton.isVisible()) {
      await filtersButton.click();
      
      // Look for pricing filter
      const freeToolsFilter = page.locator('input[type="checkbox"]:near(text="Free")');
      if (await freeToolsFilter.isVisible()) {
        await freeToolsFilter.check();
        
        // Apply filters
        const applyButton = page.locator('button:has-text("Apply")');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }
        
        // Should show filtered results
        await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Search should work on mobile
    const searchInput = page.locator('input[type="search"]').first();
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('mobile test');
    await page.keyboard.press('Enter');
    
    // Tool cards should display properly on mobile
    await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(0);
  });

  test('should handle search suggestions', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first();
    
    // Start typing
    await searchInput.fill('Reac');
    
    // Look for search suggestions
    const suggestions = page.locator('[data-testid="search-suggestions"], .search-suggestions');
    if (await suggestions.isVisible()) {
      // Should show relevant suggestions
      await expect(suggestions.locator('text=React')).toBeVisible();
      
      // Should be able to click suggestion
      await suggestions.locator('text=React').first().click();
      await expect(searchInput).toHaveValue(/React/);
    }
  });

  test('should support comparison functionality', async ({ page }) => {
    await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.toBeGreaterThan(1);
    
    // Look for compare functionality
    const compareButtons = page.locator('button:has-text("Compare"), input[type="checkbox"]:near(text="Compare")');
    
    if (await compareButtons.first().isVisible()) {
      // Select tools for comparison
      await compareButtons.first().click();
      await compareButtons.nth(1).click();
      
      // Look for compare action button
      const compareAction = page.locator('button:has-text("Compare Selected")');
      if (await compareAction.isVisible()) {
        await compareAction.click();
        
        // Should navigate to comparison page
        await expect(page).toHaveURL(/compare/);
      }
    }
  });
});