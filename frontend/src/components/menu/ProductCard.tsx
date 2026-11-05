import React, { useState } from 'react';
import { Plus, Check, Clock } from 'lucide-react';
import { Product } from '../../types';
import { VegBadge, FeaturedBadge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasDiscount = product.discounted_price && parseFloat(product.discounted_price) > 0;

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="aa-card aa-card--hover"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onSelect ? 'pointer' : 'default',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div>
        {/* Product Image Header */}
        <div
          style={{
            position: 'relative',
            height: '220px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-elevated)',
          }}
        >
          <img
            src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="aa-card__img"
            loading="lazy"
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 40%)',
              pointerEvents: 'none',
            }}
          />

          {/* Badges Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              right: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <VegBadge size="md" />
            {product.is_featured && <FeaturedBadge />}
          </div>

          {/* Prep time badge */}
          {product.preparation_time_minutes && (
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-scrim)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-card)',
              }}
            >
              <Clock size={12} color="var(--gold-accent)" />
              <span>{product.preparation_time_minutes} mins</span>
            </div>
          )}
        </div>

        {/* Product Body */}
        <div style={{ padding: '1.25rem' }}>
          {product.category_name && (
            <p className="aa-eyebrow" style={{ marginBottom: '0.35rem' }}>
              {product.category_name}
            </p>
          )}

          <h3
            className="font-serif"
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-ivory)',
              margin: '0 0 0.5rem',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--text-dim)',
              lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>
        </div>
      </div>

      {/* Product Footer: Price & Add to Cart */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span
            className="font-serif"
            style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-hover)' }}
          >
            ₹{product.effective_price || product.price}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', textDecoration: 'line-through' }}>
              ₹{product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={`btn-gold${added ? ' btn-gold--added' : ''}`}
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
          title="Add to cart"
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? (
            <>
              <Check size={14} /> Added
            </>
          ) : (
            <>
              <Plus size={14} /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
};
