import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        paddingTop: '10rem',
        paddingBottom: '8rem',
        backgroundColor: '#1A1A1A',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 2rem',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <Coffee size={56} color="#C6A15B" style={{ margin: '0 auto 1.5rem' }} />
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: '4rem', margin: 0, fontWeight: 700 }}>
          404
        </h1>
        <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.5rem', margin: '0.5rem 0 1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#A7A08F', marginBottom: '2rem', lineHeight: 1.6 }}>
          The path you seek does not exist or has been relocated within our cafe.
        </p>
        <Link to="/" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Return to Sanctuary
        </Link>
      </div>
    </div>
  );
};
