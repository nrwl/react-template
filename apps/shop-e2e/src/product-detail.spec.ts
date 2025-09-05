import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');

    // Click first product to navigate to detail page
    const firstProduct = page.locator('[class*="product-card"]').first();
    await firstProduct.click();
    await page.waitForURL('**/products/*');
  });

  test('should display product details', async ({ page }) => {
    // Check product name
    const productName = page.locator('h1').last();
    await expect(productName).toBeVisible();
    await expect(productName).toHaveText(/.+/);

    // Check product image
    const productImage = page.locator('[class*="product-image"] img');
    await expect(productImage).toBeVisible();

    // Check product price
    const productPrice = page.locator('[class*="product-price"]');
    await expect(productPrice).toBeVisible();
    const price = await productPrice.textContent();
    expect(price).toMatch(/\$\d+\.\d{2}/);

    // Check product description
    const description = page.locator('[class*="product-description"]');
    await expect(description).toBeVisible();

    // Check product category
    const category = page.locator('[class*="product-category"]');
    await expect(category).toBeVisible();

    // Check rating
    const rating = page.locator('[class*="product-rating"]');
    await expect(rating).toBeVisible();
  });

  test('should have back to products button', async ({ page }) => {
    const backButton = page.locator('button:has-text("Back to Products")');
    await expect(backButton).toBeVisible();

    await backButton.click();
    await page.waitForURL('**/products');
    expect(page.url()).toContain('/products');
  });

  test('should have add to cart button', async ({ page }) => {
    const addToCartButton = page.locator('[class*="add-to-cart-btn"]');
    await expect(addToCartButton).toBeVisible();

    const isDisabled = await addToCartButton.isDisabled();
    const buttonText = await addToCartButton.textContent();

    if (isDisabled) {
      expect(buttonText).toBe('Out of Stock');
    } else {
      expect(buttonText).toBe('Add to Cart');
    }
  });

  test('should show product availability status', async ({ page }) => {
    const availability = page.locator('[class*="product-availability"]');
    await expect(availability).toBeVisible();

    const text = await availability.textContent();
    expect(text).toMatch(/In Stock|Out of Stock/);
  });

  test('should display product details section', async ({ page }) => {
    const detailsSection = page.locator('h3:has-text("Product Details")');
    await expect(detailsSection).toBeVisible();

    const productId = page.locator('text=/Product ID:/');
    await expect(productId).toBeVisible();

    const categoryDetail = page.locator('li:has-text("Category:")');
    await expect(categoryDetail).toBeVisible();

    const ratingDetail = page.locator('li:has-text("Rating:")');
    await expect(ratingDetail).toBeVisible();

    const reviewsDetail = page.locator('li:has-text("Reviews:")');
    await expect(reviewsDetail).toBeVisible();
  });

  test('should show out of stock overlay for unavailable products', async ({ page }) => {
    // Navigate back to products
    await page.goto('/products');

    // Find and click an out-of-stock product if available
    const outOfStockCards = page.locator('[class*="product-card"][class*="out-of-stock"]');
    const count = await outOfStockCards.count();

    if (count > 0) {
      await outOfStockCards.first().click();
      await page.waitForURL('**/products/*');

      const outOfStockOverlay = page.locator('[class*="out-of-stock-overlay"]');
      await expect(outOfStockOverlay).toBeVisible();

      const addToCartButton = page.locator('[class*="add-to-cart-btn"]');
      await expect(addToCartButton).toBeDisabled();
      await expect(addToCartButton).toHaveText('Out of Stock');
    }
  });
});