import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, Eye } from 'lucide-react';
import { GalleryImage } from '../../types';
import { galleryService } from '../../services/galleryService';
import { Lightbox } from '../ui/Lightbox';

export const GalleryPreview: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    galleryService
      .getGalleryImages()
      .then((data) => setImages(data))
      .catch((err) => console.error('Failed to load gallery:', err));
  }, []);

  return (
    <section id="gallery" className="aa-section" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="aa-container">
        <div className="aa-section-head">
          <span className="aa-eyebrow">
            <Camera size={16} />
            Atmosphere &amp; Visual Design
          </span>

          <h2 className="aa-title gold-gradient-text">A Glimpse into Aesthetic Aroma</h2>
          <p className="aa-lede">
            Step into our architectural lounge in Indore. An interplay of natural timbers, warm bronze hairlines, and meditative coffee craftsmanship.
          </p>
        </div>

        {/* Modern Asymmetric Editorial Image Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {images.slice(0, 6).map((img, idx) => {
            // Asymmetric layout accent: Make index 0 span 2 columns on wide screens
            const isFeatured = idx === 0;
            return (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="aa-tile"
                style={{
                  height: isFeatured ? 'clamp(320px, 35vw, 420px)' : 'clamp(240px, 25vw, 300px)',
                  gridColumn: isFeatured ? 'span 2' : 'span 1',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid rgba(198, 161, 91, 0.2)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                }}
              >
                <img
                  src={img.image}
                  alt={img.alt_text || 'Aesthetic Aroma'}
                  className="aa-tile__img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s ease',
                  }}
                />
                <div
                  className="aa-tile__veil"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(17, 17, 17, 0.92) 0%, rgba(17, 17, 17, 0.2) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem',
                    transition: 'opacity 0.35s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C6A15B', marginBottom: '0.3rem' }}>
                    <Eye size={18} />
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Inspect</span>
                  </div>
                  <p
                    className="font-serif"
                    style={{
                      color: '#F8F5EF',
                      fontSize: isFeatured ? '1.25rem' : '1.05rem',
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {img.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/gallery" className="btn-outline-gold">
            View Complete Atmosphere Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Lightbox inspection modal */}
      {selectedImage && (
        <Lightbox
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.image}
          caption={selectedImage.caption}
          altText={selectedImage.alt_text}
        />
      )}
    </section>
  );
};
