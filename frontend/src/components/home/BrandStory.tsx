import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Coffee, Award, ArrowRight } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="about" className="aa-section" style={{ position: 'relative', backgroundColor: '#111111' }}>
      <div className="aa-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 'clamp(2.5rem, 6vw, 4.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Visual Editorial Composition */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid rgba(198, 161, 91, 0.25)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                backgroundColor: '#1A1A1A',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85"
                alt="Aesthetic Aroma Espresso Bar Craftsmanship"
                style={{
                  width: '100%',
                  height: 'clamp(380px, 45vw, 520px)',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.92) contrast(1.05)',
                  transition: 'transform 0.8s ease',
                }}
                className="aa-card__img"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(17, 17, 17, 0.85) 0%, transparent 60%)',
                }}
              />
            </div>

            {/* Floating Glass Editorial Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                right: '1.5rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(26, 26, 26, 0.88)',
                border: '1px solid rgba(198, 161, 91, 0.35)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            >
              <p
                className="font-serif"
                style={{
                  color: '#C6A15B',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                “Where Every Sip Feels Special.”
              </p>
              <p
                style={{
                  color: '#A7A08F',
                  fontSize: '0.82rem',
                  marginTop: '0.35rem',
                  marginBottom: 0,
                  letterSpacing: '0.04em',
                }}
              >
                Indore's sanctuary for mindful culinary moments &amp; artisan coffee.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Brand Story */}
          <div className="aa-stack" style={{ gap: '1.4rem' }}>
            <span className="aa-eyebrow">
              <Sparkles size={15} />
              Our Story &amp; Ethos
            </span>

            <h2 className="aa-title gold-gradient-text" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
              Born from a Passion for Coffee Craft &amp; Architectural Serenity
            </h2>

            <p className="aa-lede" style={{ color: '#F8F5EF', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Located in Scheme 54, Vijay Nagar, <strong>Aesthetic Aroma</strong> was founded as an intentional escape from hurried modern life. We believe coffee is not merely a morning habit, but a meditative daily ritual of flavor, tactile warmth, and community connection.
            </p>

            <p className="aa-lede" style={{ color: '#A7A08F', lineHeight: 1.75 }}>
              From slow-extracted single-origin pour-overs to ceremonial Kyoto cold drip, our kitchen operates on a strict 100% vegetarian philosophy. We partner with ethical estates across India and international micro-lots to bring you coffees roasted to perfection, paired with European sourdough creations and handcrafted desserts.
            </p>

            {/* Value Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: '1.25rem',
                marginTop: '0.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(248, 245, 239, 0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(143, 184, 154, 0.15)',
                    color: '#8FB89A',
                    flexShrink: 0,
                  }}
                >
                  <Leaf size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#F8F5EF', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>100% Vegetarian</h4>
                  <p style={{ color: '#A7A08F', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>Pure gourmet culinary kitchen.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(198, 161, 91, 0.15)',
                    color: '#C6A15B',
                    flexShrink: 0,
                  }}
                >
                  <Coffee size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#F8F5EF', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>Artisan Roasts</h4>
                  <p style={{ color: '#A7A08F', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>Single-origin microlots.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-btn)',
                    background: 'rgba(198, 161, 91, 0.15)',
                    color: '#C6A15B',
                    flexShrink: 0,
                  }}
                >
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#F8F5EF', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>Master Baristas</h4>
                  <p style={{ color: '#A7A08F', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>Precision extraction rituals.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <Link to="/about" className="btn-outline-gold">
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
