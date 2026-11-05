import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { Product } from '../../types';
import { menuService } from '../../services/menuService';
import { ProductCard } from '../menu/ProductCard';

export const SignatureCoffee: React.FC<{ onSelectProduct?: (product: Product) => void }> = ({
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuService
      .getFeaturedProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to load featured products:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="aa-section" style={{ position: 'relative', backgroundColor: '#1A1A1A' }}>
      <div className="aa-container">
        {/* Section Header */}
        <div className="aa-section-head">
          <span className="aa-eyebrow">
            <Sparkles size={16} />
            Specialty Masterpieces
          </span>

          <h2 className="aa-title gold-gradient-text">Signature Coffee Creations</h2>

          <p className="aa-lede">
            Meticulously extracted single-origin roasts, silky micro-foams, and edible gold dust crafted for discerning coffee lovers.
          </p>
        </div>

        {/* Featured Hero Showcase Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            backgroundColor: '#111111',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(198, 161, 91, 0.25)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', height: '100%', minHeight: '340px' }}>
            <img
              src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85"
              alt="Aesthetic Signature Latte Craft"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(17, 17, 17, 0.7) 0%, transparent 60%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                backgroundColor: 'rgba(17, 17, 17, 0.85)',
                border: '1px solid #C6A15B',
                color: '#C6A15B',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-btn)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Flame size={14} /> Masterpiece of the House
            </div>
          </div>

          <div style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C6A15B',
                fontWeight: 600,
              }}
            >
              Barista Highlight
            </span>
            <h3
              className="font-serif"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                color: '#F8F5EF',
                margin: '0.5rem 0 1rem',
                fontWeight: 700,
              }}
            >
              The Aesthetic Signature Latte
            </h3>
            <p style={{ color: '#A7A08F', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '1.5rem' }}>
              Our crowning beverage. Roasted Ethiopian Yirgacheffe espresso married with textured oat milk, Madagascar bourbon vanilla, and crowned with delicate 24-karat edible gold dust.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#A7A08F', letterSpacing: '0.1em' }}>Origin</span>
                <p style={{ margin: '0.2rem 0 0', color: '#F8F5EF', fontWeight: 600 }}>Yirgacheffe, Ethiopia</p>
              </div>
              <div style={{ borderLeft: '1px solid rgba(248, 245, 239, 0.1)', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#A7A08F', letterSpacing: '0.1em' }}>Tasting Notes</span>
                <p style={{ margin: '0.2rem 0 0', color: '#C6A15B', fontWeight: 600 }}>Floral Jasmine • Citrus • Gold</p>
              </div>
              <div style={{ borderLeft: '1px solid rgba(248, 245, 239, 0.1)', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#A7A08F', letterSpacing: '0.1em' }}>Price</span>
                <p style={{ margin: '0.2rem 0 0', color: '#F8F5EF', fontWeight: 700, fontSize: '1.2rem' }}>₹199</p>
              </div>
            </div>

            <Link to="/menu" className="btn-gold">
              View Specialty Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="aa-grid">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '380px',
                  backgroundColor: '#202020',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(248, 245, 239, 0.08)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="aa-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

        {/* View Full Menu CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/menu" className="btn-outline-gold">
            Explore Complete Menu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
