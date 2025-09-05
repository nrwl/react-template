import { ProductsService } from './products.service';
// eslint-disable-next-line
import { ProductFilter } from '@org/models';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  describe('getProducts', () => {
    it('should return all products when no filter is applied', () => {
      const result = service.getProducts();
      expect(result.items).toHaveLength(10); // First page shows 10 items
      expect(result.total).toBe(12); // Total of 12 products
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(2);
    });

    it('should filter products by category', () => {
      const filter: ProductFilter = { category: 'Electronics' };
      const result = service.getProducts(filter);

      result.items.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should filter products by search term', () => {
      const filter: ProductFilter = { searchTerm: 'Wireless' };
      const result = service.getProducts(filter);

      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach(product => {
        const matchesSearch =
          product.name.toLowerCase().includes('wireless') ||
          product.description.toLowerCase().includes('wireless');
        expect(matchesSearch).toBe(true);
      });
    });

    it('should filter products by in-stock status', () => {
      const filter: ProductFilter = { inStock: true };
      const result = service.getProducts(filter);

      result.items.forEach(product => {
        expect(product.inStock).toBe(true);
      });
    });

    it('should filter products by price range', () => {
      const filter: ProductFilter = { minPrice: 50, maxPrice: 100 };
      const result = service.getProducts(filter);

      result.items.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(100);
      });
    });

    it('should handle pagination correctly', () => {
      const page1 = service.getProducts(undefined, 1, 5);
      const page2 = service.getProducts(undefined, 2, 5);

      expect(page1.items).toHaveLength(5);
      expect(page2.items).toHaveLength(5);
      expect(page1.items[0].id).not.toBe(page2.items[0].id);
      expect(page1.totalPages).toBe(3);
    });

    it('should apply multiple filters simultaneously', () => {
      const filter: ProductFilter = {
        category: 'Electronics',
        inStock: true,
        maxPrice: 200,
      };
      const result = service.getProducts(filter);

      result.items.forEach(product => {
        expect(product.category).toBe('Electronics');
        expect(product.inStock).toBe(true);
        expect(product.price).toBeLessThanOrEqual(200);
      });
    });
  });

  describe('getProductById', () => {
    it('should return product when valid id is provided', () => {
      const product = service.getProductById('1');
      expect(product).toBeDefined();
      expect(product?.id).toBe('1');
      expect(product?.name).toBe('Wireless Bluetooth Headphones');
    });

    it('should return undefined when invalid id is provided', () => {
      const product = service.getProductById('invalid-id');
      expect(product).toBeUndefined();
    });
  });

  describe('getCategories', () => {
    it('should return unique categories in alphabetical order', () => {
      const categories = service.getCategories();

      expect(categories).toContain('Electronics');
      expect(categories).toContain('Sports');
      expect(categories).toContain('Clothing');
      expect(categories).toContain('Home & Kitchen');
      expect(categories).toContain('Accessories');

      // Check alphabetical order
      const sortedCategories = [...categories].sort();
      expect(categories).toEqual(sortedCategories);
    });

    it('should not have duplicate categories', () => {
      const categories = service.getCategories();
      const uniqueCategories = [...new Set(categories)];
      expect(categories).toEqual(uniqueCategories);
    });
  });
});
