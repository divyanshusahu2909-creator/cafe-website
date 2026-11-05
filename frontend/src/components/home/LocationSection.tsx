import React from 'react';
import { MapPin, Clock, Phone, Navigation, MessageCircle } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="contact" className="aa-section">
      <div className="aa-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Business Details */}
          <div className="aa-stack" style={{ gap: '1.25rem' }}>
            <span className="aa-eyebrow">Visit Our Sanctuary</span>

            <h2 className="aa-title gold-gradient-text">Indore, Madhya Pradesh</h2>

            <p className="aa-lede">
              Conveniently located near Vijay Nagar in Scheme 54. Whether you seek a morning single-origin cortado or an intimate late-evening vegetarian dinner, our doors are open.
            </p>

            <div className="aa-stack" style={{ gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-xs)', background: 'var(--gold-wash)', color: 'var(--gold-accent)' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0, fontWeight: 600 }}>Address</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                    Scheme 54, Near Meghdoot Garden, Vijay Nagar, Indore, MP 452010
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-xs)', background: 'var(--gold-wash)', color: 'var(--gold-accent)' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0, fontWeight: 600 }}>Opening Hours</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                    Monday – Sunday: 10:00 AM – 10:30 PM
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-xs)', background: 'var(--gold-wash)', color: 'var(--gold-accent)' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-ivory)', fontSize: '1rem', margin: 0, fontWeight: 600 }}>Reservations &amp; Inquiries</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
                    +91 98765 43210 (Direct &amp; WhatsApp)
                  </p>
                </div>
              </div>
            </div>

            <div className="aa-row" style={{ marginTop: '1rem' }}>
              <a
                href="https://maps.google.com/?q=Vijay+Nagar+Indore+Madhya+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                <Navigation size={18} /> Get Directions
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-gold"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right Column: Atmospheric Map Embed */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              height: 'clamp(320px, 40vw, 440px)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            {/* Embedded Google Maps view for Vijay Nagar Indore */}
            <iframe
              title="Aesthetic Aroma Indore Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
              loading="lazy"
              src="https://maps.google.com/maps?q=Vijay%20Nagar,%20Indore,%20Madhya%20Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
            <div
              className="aa-inset"
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                color: 'var(--gold-hover)',
              }}
            >
              📍 Scheme 54, Vijay Nagar, Indore (Demo Location)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
