import { Product } from '@org/models';

export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  category: 'Electronics',
  imageUrl: 'https://example.com/image.jpg',
  inStock: true,
  rating: 4.5,
  reviewCount: 100,
  ...overrides,
});

export const createMockProductList = (count = 3): Product[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockProduct({
      id: `${i + 1}`,
      name: `Test Product ${i + 1}`,
      price: (i + 1) * 50.99,
      rating: 3 + Math.random() * 2,
      reviewCount: Math.floor(Math.random() * 500),
    })
  );
};

export const mockCategories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Accessories'];