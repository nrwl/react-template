import { useState, useEffect } from 'react';
import { Product, ApiResponse } from '@org/models';

const API_URL = 'http://localhost:3333/api';

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data: ApiResponse<Product> = await response.json() as ApiResponse<Product>;

        if (!data.success) {
          throw new Error(data.error || 'Failed to load product');
        }

        setProduct(data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred while loading the product';
        setError(message);
        console.error('Error loading product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
  };
}
