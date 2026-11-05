import { apiClient } from './api';
import { GalleryImage } from '../types';

export const galleryService = {
  async getGalleryImages(): Promise<GalleryImage[]> {
    return apiClient<GalleryImage[]>('/gallery/');
  },
};
