import { test, expect } from '@playwright/test';

test.describe('Product Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display products grid with at least one product', async ({
    page,
  }) => {
    const productCards = page.locator('[class*="product-card"]');

    // Wait for products to load
    const firstProduct = productCards.first();
    await expect(firstProduct).toBeVisible({ timeout: 10000 });

    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

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

    const productCategories = page.locator(
      '[class*="product-card"] p:first-of-type',
    );

    // Wait for the filtered list to settle on the first matching card
    await expect(productCategories.first()).toHaveText('Electronics');

    const count = await productCategories.count();
    for (let i = 0; i < count; i++) {
      const category = productCategories.nth(i);
      await expect(category).toHaveText('Electronics');
    }
  });

  test('should filter products by search term', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Wireless');

    const productNames = page.locator('[class*="product-card"] h3');

    // Wait for the filtered list to settle on a matching product name
    await expect(productNames.first()).toContainText(/wireless/i);

    const count = await productNames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter by in-stock only', async ({ page }) => {
    const inStockCheckbox = page.locator('input[type="checkbox"]').first();
    await inStockCheckbox.check();

    // Wait for the filtered list to drop all out-of-stock products
    const outOfStockOverlays = page.locator('text="Out of Stock"');
    await expect(outOfStockOverlays).toHaveCount(0);
  });

  test('should navigate to product detail when clicking a product', async ({
    page,
  }) => {
    const firstProduct = page.locator('[class*="product-card"]').first();
    await firstProduct.click();

    await page.waitForURL('**/products/*');
    expect(page.url()).toMatch(/\/products\/\d+/);

    const backButton = page.locator('button:has-text("Back to Products")');
    await expect(backButton).toBeVisible();
  });

  test('should render pagination controls together with the pagination section', async ({
    page,
  }) => {
    // The pagination section only renders when there are multiple pages. Rather
    // than branch on its presence, assert the controls travel together with it:
    // the Previous/Next buttons and page-info count must match the section count.
    const paginationSection = page.locator('[class*="pagination"]');
    const previousButton = page.locator('button:has-text("Previous")');
    const nextButton = page.locator('button:has-text("Next")');
    const pageInfo = page.locator('[class*="page-info"]');

    const sectionCount = await paginationSection.count();
    await expect(previousButton).toHaveCount(sectionCount);
    await expect(nextButton).toHaveCount(sectionCount);
    await expect(pageInfo).toHaveCount(sectionCount);
  });

  test('should show results count', async ({ page }) => {
    const resultsInfo = page.locator('[class*="results-info"]');
    await expect(resultsInfo).toContainText(/Showing \d+ of \d+ products/);
  });
});
