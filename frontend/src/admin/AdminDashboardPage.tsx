import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  CalendarCheck,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { DashboardMetrics, Order, Reservation } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<{
    metrics: DashboardMetrics;
    popular_products: Array<{ product_name_snapshot: string; order_count: number; total_qty: number }>;
    recent_orders: Order[];
    recent_reservations: Reservation[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'Failed to load metrics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ color: 'var(--gold-accent)', padding: '2rem 0', fontFamily: 'var(--font-serif)' }}>
        Loading live cafe analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          backgroundColor: 'var(--danger-wash)',
          border: '1px solid var(--danger)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--danger)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={20} />
          <strong>Error loading dashboard:</strong>
        </div>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  const { metrics, popular_products, recent_orders, recent_reservations } = data;

  const metricCards = [
    { label: 'Total Revenue (Paid)', value: `₹${metrics.total_sales}`, icon: <TrendingUp size={22} color="var(--gold-accent)" />, note: 'Calculated from paid orders' },
    { label: 'Orders Today', value: metrics.orders_today, icon: <ShoppingBag size={22} color="var(--success)" />, note: `${metrics.total_orders} total orders recorded` },
    { label: 'Pending Kitchen Orders', value: metrics.pending_orders, icon: <Clock size={22} color="var(--warning)" />, note: 'Requires preparation action' },
    { label: 'Confirmed Reservations', value: metrics.confirmed_reservations, icon: <CalendarCheck size={22} color="var(--gold-accent)" />, note: `${metrics.pending_reservations} requests pending review` },
  ];

  const viewAllStyle: React.CSSProperties = {
    color: 'var(--gold-accent)',
    fontSize: '0.85rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
  };

  return (
    <div className="aa-stack">
      {/* Page Title */}
      <div>
        <span className="aa-eyebrow">Executive Overview</span>
        <h1 className="aa-title gold-gradient-text" style={{ margin: '0.5rem 0 0.35rem' }}>
          Aesthetic Aroma Analytics
        </h1>
        <p className="aa-lede" style={{ margin: 0 }}>
          Live operational data from Indore store database.
        </p>
      </div>

      {/* Metrics Tiles */}
      <div className="aa-grid">
        {metricCards.map((card, idx) => (
          <div key={idx} className="aa-stat">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <span className="aa-stat__label">{card.label}</span>
              <span
                style={{
                  display: 'inline-flex',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--gold-wash)',
                }}
              >
                {card.icon}
              </span>
            </div>
            <div className="aa-stat__value">{card.value}</div>
            <p style={{ color: 'var(--text-faint)', fontSize: '0.75rem', margin: 0 }}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Orders & Recent Reservations */}
      <div className="aa-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' }}>
        {/* Recent Orders */}
        <div className="aa-panel" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="aa-subtitle font-serif" style={{ margin: 0 }}>Recent Orders</h3>
            <Link to="/admin-dashboard/orders" style={viewAllStyle}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recent_orders.length === 0 ? (
              <div className="aa-empty">No orders yet.</div>
            ) : (
              recent_orders.map((ord) => (
                <div
                  key={ord.public_reference}
                  className="aa-inset"
                  style={{
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--gold-hover)', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.88rem' }}>
                        {ord.public_reference}
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>• {ord.order_type}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                      {ord.customer_name} ({ord.customer_phone})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: 'var(--text-ivory)', fontWeight: 600, fontSize: '0.9rem' }}>₹{ord.total}</div>
                    <div style={{ marginTop: '0.25rem' }}>
                      <StatusBadge status={ord.order_status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="aa-panel" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem' }}>
            <h3 className="aa-subtitle font-serif" style={{ margin: 0 }}>Recent Table Reservations</h3>
            <Link to="/admin-dashboard/reservations" style={viewAllStyle}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recent_reservations.length === 0 ? (
              <div className="aa-empty">No reservation requests yet.</div>
            ) : (
              recent_reservations.map((res) => (
                <div
                  key={res.reference}
                  className="aa-inset"
                  style={{
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'var(--text-ivory)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {res.customer_name} ({res.guest_count} Guests)
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      {res.reservation_date} at {res.reservation_time.slice(0, 5)}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    <StatusBadge status={res.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popular Products Row */}
      {popular_products.length > 0 && (
        <div className="aa-panel" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
          <h3 className="aa-subtitle font-serif" style={{ margin: '0 0 1rem' }}>Top Ordered Items</h3>
          <div className="aa-row">
            {popular_products.map((p, idx) => (
              <span
                key={idx}
                className="aa-badge aa-badge--coffee"
                style={{ padding: '0.5rem 0.9rem', textTransform: 'none', letterSpacing: '0.02em' }}
              >
                <Sparkles size={16} color="var(--gold-accent)" />
                <span style={{ color: 'var(--text-ivory)', fontWeight: 500, fontSize: '0.9rem' }}>
                  {p.product_name_snapshot}
                </span>
                <span style={{ color: 'var(--gold-hover)', fontSize: '0.8rem' }}>{p.total_qty} ordered</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
