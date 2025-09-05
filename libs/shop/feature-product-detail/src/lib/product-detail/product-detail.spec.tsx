import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetail } from './product-detail';
import { useProduct } from '@org/shop-data';
import { useParams, useNavigate } from 'react-router-dom';

// Mock the hooks
vi.mock('@org/shop-data', () => ({
  useProduct: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});


const mockProduct = {
  id: '1',
  name: 'Wireless Bluetooth Headphones',
  description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
  price: 99.99,
  category: 'Electronics',
  imageUrl: 'https://via.placeholder.com/600x400',
  inStock: true,
  rating: 4.5,
  reviewCount: 120,
};

describe('ProductDetail', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: '1' });
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('should render loading state initially', () => {
    (useProduct as any).mockReturnValue({
      product: null,
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state when product fails to load', () => {
    (useProduct as any).mockReturnValue({
      product: null,
      loading: false,
      error: 'Failed to load product',
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(screen.getByText('Failed to load product')).toBeInTheDocument();
  });

  it('should render product not found when product is null', () => {
    (useProduct as any).mockReturnValue({
      product: null,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('should render product details when loaded', () => {
    (useProduct as any).mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(screen.getByText('Wireless Bluetooth Headphones')).toBeInTheDocument();
    expect(screen.getByText('Premium wireless headphones with active noise cancellation and 30-hour battery life.')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getAllByText('Electronics')[0]).toBeInTheDocument();
    expect(screen.getByText('✓ In Stock')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('should render out of stock state correctly', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    (useProduct as any).mockReturnValue({
      product: outOfStockProduct,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(screen.getAllByText('Out of Stock')[0]).toBeInTheDocument();
    const addToCartButton = screen.getByRole('button', { name: 'Out of Stock' });
    expect(addToCartButton).toBeDisabled();
  });

  it('should display product details section', () => {
    (useProduct as any).mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(screen.getByText('Product Details')).toBeInTheDocument();
    expect(screen.getByText(/Product ID:/)).toBeInTheDocument();
    expect(screen.getByText(/Category:/)).toBeInTheDocument();
    expect(screen.getByText(/Rating:/)).toBeInTheDocument();
    expect(screen.getByText(/4.5.*out of 5/)).toBeInTheDocument();
    expect(screen.getByText(/Reviews:/)).toBeInTheDocument();
    expect(screen.getByText(/120.*customer reviews/)).toBeInTheDocument();
  });

  it('should handle back button click', () => {
    (useProduct as any).mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', { name: /back to products/i });
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  it('should fetch product with correct id from params', () => {
    const mockUseProduct = vi.fn().mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });
    (useProduct as any).mockImplementation(mockUseProduct);
    (useParams as any).mockReturnValue({ id: '42' });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    expect(mockUseProduct).toHaveBeenCalledWith('42');
  });

  it('should render product image with alt text', () => {
    (useProduct as any).mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    const image = screen.getByAltText('Wireless Bluetooth Headphones');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/600x400');
  });
});
