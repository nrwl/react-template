import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useProduct } from './use-product';

// Mock fetch
global.fetch = vi.fn();

const mockProduct = {
  id: '1',
  name: 'Wireless Bluetooth Headphones',
  description: 'Premium wireless headphones with active noise cancellation',
  price: 99.99,
  category: 'Electronics',
  imageUrl: 'https://via.placeholder.com/600x400',
  inStock: true,
  rating: 4.5,
  reviewCount: 120,
};

describe('useProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch product by id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockProduct }),
    } as Response);

    const { result } = renderHook(() => useProduct('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/products/1');
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Network error';
    vi.mocked(fetch).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useProduct('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('should handle 404 response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'Product not found' }),
    } as Response);

    const { result } = renderHook(() => useProduct('invalid-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBe('Product not found');
  });

  it('should refetch when id changes', async () => {
    const product1 = { ...mockProduct, id: '1', name: 'Product 1' };
    const product2 = { ...mockProduct, id: '2', name: 'Product 2' };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: product1 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: product2 }),
      } as Response);

    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: '1' },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(product1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/products/1');

    // Change id
    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.product).toEqual(product2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      'http://localhost:3333/api/products/2',
    );
  });

  it('should not fetch if id is not provided', () => {
    const { result } = renderHook(() => useProduct(''));

    expect(result.current.loading).toBe(false);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should not fetch if id is null', () => {
    const { result } = renderHook(() => useProduct(null as never));

    expect(result.current.loading).toBe(false);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should not fetch if id is undefined', () => {
    const { result } = renderHook(() => useProduct(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should handle successful response with empty product', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: null }),
    } as Response);

    const { result } = renderHook(() => useProduct('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
