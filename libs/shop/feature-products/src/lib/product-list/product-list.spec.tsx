import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductList } from './product-list';
import { useProducts, useCategories } from '@org/shop-data';

// Mock the hooks
vi.mock('@org/shop-data', () => ({
  useProducts: vi.fn(),
  useCategories: vi.fn(),
}));

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones',
    price: 99.99,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x200',
    inStock: true,
    rating: 4.5,
    reviewCount: 120,
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: 'Comfortable running shoes',
    price: 79.99,
    category: 'Sports',
    imageUrl: 'https://via.placeholder.com/300x200',
    inStock: true,
    rating: 4.2,
    reviewCount: 85,
  },
];

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (useProducts as any).mockReturnValue({
      products: [],
      loading: true,
      error: null,
      totalProducts: 0,
      totalPages: 1,
    });
    (useCategories as any).mockReturnValue({
      categories: [],
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state when products fail to load', () => {
    (useProducts as any).mockReturnValue({
      products: [],
      loading: false,
      error: 'Failed to load products',
      totalProducts: 0,
      totalPages: 1,
    });
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
  });

  it('should render products when loaded', () => {
    (useProducts as any).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      totalProducts: 2,
      totalPages: 1,
    });
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    expect(screen.getByText('Our Products')).toBeInTheDocument();
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 products')).toBeInTheDocument();
  });

  it('should handle search input', async () => {
    const mockUseProducts = vi.fn();
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      totalProducts: 2,
      totalPages: 1,
    });
    (useProducts as any).mockImplementation(mockUseProducts);
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Wireless' } });

    await waitFor(() => {
      expect(mockUseProducts).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: 'Wireless' }),
        1,
        12
      );
    });
  });

  it('should handle category filter', async () => {
    const mockUseProducts = vi.fn();
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      totalProducts: 2,
      totalPages: 1,
    });
    (useProducts as any).mockImplementation(mockUseProducts);
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'Electronics' } });

    await waitFor(() => {
      expect(mockUseProducts).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'Electronics' }),
        1,
        12
      );
    });
  });

  it('should handle in stock filter', async () => {
    const mockUseProducts = vi.fn();
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      totalProducts: 2,
      totalPages: 1,
    });
    (useProducts as any).mockImplementation(mockUseProducts);
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    const inStockCheckbox = screen.getByRole('checkbox');
    fireEvent.click(inStockCheckbox);

    await waitFor(() => {
      expect(mockUseProducts).toHaveBeenCalledWith(
        expect.objectContaining({ inStock: true }),
        1,
        12
      );
    });
  });

  it('should handle pagination', async () => {
    const mockUseProducts = vi.fn();
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      totalProducts: 25,
      totalPages: 3,
    });
    (useProducts as any).mockImplementation(mockUseProducts);
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockUseProducts).toHaveBeenCalledWith(
        expect.any(Object),
        2,
        12
      );
    });
  });

  it('should navigate to product detail when card is clicked', () => {
    (useProducts as any).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      totalProducts: 2,
      totalPages: 1,
    });
    (useCategories as any).mockReturnValue({
      categories: ['Electronics', 'Sports'],
      loading: false,
      error: null,
    });

    const { container } = render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    const productCard = container.querySelector('[class*="product-card"]');
    expect(productCard).toBeInTheDocument();
  });
});
