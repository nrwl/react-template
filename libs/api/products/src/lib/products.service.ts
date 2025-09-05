// eslint-disable-next-line
import { Product, ProductFilter } from '@org/models';

export class ProductsService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium quality wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
      price: 199.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      inStock: true,
      rating: 4.5,
      reviewCount: 234,
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced fitness tracking, heart rate monitoring, GPS, and smartphone integration in a sleek design.',
      price: 349.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      inStock: true,
      rating: 4.3,
      reviewCount: 189,
    },
    {
      id: '3',
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and sustainable organic cotton t-shirt, perfect for everyday wear.',
      price: 29.99,
      category: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      inStock: false,
      rating: 4.7,
      reviewCount: 92,
    },
    {
      id: '4',
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
      price: 24.99,
      category: 'Home & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      inStock: true,
      rating: 4.6,
      reviewCount: 412,
    },
    {
      id: '5',
      name: 'Yoga Mat Premium',
      description: 'Non-slip, eco-friendly yoga mat with extra cushioning for comfortable practice.',
      price: 45.99,
      category: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
      inStock: true,
      rating: 4.4,
      reviewCount: 156,
    },
    {
      id: '6',
      name: 'Portable Charger 20000mAh',
      description: 'High-capacity power bank with fast charging and multiple USB ports.',
      price: 59.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
      inStock: true,
      rating: 4.2,
      reviewCount: 298,
    },
    {
      id: '7',
      name: 'Running Shoes Elite',
      description: 'Professional running shoes with advanced cushioning and breathable mesh upper.',
      price: 129.99,
      category: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      inStock: true,
      rating: 4.8,
      reviewCount: 523,
    },
    {
      id: '8',
      name: 'Coffee Maker Deluxe',
      description: 'Programmable coffee maker with thermal carafe and customizable brew strength.',
      price: 89.99,
      category: 'Home & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
      inStock: false,
      rating: 4.1,
      reviewCount: 167,
    },
    {
      id: '9',
      name: 'Backpack Urban Explorer',
      description: 'Durable and stylish backpack with laptop compartment and multiple pockets.',
      price: 79.99,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      inStock: true,
      rating: 4.5,
      reviewCount: 201,
    },
    {
      id: '10',
      name: 'Wireless Keyboard and Mouse',
      description: 'Ergonomic wireless keyboard and mouse combo with long battery life.',
      price: 69.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      inStock: true,
      rating: 4.3,
      reviewCount: 145,
    },
    {
      id: '11',
      name: 'Sunglasses Polarized',
      description: 'UV protection polarized sunglasses with stylish frame design.',
      price: 149.99,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
      inStock: true,
      rating: 4.6,
      reviewCount: 89,
    },
    {
      id: '12',
      name: 'Desk Lamp LED',
      description: 'Adjustable LED desk lamp with touch controls and multiple brightness levels.',
      price: 39.99,
      category: 'Home & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1565306257569-4eb0e3c41b24?w=500',
      inStock: true,
      rating: 4.4,
      reviewCount: 276,
    },
  ];

  getProducts(filter?: ProductFilter, page = 1, pageSize = 10) {
    let filteredProducts = [...this.products];

    // Apply filters
    if (filter) {
      if (filter.category) {
        filteredProducts = filteredProducts.filter(
          p => p.category === filter.category
        );
      }
      if (filter.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          p => p.price >= filter.minPrice!
        );
      }
      if (filter.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          p => p.price <= filter.maxPrice!
        );
      }
      if (filter.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(
          p => p.inStock === filter.inStock
        );
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );
      }
    }

    // Calculate pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredProducts.slice(startIndex, endIndex);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getCategories(): string[] {
    const categories = new Set(this.products.map(p => p.category));
    return Array.from(categories).sort();
  }
}
