import { apiClient } from "@/lib/apiClient";
import type { Vehicle, VehicleFormData } from "@/types";

export const vehicleService = {
  // GET /api/v1/vehicles - Fetch all vehicles
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await apiClient.get<Vehicle[]>("/api/v1/vehicles");
    return data;
  },

  // GET /api/v1/vehicles/{id} - Fetch vehicle by ID
  getById: async (vehicleId: string): Promise<Vehicle> => {
    const { data } = await apiClient.get<Vehicle>(`/api/v1/vehicles/${vehicleId}`);
    return data;
  },

  // POST /api/v1/vehicles - Add new vehicle
  create: async (body: VehicleFormData): Promise<Vehicle> => {
    const { data } = await apiClient.post<Vehicle>("/api/v1/vehicles", body);
    return data;
  },

  // PUT /api/v1/vehicles/{id} - Update vehicle details
  update: async (vehicleId: string, body: VehicleFormData): Promise<Vehicle> => {
    const { data } = await apiClient.put<Vehicle>(`/api/v1/vehicles/${vehicleId}`, body);
    return data;
  },

  // DELETE /api/v1/vehicles/{id} - Remove vehicle
  delete: async (vehicleId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/vehicles/${vehicleId}`);
  },
};
