import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { OrderType } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, cartSubtotal, clearCart, appliedCoupon } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div
        className="aa-container aa-section"
        style={{ paddingTop: 'clamp(7rem, 14vh, 9rem)', minHeight: '100vh' }}
      >
        <div style={{ maxWidth: 'min(100%, 480px)', margin: '0 auto' }}>
          <div className="aa-empty">
            <ShoppingBag size={48} style={{ color: 'var(--gold-accent)' }} />
            <h2 className="aa-subtitle">Your Cart is Empty</h2>
            <p className="aa-lede" style={{ marginBottom: '1rem' }}>
              Please add your favorite items from our menu before proceeding to checkout.
            </p>
            <Link to="/menu" className="btn-gold">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = orderType === 'delivery' ? 40 : 0;
  const estimatedTotal = cartSubtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setError('Please provide a delivery address for local delivery orders.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Submit order to backend for server-side validation & creation
      const order = await orderService.createOrder({
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        order_type: orderType,
        delivery_address: address,
        customer_notes: notes,
        table_number: tableNumber,
        coupon_code: appliedCoupon || undefined,
        idempotency_key: `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      });

      // 2. Process Demo Payment automatically or mark paid
      const paymentRes = await orderService.processDemoPayment(order.public_reference);

      // 3. Clear cart and navigate to confirmation
      clearCart();
      navigate(`/order-confirmation/${order.public_reference}`, {
        state: { paymentDisclaimer: paymentRes.disclaimer },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: '1.1rem',
  };

  return (
    <div
      className="aa-container aa-section"
      style={{ paddingTop: 'clamp(7rem, 14vh, 9rem)', minHeight: '100vh' }}
    >
      <Link to="/menu" className="btn-ghost" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Menu
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="aa-display gold-gradient-text">Order Checkout</h1>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: 'var(--danger-wash)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Checkout Form */}
        <form
          onSubmit={handleSubmitOrder}
          className="aa-card"
          style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <h3 className="aa-subtitle">1. Order Type</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '0.75rem',
            }}
          >
            {(['takeaway', 'dine_in', 'delivery'] as OrderType[]).map((type) => {
              const active = orderType === type;
              const labels: Record<OrderType, string> = {
                takeaway: 'Takeaway',
                dine_in: 'Dine-In',
                delivery: 'Delivery',
              };
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`aa-chip${active ? ' is-active' : ''}`}
                  style={{ justifyContent: 'center' }}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

          <h3 className="aa-subtitle" style={{ marginTop: '0.75rem' }}>
            2. Customer Details
          </h3>

          <div>
            <label className="aa-label">Full Name *</label>
            <input
              type="text"
              className="aa-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priyanshu Sharma"
            />
          </div>

          <div style={fieldGrid}>
            <div>
              <label className="aa-label">Phone Number (for order SMS/WA) *</label>
              <input
                type="tel"
                className="aa-input"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="aa-label">Email Address (Optional)</label>
              <input
                type="email"
                className="aa-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          {orderType === 'dine_in' && (
            <div>
              <label className="aa-label">Table Number (If seated)</label>
              <input
                type="text"
                className="aa-input"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 4 - Velvet Dining"
              />
            </div>
          )}

          {orderType === 'delivery' && (
            <div>
              <label className="aa-label">Delivery Address in Indore *</label>
              <textarea
                required
                rows={3}
                className="aa-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House No., Street, Landmark, Vijay Nagar / Scheme 54, Indore..."
                style={{ resize: 'vertical' }}
              />
            </div>
          )}

          <div>
            <label className="aa-label">Special Preparation Instructions</label>
            <textarea
              rows={2}
              className="aa-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Oat milk preference, less sugar, extra hot..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Payment Method Notice */}
          <div className="aa-inset" style={{ padding: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--gold-accent)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold-hover)' }}>
                Demo Checkout Mode
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              “Demo payment — no real money will be charged.” Your order will be immediately confirmed in our kitchen database.
            </p>
          </div>

          <button type="submit" disabled={submitting} className="btn-gold" style={{ width: '100%', marginTop: '0.5rem' }}>
            {submitting ? 'Placing Order...' : `Complete Order • ₹${estimatedTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Right Column: Order Summary */}
        <div className="aa-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
          <h3 className="aa-subtitle" style={{ marginBottom: '1.5rem' }}>
            Order Summary ({items.length} items)
          </h3>

          <div className="aa-inset" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: '1.1rem', marginBottom: '1.5rem' }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.92rem' }}>
                <div>
                  <span style={{ color: 'var(--text-ivory)', fontWeight: 500 }}>{item.product.name}</span>
                  <span style={{ color: 'var(--text-dim)', marginLeft: '0.5rem' }}>x {item.quantity}</span>
                </div>
                <span style={{ color: 'var(--gold-accent)', whiteSpace: 'nowrap' }}>
                  ₹{(parseFloat(item.product.effective_price || item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span>Delivery Fee ({orderType})</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                color: 'var(--gold-hover)',
                fontSize: '1.25rem',
                fontWeight: 700,
                paddingTop: '0.75rem',
                marginTop: '0.35rem',
                borderTop: '1px solid var(--border-card)',
              }}
            >
              <span className="font-serif">Total Payable</span>
              <span>₹{estimatedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
