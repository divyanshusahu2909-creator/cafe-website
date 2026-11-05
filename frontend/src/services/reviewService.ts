import { apiClient } from './api';
import { Review } from '../types';

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
