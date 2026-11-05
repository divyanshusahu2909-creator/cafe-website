import React, { useState } from 'react';
import { Search, AlertCircle, Calendar, Clock, Users } from 'lucide-react';
import { reservationService } from '../services/reservationService';
import { Reservation } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const ReservationLookupPage: React.FC = () => {
  const [reference, setReference] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setError('');
    setCancelMsg('');
    try {
      const data = await reservationService.getReservationByReference(reference.trim().toUpperCase());
      setReservation(data);
    } catch (err: any) {
      setReservation(null);
      setError(err.message || 'No reservation found matching this reference code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    if (!window.confirm('Are you sure you wish to cancel this reservation request?')) return;

    setCancelling(true);
    try {
      const updated = await reservationService.cancelReservation(reservation.reference);
      setReservation(updated);
      setCancelMsg('Reservation has been cancelled.');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel reservation.');
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
          <span className="aa-eyebrow">Booking Status</span>
          <h1 className="aa-display gold-gradient-text">Check Reservation</h1>
          <p className="aa-lede" style={{ margin: '0 auto' }}>
            Enter your reservation reference code (e.g. AA-RES-YYYYMMDD-XXXX)
          </p>
        </div>

        <form onSubmit={handleLookup} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
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
              placeholder="e.g. AA-RES-20261026-K3M9"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gold">
            {loading ? 'Finding...' : 'Search'}
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

        {cancelMsg && (
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
            {cancelMsg}
          </div>
        )}

        {reservation && (
          <div className="aa-card animate-fade-in" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--border-card)',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem',
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
                  {reservation.reference}
                </h3>
                <p style={{ color: 'var(--text-ivory)', margin: '0.35rem 0 0', fontSize: '0.92rem' }}>
                  Guest Name: {reservation.customer_name}
                </p>
              </div>
              <StatusBadge status={reservation.status} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Calendar size={18} style={{ color: 'var(--gold-accent)' }} />
                <span>{reservation.reservation_date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Clock size={18} style={{ color: 'var(--gold-accent)' }} />
                <span>{reservation.reservation_time.slice(0, 5)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Users size={18} style={{ color: 'var(--gold-accent)' }} />
                <span>{reservation.guest_count} Guests</span>
              </div>
            </div>

            {reservation.table_number && (
              <div
                className="aa-inset"
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                  color: 'var(--gold-hover)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                Assigned Table: <strong>{reservation.table_number}</strong>
              </div>
            )}

            {reservation.special_requests && (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Notes: “{reservation.special_requests}”
              </p>
            )}

            {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
              <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleCancel} disabled={cancelling} className="btn-ghost">
                  {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
