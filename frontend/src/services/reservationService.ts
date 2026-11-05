import { apiClient } from './api';
import { Reservation } from '../types';

export interface CreateReservationPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  special_requests?: string;
}

export const reservationService = {
  async createReservation(payload: CreateReservationPayload): Promise<Reservation> {
    return apiClient<Reservation>('/reservations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getReservationByReference(reference: string): Promise<Reservation> {
    return apiClient<Reservation>(`/reservations/${reference}/`);
  },

  async cancelReservation(reference: string): Promise<Reservation> {
    return apiClient<Reservation>(`/reservations/${reference}/cancel/`, {
      method: 'POST',
    });
  },
};
