import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { Reservation, CafeTable } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, tablesData] = await Promise.all([
        adminService.getReservations({ status: statusFilter || undefined }),
        adminService.getTables(),
      ]);
      const list = Array.isArray(resData) ? resData : resData.results || [];
      setReservations(list);
      setTables(tablesData);
    } catch (err: any) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleUpdateStatus = async (
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
  ) => {
    if (!selectedRes) return;
    setUpdating(true);
    try {
      const resId = (selectedRes as any).id;
      const updated = await adminService.updateReservationStatus(
        resId,
        status,
        selectedTableId ? Number(selectedTableId) : null,
        adminNotes
      );
      setReservations((prev) =>
        prev.map((r) => (r.reference === updated.reference ? updated : r))
      );
      setSelectedRes(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update reservation.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="aa-stack">
      <div>
        <span className="aa-eyebrow">Table Management</span>
        <h1 className="aa-title gold-gradient-text" style={{ margin: '0.5rem 0 0' }}>
          Table Reservations ({reservations.length})
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="aa-tabstrip">
        {['', 'pending', 'confirmed', 'rejected', 'completed', 'cancelled'].map((st) => (
          <button
            key={st || 'all'}
            onClick={() => setStatusFilter(st)}
            className={`aa-chip${statusFilter === st ? ' is-active' : ''}`}
            style={{ textTransform: 'capitalize' }}
          >
            {st ? st : 'All Bookings'}
          </button>
        ))}
      </div>

      {/* Reservations Table */}
      <div className="aa-table-wrap">
        <table className="aa-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Guest Name</th>
              <th>Date &amp; Time</th>
              <th>Guests</th>
              <th>Assigned Table</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div style={{ textAlign: 'center', color: 'var(--gold-accent)', padding: '1rem 0' }}>
                    Loading reservations...
                  </div>
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="aa-empty">No reservations found for this filter.</div>
                </td>
              </tr>
            ) : (
              reservations.map((res: any) => (
                <tr key={res.reference}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-hover)', fontWeight: 600 }}>
                    {res.reference}
                  </td>
                  <td>
                    <div>{res.customer_name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{res.customer_phone}</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {res.reservation_date} at {res.reservation_time.slice(0, 5)}
                  </td>
                  <td>{res.guest_count}</td>
                  <td style={{ color: 'var(--gold-accent)' }}>
                    {res.table_details?.table_number || (res.table ? `Table #${res.table}` : '—')}
                  </td>
                  <td>
                    <StatusBadge status={res.status} />
                  </td>
                  <td>
                    <div className="aa-row" style={{ justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedRes(res);
                          setSelectedTableId(res.table || '');
                          setAdminNotes(res.admin_notes || '');
                        }}
                        className="btn-outline-gold"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reservation Management Modal */}
      {selectedRes && (
        <div className="aa-scrim" onClick={() => setSelectedRes(null)}>
          <div className="aa-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <h3 className="aa-subtitle font-serif" style={{ margin: 0 }}>
                Manage Reservation #{selectedRes.reference}
              </h3>
              <button onClick={() => setSelectedRes(null)} className="aa-icon-btn" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-card)' }} title="Close">
                <X size={20} />
              </button>
            </div>

            <div className="aa-inset" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--text-ivory)', margin: 0 }}>
                Guest: <strong>{selectedRes.customer_name}</strong> ({selectedRes.customer_phone})
              </p>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                Date &amp; Time: {selectedRes.reservation_date} at {selectedRes.reservation_time.slice(0, 5)} ({selectedRes.guest_count} Guests)
              </p>
              {selectedRes.special_requests && (
                <p style={{ color: 'var(--gold-hover)', margin: 0, fontSize: '0.85rem', fontStyle: 'italic' }}>
                  Requests: “{selectedRes.special_requests}”
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="aa-label">Assign Seating Table</label>
              <select
                className="aa-input"
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">No Table Assigned</option>
                {tables.map((tbl) => (
                  <option key={tbl.id} value={tbl.id}>
                    {tbl.table_number} ({tbl.location_display || tbl.location} - {tbl.capacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="aa-label">Internal Staff Notes</label>
              <textarea
                className="aa-input"
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. VIP guest, requested anniversary candle, confirmed via phone..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="aa-row" style={{ justifyContent: 'flex-end' }}>
              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('rejected')}
                className="btn-ghost"
                style={{
                  color: 'var(--danger)',
                  borderColor: 'var(--danger)',
                  backgroundColor: 'var(--danger-wash)',
                }}
              >
                Decline
              </button>

              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('confirmed')}
                className="btn-gold"
              >
                Confirm &amp; Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
