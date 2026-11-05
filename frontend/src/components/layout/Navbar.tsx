import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield, Calendar } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'About', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className={`aa-nav ${isScrolled ? 'aa-nav--scrolled' : ''}`}>
        <div className="aa-nav__inner">
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="aa-nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`aa-nav-link ${location.pathname === link.path ? 'is-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="aa-nav__actions">
            <Link to="/admin-dashboard" className="aa-icon-btn" title="Staff Admin Portal" aria-label="Staff Admin Portal">
              <Shield size={18} />
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="aa-nav__cart" aria-label="Open Shopping Cart">
              <ShoppingBag size={18} />
              <span>Cart</span>
              {cartCount > 0 && <span className="aa-nav__count">{cartCount}</span>}
            </button>

            <Link
              to="/reservations"
              className="btn-gold aa-nav__cta"
              style={{ padding: '0.6rem 1.3rem', fontSize: '0.8rem' }}
            >
              <Calendar size={15} />
              Book a Table
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="aa-icon-btn aa-nav__burger"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="aa-nav__drawer animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Logo size="sm" showTagline />
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              style={{ background: 'transparent', border: 'none', color: '#F8F5EF', cursor: 'pointer', padding: '0.5rem' }}
            >
              <X size={24} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem', marginTop: '2rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`aa-nav__drawer-link ${location.pathname === link.path ? 'is-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/reservations"
            className="btn-gold"
            style={{ marginTop: '1.75rem', width: '100%', maxWidth: '280px' }}
          >
            <Calendar size={18} />
            Book a Table
          </Link>

          <Link
            to="/admin-dashboard"
            className="aa-nav__drawer-link"
            style={{ fontSize: '0.82rem', marginTop: '1rem', letterSpacing: '0.14em', opacity: 0.8 }}
          >
            <Shield size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '0.4rem' }} />
            Staff Admin Portal
          </Link>
        </div>
      )}
    </>
  );
};
