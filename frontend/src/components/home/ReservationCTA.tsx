import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { reservationService } from '../../services/reservationService';
import { Reservation } from '../../types';

export const ReservationCTA: React.FC = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState('18:30');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requests, setRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState('');

  const timeSlots = [
    '11:00', '12:30', '14:00', '16:00', '17:30', '18:30', '19:30', '20:30', '21:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please provide your name, phone number, and email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reservationService.createReservation({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        reservation_date: date,
        reservation_time: time + ':00',
        guest_count: guests,
        special_requests: requests.trim() || undefined,
      });
      setConfirmedReservation(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit reservation. Please try another time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="aa-section" style={{ position: 'relative', backgroundColor: '#1A1A1A' }}>
      <div className="aa-container">
        <div className="aa-section-head">
          <span className="aa-eyebrow">
            <Sparkles size={16} />
            Table Reservations
          </span>

          <h2 className="aa-title gold-gradient-text">Reserve Your Cafe Experience</h2>
          <p className="aa-lede">
            Join us for an intimate single-origin tasting, an afternoon coffee meeting, or an evening gathering in our Indore lounge.
          </p>
        </div>

        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: '#111111',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(198, 161, 91, 0.25)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {confirmedReservation ? (
            /* Instant Booking Confirmation Card */
            <div style={{ padding: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center' }}>
              <CheckCircle2 size={64} color="#C6A15B" style={{ margin: '0 auto 1.5rem' }} />
              <span
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C6A15B',
                  fontWeight: 600,
                }}
              >
                Booking Received
              </span>
              <h3 className="font-serif gold-gradient-text" style={{ fontSize: '2.4rem', margin: '0.5rem 0 1rem' }}>
                Your Table is Requested
              </h3>

              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#1F1F1F',
                  border: '1px dashed #C6A15B',
                  padding: '1rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  margin: '1rem 0 2rem',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#A7A08F', textTransform: 'uppercase' }}>
                  Reservation Reference
                </span>
                <span style={{ fontSize: '1.6rem', color: '#F8F5EF', fontWeight: 700, letterSpacing: '0.1em' }}>
                  {confirmedReservation.reference}
                </span>
              </div>

              <p style={{ color: '#A7A08F', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Thank you, <strong>{confirmedReservation.customer_name}</strong>. We have registered your reservation for{' '}
                <strong>{confirmedReservation.guest_count} guests</strong> on{' '}
                <strong>{confirmedReservation.reservation_date}</strong> at <strong>{confirmedReservation.reservation_time.slice(0, 5)}</strong>.
                Our team will confirm table seating shortly.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/reservation-lookup" className="btn-gold">
                  Check Booking Status
                </Link>
                <button
                  onClick={() => setConfirmedReservation(null)}
                  className="btn-outline-gold"
                >
                  Book Another Table
                </button>
              </div>
            </div>
          ) : (
            /* Stylish Inline Reservation Form */
            <form onSubmit={handleSubmit} style={{ padding: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {error && (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-btn)',
                    backgroundColor: 'rgba(217, 112, 106, 0.15)',
                    border: '1px solid var(--danger)',
                    color: '#F87171',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '2rem',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1.75rem',
                  marginBottom: '2rem',
                }}
              >
                {/* 1. Date */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} color="#C6A15B" /> Reservation Date
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="aa-input"
                  />
                </div>

                {/* 2. Guests */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <Users size={16} color="#C6A15B" /> Number of Guests
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[1, 2, 4, 6, 8].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setGuests(num)}
                        style={{
                          flex: 1,
                          padding: '0.75rem 0.5rem',
                          borderRadius: 'var(--radius-btn)',
                          border: guests === num ? '1px solid #C6A15B' : '1px solid rgba(248, 245, 239, 0.1)',
                          backgroundColor: guests === num ? 'rgba(198, 161, 91, 0.2)' : '#1F1F1F',
                          color: guests === num ? '#F8F5EF' : '#A7A08F',
                          fontWeight: guests === num ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {num} {num === 8 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Time Slots */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <Clock size={16} color="#C6A15B" /> Preferred Time Slot (10:00 AM – 10:30 PM)
                  </label>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {timeSlots.map((slot) => {
                      const isSelected = time === slot;
                      return (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setTime(slot)}
                          style={{
                            padding: '0.55rem 1.15rem',
                            borderRadius: 'var(--radius-btn)',
                            border: isSelected ? '1px solid #C6A15B' : '1px solid rgba(248, 245, 239, 0.1)',
                            backgroundColor: isSelected ? '#C6A15B' : '#1F1F1F',
                            color: isSelected ? '#111111' : '#F8F5EF',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Contact: Name */}
                <div>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sen"
                    className="aa-input"
                  />
                </div>

                {/* 5. Contact: Phone */}
                <div>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="aa-input"
                  />
                </div>

                {/* 6. Contact: Email */}
                <div>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="aa-input"
                  />
                </div>

                {/* 7. Special Requests */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    placeholder="e.g. Window table preferred, anniversary celebration, quiet meeting corner..."
                    className="aa-input"
                  />
                </div>
              </div>

              {/* Submit & Secondary Links */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(248, 245, 239, 0.08)',
                }}
              >
                <Link
                  to="/reservation-lookup"
                  style={{
                    color: '#C6A15B',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  Already booked? Track reservation <ArrowRight size={15} />
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold"
                  style={{ padding: '0.9rem 2.5rem', fontSize: '0.92rem' }}
                >
                  {submitting ? 'Submitting Reservation...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
