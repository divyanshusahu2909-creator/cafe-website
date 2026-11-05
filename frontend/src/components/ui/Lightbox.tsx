import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
  altText?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  caption,
  altText = 'Aesthetic Aroma Gallery Image',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="aa-scrim animate-fade-in"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <button
        onClick={onClose}
        className="aa-icon-btn"
        aria-label="Close image modal"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
      >
        <X size={22} />
      </button>

      <div
        className="aa-lightbox__figure"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="aa-lightbox__img"
        />
        {caption && <p className="aa-lightbox__caption">{caption}</p>}
      </div>
    </div>
  );
};
