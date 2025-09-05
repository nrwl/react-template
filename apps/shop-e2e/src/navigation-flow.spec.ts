import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test('should complete full user journey from listing to detail and back', async ({ page }) => {
    // Start at home page
    await page.goto('/');

    // Should redirect to products
    await page.waitForURL('**/products');
    expect(page.url()).toContain('/products');

    // Click on a specific product
    const productCard = page.locator('[class*="product-card"]').first();
    const productName = await productCard.locator('h3').textContent();
    await productCard.click();

    // Should navigate to product detail
    await page.waitForURL('**/products/*');
    expect(page.url()).toMatch(/\/products\/\d+/);

    // Verify product name matches
    const detailName = page.locator('h1').last();
    await expect(detailName).toContainText(productName || '');

    // Navigate back using back button
    const backButton = page.locator('button:has-text("Back to Products")');
    await backButton.click();

    // Should be back on products page
    await page.waitForURL('**/products');
    expect(page.url()).toContain('/products');

    // Original product should still be visible
    const sameProduct = page.locator(`h3:has-text("${productName}")`);
    await expect(sameProduct).toBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate to products
    await page.goto('/products');

    // Click a product
    const firstProduct = page.locator('[class*="product-card"]').first();
    await firstProduct.click();
    await page.waitForURL('**/products/*');
    const detailUrl = page.url();

    // Use browser back button
    await page.goBack();
    await page.waitForURL('**/products');
    expect(page.url()).toContain('/products');

    // Use browser forward button
    await page.goForward();
    await page.waitForURL('**/products/*');
    expect(page.url()).toBe(detailUrl);
  });

  test('should handle deep linking to product detail', async ({ page }) => {
    // First, get a valid product ID by visiting the products page
    await page.goto('/products');
    const firstProduct = page.locator('[class*="product-card"]').first();
    await firstProduct.click();
    await page.waitForURL('**/products/*');

    const productUrl = page.url();
    const productId = productUrl.split('/').pop();

    // Now test deep linking directly to this product
    await page.goto(`/products/${productId}`);
    await page.waitForLoadState('domcontentloaded');

    // Product detail should load properly
    const productName = page.locator('h1').last();
    await expect(productName).toBeVisible();

    const backButton = page.locator('button:has-text("Back to Products")');
    await expect(backButton).toBeVisible();
  });

  test('should handle invalid product URLs gracefully', async ({ page }) => {
    // Navigate to invalid product ID
    await page.goto('/products/invalid-id-999999');
    await page.waitForLoadState('domcontentloaded');

    // Should show error message - using first() to avoid strict mode violation
    const errorMessage = page.locator('[class*="error"]').first();
    await expect(errorMessage).toBeVisible();

    // Back button should still work
    const backButton = page.locator('button:has-text("Back to Products")');
    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForURL('**/products');
      expect(page.url()).toContain('/products');
    }
  });
});
