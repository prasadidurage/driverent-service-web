import { apiClient } from "@/lib/apiClient";
import type { Booking, BookingFormData } from "@/types";

export const bookingService = {
  // GET /api/v1/bookings - Fetch all bookings
  getAll: async (vehicleId?: string): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>("/api/v1/bookings", {
      params: vehicleId ? { vehicleId } : undefined,
    });
    return data;
  },

  // GET /api/v1/bookings/{id} - Fetch booking details
  getById: async (id: number): Promise<Booking> => {
    const { data } = await apiClient.get<Booking>(`/api/v1/bookings/${id}`);
    return data;
  },

  // GET /api/v1/bookings?vehicleId={vehicleId} - Filter by vehicle
  getByVehicle: async (vehicleId: string): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>("/api/v1/bookings", {
      params: { vehicleId },
    });
    return data;
  },

  // POST /api/v1/bookings - Create a new booking
  create: async (body: BookingFormData): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>("/api/v1/bookings", body);
    return data;
  },

  // PUT /api/v1/bookings/{id} - Update booking status/details
  update: async (id: number, body: BookingFormData): Promise<Booking> => {
    const { data } = await apiClient.put<Booking>(`/api/v1/bookings/${id}`, body);
    return data;
  },

  // DELETE /api/v1/bookings/{id} - Cancel booking
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/bookings/${id}`);
  },
};
