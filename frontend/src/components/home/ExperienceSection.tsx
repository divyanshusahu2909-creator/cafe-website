import React from 'react';
import { Coffee, ShieldCheck, Armchair } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      icon: <Coffee size={32} color="var(--gold-accent)" />,
      title: 'Artisan Brewing Rituals',
      description:
        'Custom-engineered extraction parameters tailored for every bean. From precise 18-hour cold drips to velvet steam lattes, coffee here is an exacting art.',
    },
    {
      icon: <ShieldCheck size={32} color="var(--gold-accent)" />,
      title: '100% Pure Vegetarian Kitchen',
      description:
        'Indore’s true vegetarian fine dining cafe. Slow-fermented sourdough, fresh burrata, hand-ground pesto, and rich Belgian chocolates with zero compromise on ethics.',
    },
    {
      icon: <Armchair size={32} color="var(--gold-accent)" />,
      title: 'Cinematic Atmosphere',
      description:
        'Curated warm lighting, natural foliage, acoustic balance, and custom velvet seating crafted for long conversations, productive focus, or quiet rejuvenation.',
    },
  ];

  return (
    <section className="aa-section">
      <div className="aa-container">
        <div className="aa-section-head">
          <span className="aa-eyebrow">The Experience</span>
          <h2 className="aa-title gold-gradient-text">Crafted for Unhurried Moments</h2>
          <p className="aa-lede">
            Every corner of Aesthetic Aroma is designed to elevate your senses and create a memorable oasis in Madhya Pradesh.
          </p>
        </div>

        <div className="aa-grid">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="aa-card aa-card--hover"
              style={{
                padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div
                className="aa-inset"
                style={{
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {exp.icon}
              </div>
              <h3 className="aa-subtitle">{exp.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
