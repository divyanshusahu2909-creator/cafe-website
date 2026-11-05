import { apiClient } from './api';
import { Order, OrderType } from '../types';

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: OrderType;
  delivery_address?: string;
  customer_notes?: string;
  table_number?: string;
  coupon_code?: string;
  idempotency_key?: string;
  items: Array<{ product_id: number; quantity: number }>;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  discount_amount: string;
  message: string;
}

export interface DemoPaymentResult {
  success: boolean;
  status: 'paid' | 'failed';
  payment_id: number;
  transaction_reference: string;
  disclaimer: string;
  order_reference: string;
  amount: string;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    return apiClient<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getOrderByReference(reference: string): Promise<Order> {
    return apiClient<Order>(`/orders/${reference}/`);
  },

  async cancelOrder(reference: string): Promise<Order> {
    return apiClient<Order>(`/orders/${reference}/cancel/`, {
      method: 'POST',
    });
  },

  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    return apiClient<CouponValidationResult>('/coupons/validate/', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal: subtotal.toFixed(2) }),
    });
  },

  async processDemoPayment(orderReference: string, simulateFailure = false): Promise<DemoPaymentResult> {
    return apiClient<DemoPaymentResult>('/payments/demo/', {
      method: 'POST',
      body: JSON.stringify({
        order_reference: orderReference,
        simulate_failure: simulateFailure,
      }),
    });
  },
};
