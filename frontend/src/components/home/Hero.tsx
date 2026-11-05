import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Coffee, Calendar, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(7rem, 16vh, 9rem) var(--gutter) clamp(4.5rem, 10vh, 6rem)',
        overflow: 'hidden',
        backgroundColor: '#111111',
      }}
    >
      {/* Background Video / Photographic Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=85"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.38,
            transform: 'scale(1.04)',
            filter: 'brightness(0.7) contrast(1.15)',
          }}
        >
          {/* Subtle slow-motion espresso pouring video clip */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-in-slow-motion-42861-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic Multi-Gradient Overlays for Depth and Contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at center, rgba(17, 17, 17, 0.5) 0%, rgba(17, 17, 17, 0.95) 90%),
              linear-gradient(to bottom, rgba(17, 17, 17, 0.8) 0%, rgba(26, 26, 26, 0.4) 45%, rgba(17, 17, 17, 0.98) 100%)
            `,
          }}
        />
      </div>

      {/* Atmospheric Gold Ambient Lighting */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 750px)',
          height: '420px',
          background: 'radial-gradient(ellipse at center, rgba(198, 161, 91, 0.16), transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '960px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.4rem',
        }}
        className="animate-fade-in"
      >
        {/* Brand Pre-Title Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.5rem 1.4rem',
            borderRadius: 'var(--radius-btn)',
            backgroundColor: 'rgba(26, 26, 26, 0.75)',
            border: '1px solid rgba(198, 161, 91, 0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Sparkles size={14} color="#C6A15B" />
          <span
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#F5F0E8',
              fontWeight: 600,
            }}
          >
            Aesthetic Aroma
          </span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#C6A15B' }} />
          <span
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C6A15B',
              fontWeight: 500,
            }}
          >
            Indore
          </span>
        </div>

        {/* Main Editorial Tagline */}
        <h1
          className="font-serif gold-gradient-text"
          style={{
            fontSize: 'clamp(2.6rem, 6.8vw, 5.2rem)',
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: '0.25rem 0',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
          }}
        >
          Where Every Sip Feels Special.
        </h1>

        {/* Editorial Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            maxWidth: '680px',
            color: '#A7A08F',
            lineHeight: 1.75,
            fontWeight: 300,
            margin: '0 auto',
          }}
        >
          An elevated vegetarian sanctuary crafted for coffee connoisseurs. Immerse yourself in artisan single-origin espresso rituals, European gastronomy, and atmospheric modern serenity.
        </p>

        {/* Primary Call to Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '1.5rem',
          }}
        >
          <Link
            to="/menu"
            className="btn-gold"
            style={{
              padding: '0.95rem 2.4rem',
              fontSize: '0.92rem',
            }}
          >
            <Coffee size={18} />
            Explore Menu
          </Link>

          <a
            href="#reservation"
            className="btn-outline-gold"
            style={{
              padding: '0.95rem 2.4rem',
              fontSize: '0.92rem',
            }}
          >
            <Calendar size={18} />
            Book a Table
          </a>
        </div>

        {/* Feature Badges / Ethos */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(1.2rem, 3vw, 2.5rem)',
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(248, 245, 239, 0.08)',
            color: '#A7A08F',
            fontSize: '0.84rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8FB89A' }} />
            100% Vegetarian Kitchen
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C6A15B' }} />
            Single-Origin Roasts
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C6A15B' }} />
            Artisanal Lounge
          </span>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          color: '#A7A08F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          textDecoration: 'none',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.75,
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.color = '#C6A15B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.75';
          e.currentTarget.style.color = '#A7A08F';
        }}
      >
        <span>Discover</span>
        <ChevronDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
};
