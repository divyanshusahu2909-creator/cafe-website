import { apiClient } from './api';
import { Review, GalleryImage, BusinessSettings } from '../types';

export const reviewService = {
  async getReviews(): Promise<Review[]> {
    return apiClient<Review[]>('/reviews/');
  },

  async submitReview(payload: { name: string; rating: number; review_text: string }): Promise<Review> {
    return apiClient<Review>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const galleryService = {
  async getGalleryImages(): Promise<GalleryImage[]> {
    return apiClient<GalleryImage[]>('/gallery/');
  },
};

export const businessService = {
  async getSettings(): Promise<BusinessSettings> {
    return apiClient<BusinessSettings>('/business-settings/');
  },
};
