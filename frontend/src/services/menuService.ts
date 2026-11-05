import { apiClient } from './api';
import { Category, Product } from '../types';

export const menuService = {
  async getCategories(): Promise<Category[]> {
    return apiClient<Category[]>('/categories/');
  },

  async getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    sort?: 'price_asc' | 'price_desc' | 'name';
    page?: number;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: Product[] }> {
    return apiClient('/products/', { params });
  },

  async getProductBySlug(slug: string): Promise<Product> {
    return apiClient<Product>(`/products/${slug}/`);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return apiClient<Product[]>('/featured-products/');
  },
};
