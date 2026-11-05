import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from '../context/CartContext';
import { Product } from '../types';

const mockProduct: Product = {
  id: 1,
  category: 1,
  category_name: 'Hot Coffee',
  name: 'Aesthetic Signature Latte',
  slug: 'aesthetic-signature-latte',
  description: 'Pure artisanal latte with gold dust',
  price: '199.00',
  discounted_price: '179.00',
  effective_price: '179.00',
  image: '/images/signature-latte.jpg',
  is_vegetarian: true,
  is_available: true,
  is_featured: true,
  preparation_time_minutes: 10,
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartSubtotal).toBe(0);
  });

  it('adds product to cart and calculates subtotal using effective price', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartSubtotal).toBe(358); // 179 * 2
  });

  it('updates quantity and removes item when quantity reaches zero', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    expect(result.current.cartCount).toBe(1);

    act(() => {
      result.current.updateQuantity(mockProduct.id, 3);
    });

    expect(result.current.cartCount).toBe(3);
    expect(result.current.cartSubtotal).toBe(537); // 179 * 3

    act(() => {
      result.current.updateQuantity(mockProduct.id, 0);
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.cartCount).toBe(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.cartCount).toBe(0);
  });
});
