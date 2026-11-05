import React from 'react';
import { Leaf, Coffee, Heart } from 'lucide-react';
import { BrandStory } from '../components/home/BrandStory';
import { ExperienceSection } from '../components/home/ExperienceSection';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Editorial Hero */}
      <div
        className="aa-container"
        style={{
          paddingTop: 'clamp(7rem, 14vh, 9rem)',
          paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div className="aa-section-head">
          <span className="aa-eyebrow">The Aesthetic Aroma Story</span>
          <h1 className="aa-display gold-gradient-text">Crafted with Mindful Passion</h1>
          <p className="aa-lede" style={{ margin: '0 auto' }}>
            Rooted in Indore, Aesthetic Aroma was born from a singular conviction: that a cafe can be both an uncompromising temple of artisan coffee and an extraordinary haven of 100% vegetarian culinary craft.
          </p>
        </div>
      </div>

      <BrandStory />
      <ExperienceSection />

      {/* Sourcing & Culinary Code */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="aa-container aa-section">
          <div className="aa-section-head">
            <h2 className="aa-title gold-gradient-text">Our Three Inviolable Standards</h2>
            <p className="aa-lede">Principles that guide every shot pulled and every pastry baked.</p>
          </div>

          <div className="aa-grid">
            <div className="aa-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <Coffee size={28} style={{ color: 'var(--gold-accent)', marginBottom: '1rem' }} />
              <h3 className="aa-subtitle" style={{ marginBottom: '0.5rem' }}>Single-Origin Integrity</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                We work directly with sustainable, shade-grown estates across southern India, roast in precise micro-batches, and dial-in extraction daily based on atmospheric humidity.
              </p>
            </div>

            <div className="aa-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <Leaf size={28} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
              <h3 className="aa-subtitle" style={{ marginBottom: '0.5rem' }}>100% Vegetarian Honesty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                Zero meat, zero fish, zero gelatin. Pure vegetarian innovation with house-made pestos, stone-baked slow-fermented sourdough, and premium dairy or plant milks.
              </p>
            </div>

            <div className="aa-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <Heart size={28} style={{ color: 'var(--gold-accent)', marginBottom: '1rem' }} />
              <h3 className="aa-subtitle" style={{ marginBottom: '0.5rem' }}>Indore's Warmth</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                We bring a high-touch, attentive standard of hospitality where regulars are remembered by name and newcomers feel immediately at home.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
