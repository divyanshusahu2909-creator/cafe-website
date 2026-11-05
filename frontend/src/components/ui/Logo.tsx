import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  return (
    <Link to="/" className={`aa-logo aa-logo--${size} ${className}`.trim()}>
      <span className="aa-logo__emblem">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <path d="M6 2v2" className="animate-steam" />
          <path d="M10 1v3" className="animate-steam" style={{ animationDelay: '0.4s' }} />
          <path d="M14 2v2" className="animate-steam" style={{ animationDelay: '0.8s' }} />
        </svg>
      </span>
      <span className="aa-logo__text">
        <span className="aa-logo__wordmark">Aesthetic Aroma</span>
        {showTagline && <span className="aa-logo__tagline">Where Every Sip Feels Special</span>}
      </span>
    </Link>
  );
};
