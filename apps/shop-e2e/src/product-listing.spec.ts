import { test, expect } from '@playwright/test';

test.describe('Product Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display products grid with at least one product', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[class*="product-card"]', { timeout: 10000 });

    const productCards = page.locator('[class*="product-card"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    const firstProduct = productCards.first();
    await expect(firstProduct).toBeVisible();

    const productImage = firstProduct.locator('img');
    await expect(productImage).toBeVisible();

    const productName = firstProduct.locator('h3');
    await expect(productName).toBeVisible();

    const productPrice = firstProduct.locator('text=/\\$\\d+\\.\\d{2}/');
    await expect(productPrice).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    const categoryDropdown = page.locator('select');
    await categoryDropdown.selectOption('Electronics');

    await page.waitForTimeout(500);

    const productCategories = page.locator('[class*="product-card"] p:first-of-type');
    const count = await productCategories.count();

    for (let i = 0; i < count; i++) {
      const category = productCategories.nth(i);
      await expect(category).toHaveText('Electronics');
    }
  });

  test('should filter products by search term', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Wireless');

    await page.waitForTimeout(500);

    const productNames = page.locator('[class*="product-card"] h3');
    const count = await productNames.count();

    expect(count).toBeGreaterThan(0);

    const firstProductName = await productNames.first().textContent();
    expect(firstProductName?.toLowerCase()).toContain('wireless');
  });

  test('should filter by in-stock only', async ({ page }) => {
    const inStockCheckbox = page.locator('input[type="checkbox"]').first();
    await inStockCheckbox.check();

    await page.waitForTimeout(500);

    const outOfStockOverlays = page.locator('text="Out of Stock"');
    const count = await outOfStockOverlays.count();
    expect(count).toBe(0);
  });

  test('should navigate to product detail when clicking a product', async ({ page }) => {
    const firstProduct = page.locator('[class*="product-card"]').first();
    await firstProduct.click();

    await page.waitForURL('**/products/*');
    expect(page.url()).toMatch(/\/products\/\d+/);

    const backButton = page.locator('button:has-text("Back to Products")');
    await expect(backButton).toBeVisible();
  });

  test('should display pagination controls when there are multiple pages', async ({ page }) => {
    const paginationSection = page.locator('[class*="pagination"]');

    if (await paginationSection.isVisible()) {
      const previousButton = page.locator('button:has-text("Previous")');
      const nextButton = page.locator('button:has-text("Next")');
      const pageInfo = page.locator('[class*="page-info"]');

      await expect(previousButton).toBeVisible();
      await expect(nextButton).toBeVisible();
      await expect(pageInfo).toContainText(/Page \d+ of \d+/);
    }
  });

  test('should show results count', async ({ page }) => {
    const resultsInfo = page.locator('[class*="results-info"]');
    await expect(resultsInfo).toContainText(/Showing \d+ of \d+ products/);
  });
});