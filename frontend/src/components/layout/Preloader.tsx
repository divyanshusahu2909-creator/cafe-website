import React, { useEffect, useState } from 'react';

export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 200 : 1100;

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 450);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.45s ease-out',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        {/* Animated Coffee Cup Emblem */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            border: '2px solid #C6A15B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(198, 161, 91, 0.4)',
            backgroundColor: 'rgba(26, 26, 26, 0.6)',
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C6A15B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <path d="M6 2v2" className="animate-steam" />
            <path d="M10 1v3" className="animate-steam" style={{ animationDelay: '0.3s' }} />
            <path d="M14 2v2" className="animate-steam" style={{ animationDelay: '0.6s' }} />
          </svg>
        </div>

        <div>
          <h2
            className="font-serif"
            style={{
              fontSize: '1.85rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#F8F5EF',
              margin: '0.5rem 0 0.25rem',
              fontWeight: 700,
            }}
          >
            Aesthetic Aroma
          </h2>
          <p
            style={{
              color: '#C6A15B',
              fontSize: '0.8rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Indore
          </p>
        </div>
      </div>
    </div>
  );
};
