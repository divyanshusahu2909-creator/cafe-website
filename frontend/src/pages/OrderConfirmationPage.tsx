import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const OrderConfirmationPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paymentDisclaimer =
    location.state?.paymentDisclaimer || 'Demo payment — no real money will be charged.';

  useEffect(() => {
    if (!reference) return;
    orderService
      .getOrderByReference(reference)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message || 'Unable to retrieve order details.'))
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) {
    return (
      <div
        className="aa-container"
        style={{
          paddingTop: 'clamp(7rem, 14vh, 9rem)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <p className="aa-subtitle" style={{ color: 'var(--gold-accent)' }}>Retrieving your order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        className="aa-container"
        style={{
          paddingTop: 'clamp(7rem, 14vh, 9rem)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 'min(100%, 520px)' }}>
          <h2 className="aa-title" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
            Order Not Found
          </h2>
          <p className="aa-lede" style={{ margin: '0 auto 2rem' }}>{error || 'No matching order was found.'}</p>
          <Link to="/menu" className="btn-gold">Return to Menu</Link>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Received' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: order.order_type === 'delivery' ? 'Out for Delivery' : 'Ready' },
    { key: 'completed', label: 'Delivered / Completed' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.order_status);

  return (
    <div
      className="aa-container aa-section"
      style={{ paddingTop: 'clamp(7rem, 14vh, 9rem)', minHeight: '100vh' }}
    >
      <div style={{ maxWidth: 'min(100%, 820px)', margin: '0 auto' }}>
        {/* Success Header */}
        <div
          className="aa-panel animate-fade-in"
          style={{
            textAlign: 'center',
            padding: 'clamp(2rem, 6vw, 3rem) clamp(1.25rem, 4vw, 2rem)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-wash)',
              border: '1px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
          </div>

          <span className="aa-eyebrow">Order Confirmed</span>

          <h1 className="aa-title gold-gradient-text" style={{ margin: '0.75rem 0' }}>
            Thank You, {order.customer_name}
          </h1>

          <p className="aa-lede" style={{ margin: '0 auto 1.5rem' }}>
            Your culinary selection has been dispatched to our kitchen station.
          </p>

          <div className="aa-inset" style={{ display: 'inline-block', padding: '0.75rem 1.5rem' }}>
            <span className="aa-label" style={{ margin: 0 }}>Order Reference</span>
            <span
              style={{
                color: 'var(--gold-hover)',
                fontSize: '1.3rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {order.public_reference}
            </span>
          </div>

          {/* Demo Payment Notice */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              backgroundColor: 'var(--gold-wash)',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--gold-hover)',
              fontSize: '0.82rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>{paymentDisclaimer}</span>
          </div>
        </div>

        {/* Live Status Tracker */}
        <div className="aa-card" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 className="aa-subtitle">Live Order Status</h3>
            <StatusBadge status={order.order_status} />
          </div>

          {/* Stepper Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              return (
                <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2, gap: '0.35rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isPast
                        ? 'linear-gradient(135deg, var(--gold-hover), var(--gold-accent))'
                        : 'var(--bg-elevated)',
                      color: isPast ? 'var(--espresso)' : 'var(--text-faint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      boxShadow: isPast ? 'var(--shadow-gold)' : 'none',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: isPast ? 'var(--text-ivory)' : 'var(--text-faint)', textAlign: 'center' }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Breakdown */}
        <div className="aa-card" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', marginBottom: '2.5rem' }}>
          <h3 className="aa-subtitle" style={{ marginBottom: '1.25rem' }}>Order Summary</h3>

          <div className="aa-inset" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.1rem', marginBottom: '1.25rem' }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--text-ivory)' }}>
                  {item.quantity}x {item.product_name_snapshot}
                </span>
                <span style={{ color: 'var(--gold-accent)', whiteSpace: 'nowrap' }}>₹{item.line_total}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {parseFloat(order.discount_amount) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontSize: '0.9rem' }}>
                <span>Coupon Discount</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span>Delivery Fee ({order.order_type})</span>
              <span>₹{order.delivery_fee}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--gold-hover)',
                fontSize: '1.2rem',
                fontWeight: 700,
                paddingTop: '0.5rem',
                marginTop: '0.25rem',
                borderTop: '1px solid var(--border-card)',
              }}
            >
              <span className="font-serif">Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/menu" className="btn-gold">
            Order More Delights
          </Link>
          <Link to="/" className="btn-outline-gold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
