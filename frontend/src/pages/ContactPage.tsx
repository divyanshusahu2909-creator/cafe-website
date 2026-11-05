import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { LocationSection } from '../components/home/LocationSection';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 3000);
  };

  const infoTileStyle: React.CSSProperties = {
    background: 'var(--gold-wash)',
    color: 'var(--gold-accent)',
    flex: '0 0 auto',
  };

  return (
    <div
      className="aa-container aa-section"
      style={{ paddingTop: 'clamp(7rem, 14vh, 9rem)', minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="aa-section-head">
        <span className="aa-eyebrow">Connect with Us</span>
        <h1 className="aa-display gold-gradient-text">Contact Aesthetic Aroma</h1>
        <p className="aa-lede" style={{ margin: '0 auto' }}>
          Have an inquiry regarding private events, custom catering, coffee roasts, or table reservations? Reach out to our team in Indore.
        </p>
      </div>

      <div
        className="aa-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(2rem, 4vw, 3rem)',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* Direct Details */}
        <div>
          <h3 className="aa-subtitle" style={{ marginBottom: '1.5rem' }}>Cafe Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="aa-icon-btn" style={infoTileStyle}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0 }}>Location</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                  Scheme 54, Near Meghdoot Garden, Vijay Nagar, Indore, Madhya Pradesh 452010
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="aa-icon-btn" style={infoTileStyle}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0 }}>Hours</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                  Monday – Sunday: 10:00 AM – 10:30 PM (All 7 Days)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="aa-icon-btn" style={infoTileStyle}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0 }}>Direct Concierge</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="aa-icon-btn" style={infoTileStyle}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0 }}>Email Inquiries</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                  contact@aestheticaroma.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Message Form */}
        <div>
          <h3 className="aa-subtitle" style={{ marginBottom: '1.5rem' }}>Send an Inquiry</h3>

          {sent ? (
            <div className="aa-empty" style={{ minHeight: '100%', justifyContent: 'center' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
              <h4 className="aa-subtitle" style={{ marginBottom: '0.25rem' }}>Message Received</h4>
              <p className="aa-lede" style={{ margin: '0 auto' }}>
                Thank you for reaching out. A representative from our Indore team will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="aa-stack" style={{ gap: '1.1rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                  gap: '1.1rem',
                }}
              >
                <div>
                  <label className="aa-label">Full Name *</label>
                  <input
                    type="text"
                    className="aa-input"
                    required
                    placeholder="e.g. Tanvi Agarwal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="aa-label">Email or Phone *</label>
                  <input
                    type="text"
                    className="aa-input"
                    required
                    placeholder="yourname@gmail.com or +91..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="aa-label">Subject</label>
                <input
                  type="text"
                  className="aa-input"
                  placeholder="e.g. Table Reservation, Private Event, Feedback"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="aa-label">Message *</label>
                <textarea
                  required
                  rows={4}
                  className="aa-input"
                  placeholder="How can we make your visit special?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-gold" style={{ justifyContent: 'center' }}>
                <Send size={16} /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>

      <LocationSection />
    </div>
  );
};
