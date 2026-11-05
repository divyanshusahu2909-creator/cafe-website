import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { reservationService } from '../services/reservationService';
import { Reservation } from '../types';

export const ReservationPage: React.FC = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requests, setRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState('');

  const timeSlots = [
    '10:30', '11:30', '12:30', '13:30', '14:30',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '21:45'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !time) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await reservationService.createReservation({
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        reservation_date: date,
        reservation_time: `${time}:00`,
        guest_count: guests,
        special_requests: requests,
      });
      setReservation(data);
    } catch (err: any) {
      setError(err.message || 'Failed to submit reservation. Please check availability.');
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
      <div style={{ maxWidth: 'min(100%, 780px)', margin: '0 auto' }}>
        {/* Header */}
        <div className="aa-section-head">
          <span className="aa-eyebrow">Table Reservation</span>
          <h1 className="aa-display gold-gradient-text">Book Your Table</h1>
          <p className="aa-lede" style={{ margin: '0 auto' }}>
            Experience unhurried conversations and artisan dining in Indore. Seating available across our indoor lounge and courtyard patio.
          </p>
        </div>

        {reservation ? (
          <div className="aa-panel animate-fade-in" style={{ padding: 'clamp(2rem, 6vw, 3.5rem)', textAlign: 'center' }}>
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
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
            </div>

            <span className="aa-eyebrow">Request Received</span>
            <h2 className="aa-title gold-gradient-text" style={{ margin: '0.75rem 0 1rem' }}>
              Reservation Awaiting Review
            </h2>
            <p className="aa-lede" style={{ margin: '0 auto 2rem' }}>
              Thank you, <strong>{reservation.customer_name}</strong>. Our cafe maître d' has received your booking for <strong>{reservation.guest_count} guests</strong> on <strong>{reservation.reservation_date} at {reservation.reservation_time.slice(0, 5)}</strong>. You will receive confirmation via WhatsApp or phone.
            </p>

            <div className="aa-inset" style={{ display: 'inline-block', padding: '0.85rem 1.75rem', marginBottom: '2rem' }}>
              <span className="aa-label" style={{ margin: 0 }}>Booking Reference</span>
              <span
                style={{
                  color: 'var(--gold-hover)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '0.06em',
                }}
              >
                {reservation.reference}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/reservation-lookup" className="btn-gold">
                Track Status Online
              </Link>
              <button onClick={() => setReservation(null)} className="btn-outline-gold">
                Make Another Booking
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="aa-card"
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.6rem',
            }}
          >
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
                }}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Date & Time Selection */}
            <div style={fieldGrid}>
              <div>
                <label className="aa-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} style={{ color: 'var(--gold-accent)' }} /> Date *
                </label>
                <input
                  type="date"
                  className="aa-input"
                  required
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="aa-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} style={{ color: 'var(--gold-accent)' }} /> Time Slot *
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="aa-input"
                  style={{ cursor: 'pointer' }}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} (10:00 AM – 10:30 PM)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="aa-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} style={{ color: 'var(--gold-accent)' }} /> Guests *
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  className="aa-input"
                  style={{ cursor: 'pointer' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Contact */}
            <div style={fieldGrid}>
              <div>
                <label className="aa-label">Your Full Name *</label>
                <input
                  type="text"
                  className="aa-input"
                  required
                  placeholder="e.g. Ananya Rathore"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="aa-label">Phone Number (for confirmation) *</label>
                <input
                  type="tel"
                  className="aa-input"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="aa-label">Email Address</label>
                <input
                  type="email"
                  className="aa-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="aa-label">Special Requests or Occasions</label>
              <textarea
                rows={3}
                className="aa-input"
                placeholder="e.g. Birthday anniversary celebration, outdoor patio seating preference, quiet corner for business..."
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-gold" style={{ width: '100%' }}>
              {submitting ? 'Requesting Table...' : 'Confirm Table Reservation Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
