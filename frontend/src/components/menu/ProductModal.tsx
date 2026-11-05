import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../../types';
import { VegBadge, FeaturedBadge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const unitPrice = parseFloat(product.effective_price || product.price);
  const total = (unitPrice * quantity).toFixed(2);

  return (
    <div className="aa-scrim animate-fade-in" onClick={onClose}>
      <div
        className="aa-modal aa-modal--flush"
        style={{ position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="aa-icon-btn"
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}
        >
          <X size={20} />
        </button>

        {/* Modal Image */}
        <div style={{ height: 'clamp(190px, 34vw, 260px)', width: '100%', position: 'relative' }}>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="aa-card__img"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <VegBadge size="md" />
            {product.is_featured && <FeaturedBadge />}
          </div>
        </div>

        {/* Modal Details */}
        <div style={{ padding: 'clamp(1.25rem, 4vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span className="aa-eyebrow">{product.category_name}</span>
            <h3
              className="font-serif"
              style={{ fontSize: '1.45rem', color: 'var(--text-ivory)', margin: '0.2rem 0 0.5rem' }}
            >
              {product.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>
          </div>

          {product.preparation_time_minutes && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
              }}
            >
              <Clock size={15} color="var(--gold-accent)" />
              <span>Estimated preparation time: {product.preparation_time_minutes} minutes</span>
            </div>
          )}

          {/* Quantity and Add to Cart Action */}
          <div
            className="aa-row"
            style={{
              justifyContent: 'space-between',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-hairline)',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Stepper */}
            <div className="aa-stepper">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="aa-stepper__value">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Total & Submit Button */}
            <button
              onClick={handleAddToCart}
              className={`btn-gold${added ? ' btn-gold--added' : ''}`}
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Bag
                </>
              ) : (
                `Add to Bag • ₹${total}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
