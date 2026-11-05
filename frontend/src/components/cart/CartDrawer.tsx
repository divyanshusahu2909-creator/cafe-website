import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderService, CouponValidationResult } from '../../services/orderService';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartSubtotal, appliedCoupon, setAppliedCoupon } = useCart();
  const [couponCode, setCouponCode] = useState(appliedCoupon);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await orderService.validateCoupon(couponCode, cartSubtotal);
      setCouponResult(res);
      setAppliedCoupon(couponCode.trim().toUpperCase());
    } catch (err: any) {
      setCouponResult(null);
      setAppliedCoupon('');
      setCouponError(err.message || 'Invalid or ineligible coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = couponResult ? parseFloat(couponResult.discount_amount) : 0;
  const estimatedTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(12, 10, 8, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#161616',
          borderLeft: '1px solid rgba(198, 161, 91, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(248, 245, 239, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={22} color="#C6A15B" />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8F5EF', margin: 0 }}>
              Your Artisan Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A7A08F',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#A7A08F' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1.5rem',
                  borderRadius: '50%',
                  border: '1px dashed #C6A15B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={28} color="#C6A15B" />
              </div>
              <h4 className="font-serif" style={{ color: '#F8F5EF', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
                Explore our signature coffees and vegetarian culinary delights.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-outline-gold"
                style={{ width: '100%' }}
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid rgba(245, 239, 230, 0.06)',
                  }}
                >
                  <img
                    src={item.product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-btn, 8px)',
                      objectFit: 'cover',
                      border: '1px solid rgba(198, 161, 91, 0.25)',
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', color: '#F8F5EF', margin: 0, fontWeight: 600 }}>
                        {item.product.name}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: '#C6A15B', margin: '0.2rem 0 0', fontWeight: 500 }}>
                        ₹{item.product.effective_price || item.product.price}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      {/* Quantity stepper */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(248, 245, 239, 0.15)',
                          borderRadius: '6px',
                          background: '#222222',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#F8F5EF',
                            cursor: 'pointer',
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#F8F5EF',
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove item"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#A7A08F',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#d9706a')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#A7A08F')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Section */}
              <div
                style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  border: '1px dashed rgba(198, 161, 91, 0.35)',
                  borderRadius: 'var(--radius-btn, 8px)',
                  padding: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Tag size={16} color="#C6A15B" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8F5EF' }}>Promotional Offer</span>
                </div>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. WELCOME50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      background: '#111111',
                      border: '1px solid rgba(248, 245, 239, 0.15)',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      color: '#F8F5EF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-gold"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.85rem',
                      opacity: couponLoading ? 0.7 : 1,
                    }}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
                {couponResult && (
                  <p style={{ color: '#8fb89a', fontSize: '0.8rem', marginTop: '0.4rem', margin: 0 }}>
                    ✓ {couponResult.message} (-₹{couponResult.discount_amount})
                  </p>
                )}
                {couponError && (
                  <p style={{ color: '#d9706a', fontSize: '0.8rem', marginTop: '0.4rem', margin: 0 }}>
                    ✕ {couponError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(248, 245, 239, 0.08)',
              backgroundColor: '#141414',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#A7A08F' }}>
              <span>Subtotal</span>
              <span style={{ color: '#F8F5EF' }}>₹{cartSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#8fb89a' }}>
                <span>Coupon Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(248, 245, 239, 0.06)',
                marginBottom: '1.25rem',
                fontSize: '1.15rem',
                fontWeight: 700,
              }}
            >
              <span className="font-serif">Estimated Total</span>
              <span style={{ color: '#C6A15B' }}>₹{estimatedTotal.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
