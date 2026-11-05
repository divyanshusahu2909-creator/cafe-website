import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { BrandStory } from '../components/home/BrandStory';
import { SignatureCoffee } from '../components/home/SignatureCoffee';
import { MenuPreview } from '../components/home/MenuPreview';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { ReservationCTA } from '../components/home/ReservationCTA';
import { LocationSection } from '../components/home/LocationSection';
import { ProductModal } from '../components/menu/ProductModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main>
      <Hero />
      <BrandStory />
      <SignatureCoffee onSelectProduct={setSelectedProduct} />
      <MenuPreview onSelectProduct={setSelectedProduct} />
      <ExperienceSection />
      <GalleryPreview />
      <ReviewsSection />
      <ReservationCTA />
      <LocationSection />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
};
