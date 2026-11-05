import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { GalleryImage } from '../types';
import { galleryService } from '../services/galleryService';
import { Lightbox } from '../components/ui/Lightbox';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryService
      .getGalleryImages()
      .then((data) => setImages(data))
      .catch((err) => console.error('Failed to load gallery:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 'var(--gutter)', paddingBottom: 'var(--section-y)', minHeight: '100vh' }}>
      <div className="aa-container">
        <div className="aa-section-head" style={{ marginTop: 'clamp(4rem, 10vh, 6rem)' }}>
          <span className="aa-eyebrow">Atmosphere &amp; Architecture</span>
          <h1 className="aa-title gold-gradient-text">The Aesthetic Gallery</h1>
          <p className="aa-lede">
            A curated visual story of our espresso bar, sunlit courtyard patio, handcrafted sourdough
            creations, and serene Indore sanctuary.
          </p>
        </div>

        {loading ? (
          <div className="aa-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aa-skeleton" style={{ height: 'clamp(240px, 30vw, 320px)' }} />
            ))}
          </div>
        ) : (
          <div className="aa-grid">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="aa-tile"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedImage(img);
                }}
                style={{ height: 'clamp(240px, 30vw, 320px)' }}
              >
                <img src={img.image} alt={img.alt_text} className="aa-tile__img" loading="lazy" />
                <div className="aa-tile__veil">
                  <div
                    style={{
                      alignSelf: 'center',
                      backgroundColor: 'var(--gold-accent)',
                      color: 'var(--deep-black)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <Eye size={22} />
                  </div>
                  <h3
                    className="font-serif aa-tile__title"
                    style={{ textAlign: 'center', margin: 0 }}
                  >
                    {img.caption}
                  </h3>
                  <p
                    className="aa-tile__meta"
                    style={{ textAlign: 'center', margin: 0, color: 'var(--gold-accent)' }}
                  >
                    Click to view high-resolution
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <Lightbox
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.image}
          caption={selectedImage.caption}
          altText={selectedImage.alt_text}
        />
      )}
    </div>
  );
};
