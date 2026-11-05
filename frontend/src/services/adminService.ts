import { apiClient } from './api';
import {
  DashboardMetrics,
  Order,
  OrderStatus,
  PaymentStatus,
  Reservation,
  Product,
  Review,
  CafeTable,
  BusinessSettings,
  User,
} from '../types';

export const adminService = {
  // Auth
  async login(username: string, password: string): Promise<{ message: string; user: User }> {
    return apiClient('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout(): Promise<{ message: string }> {
    return apiClient('/auth/logout/', { method: 'POST' });
  },

  async getMe(): Promise<User> {
    return apiClient<User>('/auth/me/');
  },

  // Dashboard Metrics
  async getDashboard(): Promise<{
    metrics: DashboardMetrics;
    popular_products: Array<{ product_name_snapshot: string; order_count: number; total_qty: number }>;
    recent_orders: Order[];
    recent_reservations: Reservation[];
  }> {
    return apiClient('/admin/dashboard/');
  },

  // Orders
  async getOrders(params?: { status?: string; type?: string; search?: string }): Promise<{ results: Order[] } | Order[]> {
    return apiClient('/admin/orders/', { params });
  },

  async updateOrderStatus(id: number, order_status: OrderStatus, payment_status?: PaymentStatus): Promise<Order> {
    return apiClient<Order>(`/admin/orders/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ order_status, ...(payment_status ? { payment_status } : {}) }),
    });
  },

  // Reservations
  async getReservations(params?: { status?: string; date?: string; search?: string }): Promise<{ results: Reservation[] } | Reservation[]> {
    return apiClient('/admin/reservations/', { params });
  },

  async updateReservationStatus(
    id: number,
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled',
    tableId?: number | null,
    adminNotes?: string
  ): Promise<Reservation> {
    return apiClient<Reservation>(`/admin/reservations/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        ...(tableId !== undefined ? { table: tableId } : {}),
        ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}),
      }),
    });
  },

  // Menu Products & Categories CRUD
  async getProducts(): Promise<{ results: Product[] } | Product[]> {
    return apiClient('/admin/products/');
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return apiClient<Product>('/admin/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return apiClient<Product>(`/admin/products/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: number): Promise<void> {
    return apiClient(`/admin/products/${id}/`, { method: 'DELETE' });
  },

  // Tables
  async getTables(): Promise<CafeTable[]> {
    return apiClient<CafeTable[]>('/admin/tables/');
  },

  // Reviews
  async getReviews(): Promise<{ results: Review[] } | Review[]> {
    return apiClient('/admin/reviews/');
  },

  async updateReviewStatus(id: number, is_approved: boolean): Promise<Review> {
    return apiClient<Review>(`/admin/reviews/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_approved }),
    });
  },

  async deleteReview(id: number): Promise<void> {
    return apiClient(`/admin/reviews/${id}/`, { method: 'DELETE' });
  },

  // Business Settings
  async getBusinessSettings(): Promise<BusinessSettings> {
    return apiClient<BusinessSettings>('/admin/business-settings/');
  },

  async updateBusinessSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    return apiClient<BusinessSettings>('/admin/business-settings/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
