import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const OrderLookupPage: React.FC = () => {
  const [reference, setReference] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setError('');
    setCancelMessage('');
    try {
      const data = await orderService.getOrderByReference(reference.trim().toUpperCase());
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'No order found with this reference.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.public_reference);
      setOrder(updated);
      setCancelMessage('Order has been successfully cancelled.');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className="aa-container aa-section"
      style={{ paddingTop: 'clamp(7rem, 14vh, 9rem)', minHeight: '100vh' }}
    >
      <div style={{ maxWidth: 'min(100%, 720px)', margin: '0 auto' }}>
        <div className="aa-section-head">
          <span className="aa-eyebrow">Real-Time Tracking</span>
          <h1 className="aa-display gold-gradient-text">Track Your Order</h1>
          <p className="aa-lede" style={{ margin: '0 auto' }}>
            Enter your unique order reference code (e.g. AA-ORD-YYYYMMDD-XXXX)
          </p>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleLookup}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}
        >
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gold-accent)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            <input
              type="text"
              className="aa-input"
              required
              placeholder="e.g. AA-ORD-20261026-X8F2"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gold">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

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

        {cancelMessage && (
          <div
            style={{
              backgroundColor: 'var(--success-wash)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              color: 'var(--success)',
              marginBottom: '2rem',
            }}
          >
            {cancelMessage}
          </div>
        )}

        {order && (
          <div className="aa-card animate-fade-in" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--border-card)',
                paddingBottom: '1.25rem',
              }}
            >
              <div>
                <span className="aa-label">Reference</span>
                <h3
                  style={{
                    color: 'var(--gold-hover)',
                    margin: 0,
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {order.public_reference}
                </h3>
                <p style={{ color: 'var(--text-ivory)', margin: '0.35rem 0 0', fontSize: '0.92rem' }}>
                  Customer: {order.customer_name} ({order.customer_phone})
                </p>
              </div>
              <StatusBadge status={order.order_status} />
            </div>

            <div className="aa-inset" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.1rem', marginBottom: '1.5rem' }}>
              <span className="aa-label" style={{ marginBottom: 0 }}>Items</span>
              {order.items.map((i) => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.92rem' }}>
                  <span style={{ color: 'var(--text-ivory)' }}>{i.quantity}x {i.product_name_snapshot}</span>
                  <span style={{ color: 'var(--gold-accent)', whiteSpace: 'nowrap' }}>₹{i.line_total}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-card)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span className="aa-label">Total Paid</span>
                <span style={{ color: 'var(--gold-hover)', fontSize: '1.3rem', fontWeight: 700 }}>₹{order.total}</span>
              </div>

              {(order.order_status === 'pending' || order.order_status === 'confirmed') && (
                <button onClick={handleCancel} disabled={cancelling} className="btn-ghost">
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
