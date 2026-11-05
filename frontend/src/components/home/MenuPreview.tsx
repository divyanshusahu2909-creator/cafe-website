import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowRight } from 'lucide-react';
import { Category, Product } from '../../types';
import { menuService } from '../../services/menuService';
import { ProductCard } from '../menu/ProductCard';

export const MenuPreview: React.FC<{ onSelectProduct?: (product: Product) => void }> = ({
  onSelectProduct,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuService
      .getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategorySlug(cats[0].slug);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  useEffect(() => {
    if (!activeCategorySlug) return;
    setLoading(true);
    menuService
      .getProducts({ category: activeCategorySlug })
      .then((res) => setProducts(res.results))
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, [activeCategorySlug]);

  return (
    <section id="menu" className="aa-section" style={{ backgroundColor: '#111111' }}>
      <div className="aa-container">
        <div className="aa-section-head">
          <span className="aa-eyebrow">
            <Utensils size={16} />
            Pure Vegetarian Gastronomy
          </span>

          <h2 className="aa-title gold-gradient-text">Artisan Food &amp; Beverage Menu</h2>
          <p className="aa-lede">
            Explore handcrafted single-origin espresso, delicate Kyoto cold drips, stone-baked sourdough pizzas, and gourmet eggless patisserie.
          </p>
        </div>

        {/* Category Pills Navigation with Horizontal Scroll */}
        <div
          className="aa-scroll-x no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.65rem',
            paddingBottom: '1rem',
            marginBottom: '2.5rem',
            overflowX: 'auto',
          }}
        >
          {categories.map((cat) => {
            const active = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className="aa-chip"
                aria-selected={active}
                style={{
                  padding: '0.65rem 1.35rem',
                  fontSize: '0.86rem',
                  fontWeight: active ? 600 : 500,
                  borderRadius: 'var(--radius-btn)',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="aa-grid">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '370px',
                  backgroundColor: '#1E1E1E',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(248, 245, 239, 0.08)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="aa-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

        {/* Complete Menu Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/menu" className="btn-gold">
            Browse Full Menu &amp; Order Online <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
