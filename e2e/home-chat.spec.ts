import { test, expect } from '@playwright/test';

test.describe('Home Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page with chat interface', async ({ page }) => {
    // Check for logo and heading
    await expect(page.locator('img[alt="Pixi Pro Logo"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Discover the perfect tools');
    
    // Check for chat input area
    await expect(page.locator('textarea[aria-label="Enter your prompt"]')).toBeVisible();
  });

  test('should show suggestions when no messages', async ({ page }) => {
    // Should show suggestion chips
    await expect(page.locator('text=Frontend stack')).toBeVisible();
    await expect(page.locator('text=Get inspired')).toBeVisible();
    await expect(page.locator('text=Discover new tools')).toBeVisible();
  });

  test('should send a message and receive response', async ({ page }) => {
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    const sendButton = page.locator('button[type="submit"]');
    
    // Type a message
    await chatInput.fill('What are the best React development tools?');
    await sendButton.click();
    
    // Check that user message appears
    await expect(page.locator('text=What are the best React development tools?')).toBeVisible();
    
    // Wait for AI response (this might take a moment)
    await expect(page.locator('[data-role="assistant"]')).toBeVisible({ timeout: 10000 });
  });

  test('should persist chat history on page refresh', async ({ page }) => {
    // Send a message
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    await chatInput.fill('Test message for persistence');
    await page.locator('button[type="submit"]').click();
    
    // Wait for message to appear
    await expect(page.locator('text=Test message for persistence')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Check that message is still there
    await expect(page.locator('text=Test message for persistence')).toBeVisible();
  });

  test('should show clear chat button when messages exist', async ({ page }) => {
    // Send a message first
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    await chatInput.fill('Test message');
    await page.locator('button[type="submit"]').click();
    
    // Wait for message to appear
    await expect(page.locator('text=Test message')).toBeVisible();
    
    // Clear button should be visible
    await expect(page.locator('button[aria-label*="Clear"]')).toBeVisible();
  });

  test('should clear chat when clear button is clicked', async ({ page }) => {
    // Send a message
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    await chatInput.fill('Message to be cleared');
    await page.locator('button[type="submit"]').click();
    
    // Wait for message
    await expect(page.locator('text=Message to be cleared')).toBeVisible();
    
    // Click clear button
    await page.locator('button[aria-label*="Clear"], button[title*="Clear"]').click();
    
    // Message should be gone and suggestions should return
    await expect(page.locator('text=Message to be cleared')).not.toBeVisible();
    await expect(page.locator('text=Frontend stack')).toBeVisible();
  });

  test('should handle suggestion chips correctly', async ({ page }) => {
    // Click on a suggestion
    await page.locator('text=Frontend stack').click();
    
    // Should populate the input
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    await expect(chatInput).toHaveValue(/frontend/i);
  });

  test('should navigate between pages and maintain chat', async ({ page }) => {
    // Send a message
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    await chatInput.fill('Navigation test message');
    await page.locator('button[type="submit"]').click();
    
    // Wait for message
    await expect(page.locator('text=Navigation test message')).toBeVisible();
    
    // Navigate to explore page
    await page.click('a[href="/explore"]');
    await expect(page).toHaveURL('/explore');
    
    // Navigate back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    
    // Chat should still be there
    await expect(page.locator('text=Navigation test message')).toBeVisible();
  });

  test('should handle file uploads in chat', async ({ page }) => {
    // Look for file upload functionality
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Create a test file
      const buffer = Buffer.from('test file content');
      await fileInput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: buffer
      });
      
      // Should show file in UI
      await expect(page.locator('text=test.txt')).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that layout adapts
    await expect(page.locator('img[alt="Pixi Pro Logo"]')).toBeVisible();
    await expect(page.locator('textarea[aria-label="Enter your prompt"]')).toBeVisible();
    
    // Chat input should be accessible
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    await chatInput.fill('Mobile test');
    await page.locator('button[type="submit"]').click();
    
    await expect(page.locator('text=Mobile test')).toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    
    // Focus input
    await chatInput.click();
    
    // Type message
    await chatInput.fill('Keyboard shortcut test');
    
    // Submit with Enter (if implemented)
    await chatInput.press('Enter');
    
    // Message should appear
    await expect(page.locator('text=Keyboard shortcut test')).toBeVisible();
  });

  test('should display loading states appropriately', async ({ page }) => {
    const chatInput = page.locator('textarea[aria-label="Enter your prompt"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await chatInput.fill('Loading test message');
    await sendButton.click();
    
    // Should show loading state
    await expect(sendButton).toBeDisabled();
    
    // Eventually should re-enable
    await expect(sendButton).toBeEnabled({ timeout: 10000 });
  });
});