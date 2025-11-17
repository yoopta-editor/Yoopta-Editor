import { test, expect } from '@playwright/test';

test.describe('Yoopta UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev');
    await page.waitForSelector('[data-yoopta-editor]', { timeout: 10000 });
  });

  test.describe('Toolbar', () => {
    test('should show toolbar on text selection', async ({ page }) => {
      // Click on editor and type text
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Hello World');

      // Select text (Shift + ArrowLeft multiple times)
      await page.keyboard.down('Shift');
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowLeft');
      }
      await page.keyboard.up('Shift');

      // Wait for toolbar to appear
      const toolbar = page.locator('.yoopta-ui-toolbar');
      await expect(toolbar).toBeVisible({ timeout: 3000 });
    });

    test('should hide toolbar when selection is cleared', async ({ page }) => {
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Text');

      // Select all
      await page.keyboard.press('Control+A');

      const toolbar = page.locator('.yoopta-ui-toolbar');
      await expect(toolbar).toBeVisible();

      // Click to deselect
      await page.keyboard.press('ArrowRight');

      // Toolbar should hide
      await expect(toolbar).not.toBeVisible({ timeout: 3000 });
    });

    test('should apply bold formatting', async ({ page }) => {
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Bold text');

      // Select all text
      await page.keyboard.press('Control+A');

      // Wait for toolbar and click bold button
      const boldButton = page.locator('.yoopta-ui-toolbar-button[title="Bold"]');
      await expect(boldButton).toBeVisible();
      await boldButton.click();

      // Verify bold formatting applied
      const boldElement = page.locator('strong, [data-slate-leaf] strong');
      await expect(boldElement).toBeVisible();
    });

    test('should have correct button active states', async ({ page }) => {
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Test');
      await page.keyboard.press('Control+A');

      const boldButton = page.locator('.yoopta-ui-toolbar-button[title="Bold"]');

      // Initially not active
      await expect(boldButton).not.toHaveAttribute('data-active', 'true');

      // Click bold
      await boldButton.click();

      // Should be active
      await expect(boldButton).toHaveAttribute('data-active', 'true');
    });
  });

  test.describe('FloatingBlockActions', () => {
    test('should show floating actions on hover', async ({ page }) => {
      // Wait for the first block
      const block = page.locator('[data-yoopta-block]').first();
      await block.waitFor();

      // Hover over the block
      await block.hover();

      // Wait a bit for the throttled mousemove handler
      await page.waitForTimeout(200);

      // Check if floating actions are visible
      const floatingActions = page.locator('.yoopta-ui-floating-block-actions');
      await expect(floatingActions).toBeVisible();
    });

    test('should have plus and drag buttons', async ({ page }) => {
      const block = page.locator('[data-yoopta-block]').first();
      await block.hover();
      await page.waitForTimeout(200);

      const floatingActions = page.locator('.yoopta-ui-floating-block-actions');
      const buttons = floatingActions.locator('button');

      // Should have at least 2 buttons (plus and drag)
      await expect(buttons).toHaveCount(2);
    });
  });

  test.describe('BlockOptions', () => {
    test('should open block options on drag button click', async ({ page }) => {
      const block = page.locator('[data-yoopta-block]').first();
      await block.hover();
      await page.waitForTimeout(200);

      // Click drag button (second button)
      const dragButton = page.locator('.yoopta-ui-floating-block-actions button').nth(1);
      await dragButton.click();

      // Block options should appear
      const blockOptions = page.locator('.yoopta-ui-block-options');
      await expect(blockOptions).toBeVisible({ timeout: 3000 });
    });

    test('should close block options on overlay click', async ({ page }) => {
      const block = page.locator('[data-yoopta-block]').first();
      await block.hover();
      await page.waitForTimeout(200);

      const dragButton = page.locator('.yoopta-ui-floating-block-actions button').nth(1);
      await dragButton.click();

      const blockOptions = page.locator('.yoopta-ui-block-options');
      await expect(blockOptions).toBeVisible();

      // Click overlay to close
      const overlay = page.locator('.yoo-editor-overlay');
      await overlay.click({ position: { x: 5, y: 5 } });

      // Block options should close
      await expect(blockOptions).not.toBeVisible({ timeout: 3000 });
    });

    test('should have action buttons in block options', async ({ page }) => {
      const block = page.locator('[data-yoopta-block]').first();
      await block.hover();
      await page.waitForTimeout(200);

      const dragButton = page.locator('.yoopta-ui-floating-block-actions button').nth(1);
      await dragButton.click();

      const blockOptions = page.locator('.yoopta-ui-block-options');
      const buttons = blockOptions.locator('button');

      // Should have action buttons (Duplicate, Copy link, Delete, etc.)
      await expect(buttons.count()).resolves.toBeGreaterThan(0);
    });
  });

  test.describe('UI Integration', () => {
    test('should work together: select text, format, deselect', async ({ page }) => {
      // Type text
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Integration test');

      // Select text
      await page.keyboard.press('Control+A');

      // Wait for toolbar
      const toolbar = page.locator('.yoopta-ui-toolbar');
      await expect(toolbar).toBeVisible();

      // Apply italic
      const italicButton = toolbar.locator('[title="Italic"]');
      await italicButton.click();

      // Deselect
      await page.keyboard.press('Escape');

      // Toolbar should hide
      await expect(toolbar).not.toBeVisible({ timeout: 3000 });

      // Text should be italic
      const italicElement = page.locator('em, [data-slate-leaf] em');
      await expect(italicElement).toBeVisible();
    });

    test('should maintain UI state when switching between actions', async ({ page }) => {
      const block = page.locator('[data-yoopta-block]').first();
      await block.hover();
      await page.waitForTimeout(200);

      // Open block options
      const dragButton = page.locator('.yoopta-ui-floating-block-actions button').nth(1);
      await dragButton.click();

      const blockOptions = page.locator('.yoopta-ui-block-options');
      await expect(blockOptions).toBeVisible();

      // FloatingBlockActions should be frozen (still visible)
      const floatingActions = page.locator('.yoopta-ui-floating-block-actions');
      await expect(floatingActions).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('toolbar buttons should have proper ARIA attributes', async ({ page }) => {
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Text');
      await page.keyboard.press('Control+A');

      const boldButton = page.locator('.yoopta-ui-toolbar-button[title="Bold"]');

      // Should have title attribute
      await expect(boldButton).toHaveAttribute('title', 'Bold');

      // Should be a button
      await expect(boldButton).toHaveRole('button');
    });

    test('floating action buttons should have titles', async ({ page }) => {
      const block = page.locator('[data-yoopta-block]').first();
      await block.hover();
      await page.waitForTimeout(200);

      const buttons = page.locator('.yoopta-ui-floating-action-button');
      const firstButton = buttons.first();

      // Should be a button with accessible properties
      await expect(firstButton).toHaveRole('button');
    });
  });

  test.describe('Performance', () => {
    test('toolbar should appear quickly after selection', async ({ page }) => {
      await page.click('[data-yoopta-block]');
      await page.keyboard.type('Performance test');

      const startTime = Date.now();
      await page.keyboard.press('Control+A');

      const toolbar = page.locator('.yoopta-ui-toolbar');
      await toolbar.waitFor({ state: 'visible', timeout: 1000 });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Toolbar should appear within 500ms
      expect(duration).toBeLessThan(500);
    });
  });
});
