import React, { useEffect, useState } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      const list = Array.isArray(res) ? res : res.results || [];
      setOrders(list);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      const updated = await adminService.updateOrderStatus(id, newStatus);
      setOrders((prev) => prev.map((o) => (o.public_reference === updated.public_reference ? updated : o)));
      if (selectedOrder?.public_reference === updated.public_reference) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'completed',
    'cancelled',
  ];

  const chipStyle = (active: boolean): React.CSSProperties => ({
    textTransform: 'capitalize',
    opacity: active ? 1 : 0.85,
  });

  return (
    <div className="aa-stack">
      <div>
        <span className="aa-eyebrow">Kitchen &amp; Fulfillment</span>
        <h1 className="aa-title gold-gradient-text" style={{ margin: '0.5rem 0 0' }}>
          Customer Orders
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="aa-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <form onSubmit={handleSearchSubmit} className="aa-row" style={{ maxWidth: '360px', flex: '1 1 240px' }}>
          <input
            type="text"
            className="aa-input"
            placeholder="Search reference or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button type="submit" className="btn-gold" style={{ padding: '0.65rem 1rem' }}>
            <Search size={16} />
          </button>
        </form>

        <div className="aa-tabstrip" style={{ flex: '1 1 100%' }}>
          <button
            onClick={() => setStatusFilter('')}
            className={`aa-chip${!statusFilter ? ' is-active' : ''}`}
            style={chipStyle(!statusFilter)}
          >
            All
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`aa-chip${statusFilter === st ? ' is-active' : ''}`}
              style={chipStyle(statusFilter === st)}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="aa-table-wrap">
        <table className="aa-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div style={{ textAlign: 'center', color: 'var(--gold-accent)', padding: '1rem 0' }}>
                    Loading customer orders...
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="aa-empty">No orders match this filter.</div>
                </td>
              </tr>
            ) : (
              orders.map((ord: any) => (
                <tr key={ord.public_reference}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-hover)', fontWeight: 600 }}>
                    {ord.public_reference}
                  </td>
                  <td>
                    <div>{ord.customer_name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{ord.customer_phone}</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {ord.order_type}
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{ord.total}</td>
                  <td>
                    <StatusBadge status={ord.order_status} />
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {new Date(ord.created_at).toLocaleString()}
                  </td>
                  <td>
                    <div className="aa-row" style={{ justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-outline-gold"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} /> Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect / Status Update Drawer */}
      {selectedOrder && (
        <div className="aa-scrim" onClick={() => setSelectedOrder(null)}>
          <div className="aa-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
              <h3 className="aa-subtitle font-serif" style={{ margin: 0 }}>
                Order #{selectedOrder.public_reference}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="aa-icon-btn"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border-card)' }}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="aa-label">Customer</span>
                <p style={{ color: 'var(--text-ivory)', margin: 0 }}>
                  {selectedOrder.customer_name} ({selectedOrder.customer_phone})
                </p>
                {selectedOrder.customer_email && <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>{selectedOrder.customer_email}</p>}
              </div>

              {selectedOrder.delivery_address && (
                <div>
                  <span className="aa-label">Delivery Address</span>
                  <p style={{ color: 'var(--text-ivory)', margin: 0, fontSize: '0.9rem' }}>{selectedOrder.delivery_address}</p>
                </div>
              )}

              {selectedOrder.customer_notes && (
                <div>
                  <span className="aa-label">Customer Notes</span>
                  <p style={{ color: 'var(--gold-hover)', margin: 0, fontStyle: 'italic', fontSize: '0.88rem' }}>
                    “{selectedOrder.customer_notes}”
                  </p>
                </div>
              )}

              <div>
                <span className="aa-label">Ordered Items</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="aa-inset" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-ivory)' }}>{item.quantity}x {item.product_name_snapshot}</span>
                      <span style={{ color: 'var(--gold-accent)' }}>₹{item.line_total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advance Status Controls */}
            <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '1.25rem' }}>
              <span className="aa-label">Update Kitchen / Fulfillment Status:</span>
              <div className="aa-tabstrip">
                {statuses.map((st) => (
                  <button
                    key={st}
                    disabled={updating || selectedOrder.order_status === st}
                    onClick={() => handleStatusChange((selectedOrder as any).id, st)}
                    className={`aa-chip${selectedOrder.order_status === st ? ' is-active' : ''}`}
                    style={{ ...chipStyle(selectedOrder.order_status === st), opacity: updating && selectedOrder.order_status !== st ? 0.5 : undefined }}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
