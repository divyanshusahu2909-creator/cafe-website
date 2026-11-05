import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Shield,
  Globe,
} from 'lucide-react';
import { Logo } from '../ui/Logo';

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Instagram', icon: <InstagramIcon size={18} />, href: 'https://instagram.com' },
    { name: 'Facebook', icon: <FacebookIcon size={18} />, href: 'https://facebook.com' },
    { name: 'Twitter', icon: <TwitterIcon size={18} />, href: 'https://twitter.com' },
    { name: 'Google Maps', icon: <Globe size={18} />, href: 'https://maps.google.com/?q=Vijay+Nagar+Indore' },
  ];

  return (
    <footer className="aa-footer" style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(198, 161, 91, 0.2)' }}>
      <div className="aa-container">
        <div className="aa-footer__grid">
          {/* Column 1: Brand & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Logo size="md" showTagline />
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#A7A08F', margin: 0 }}>
              Indore's premier destination for artisan coffee, European vegetarian gastronomy, and tranquil aesthetic elegance.
            </p>

            {/* Social Media Links */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C6A15B',
                  marginBottom: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Connect With Us
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Follow Aesthetic Aroma on ${s.name}`}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-btn)',
                      backgroundColor: '#1E1E1E',
                      border: '1px solid rgba(248, 245, 239, 0.1)',
                      color: '#F8F5EF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.25s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C6A15B';
                      e.currentTarget.style.color = '#C6A15B';
                      e.currentTarget.style.backgroundColor = 'rgba(198, 161, 91, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(248, 245, 239, 0.1)';
                      e.currentTarget.style.color = '#F8F5EF';
                      e.currentTarget.style.backgroundColor = '#1E1E1E';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="aa-chip"
                style={{ color: '#C6A15B', borderColor: 'rgba(198, 161, 91, 0.35)' }}
              >
                <MessageSquare size={16} /> WhatsApp Concierge
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="aa-footer__title">Navigation</h4>
            <ul className="aa-footer__links">
              {[
                { name: 'Home', path: '/' },
                { name: 'Artisan Menu', path: '/menu' },
                { name: 'About Our Story', path: '/about' },
                { name: 'Atmosphere Gallery', path: '/gallery' },
                { name: 'Book a Table', path: '/reservations' },
                { name: 'Track Order', path: '/order-lookup' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="aa-footer__link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hours & Indore Location */}
          <div>
            <h4 className="aa-footer__title">Indore Sanctuary</h4>
            <div className="aa-footer__meta">
              <div>
                <MapPin size={18} color="#C6A15B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Scheme 54, Near Meghdoot Garden, Vijay Nagar, Indore, Madhya Pradesh 452010</span>
              </div>
              <div>
                <Clock size={18} color="#C6A15B" style={{ flexShrink: 0 }} />
                <span>Mon – Sun: 10:00 AM – 10:30 PM</span>
              </div>
              <div>
                <Phone size={18} color="#C6A15B" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </div>
              <div>
                <Mail size={18} color="#C6A15B" style={{ flexShrink: 0 }} />
                <span>contact@aestheticaroma.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="aa-footer__bottom">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Aesthetic Aroma. All rights reserved. 100% Pure Vegetarian Cafe.
          </p>

          <div className="aa-footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/admin-dashboard">
              <Shield size={13} /> Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
