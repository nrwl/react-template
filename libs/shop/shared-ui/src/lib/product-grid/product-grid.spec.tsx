import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGrid } from './product-grid';
import { createMockProductList } from '@org/shared-test-utils';

describe('ProductGrid', () => {
  const mockProducts = createMockProductList(3);
  const mockOnSelect = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render all products', () => {
    render(<ProductGrid products={mockProducts} onProductSelect={mockOnSelect} />);

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Test Product 3')).toBeInTheDocument();
  });

  it('should display empty state when no products', () => {
    render(<ProductGrid products={[]} onProductSelect={mockOnSelect} />);

    expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
  });

  it('should call onProductSelect when a product card is clicked', () => {
    render(<ProductGrid products={mockProducts} onProductSelect={mockOnSelect} />);

    const firstCard = screen.getByRole('button', { name: /View details for Test Product 1/i });
    fireEvent.click(firstCard);

    expect(mockOnSelect).toHaveBeenCalledWith(mockProducts[0]);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should have responsive grid layout', () => {
    const { container } = render(
      <ProductGrid products={mockProducts} onProductSelect={mockOnSelect} />
    );

    // CSS modules generate unique class names, check for element with class containing 'product-grid'
    const grid = container.querySelector('[class*="product-grid"]');
    expect(grid).toBeInTheDocument();
    // Check that the grid contains product cards
    const productCards = container.querySelectorAll('[class*="product-card"]');
    expect(productCards.length).toBe(mockProducts.length);
  });
});