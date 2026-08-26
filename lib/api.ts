import axios from "axios";
import type {
  Customer,
  CustomerFormData,
  Vehicle,
  VehicleFormData,
  Booking,
  BookingFormData,
} from "@/types";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

const api = axios.create({
  baseURL: API_GATEWAY,
  headers: { "Content-Type": "application/json" },
});

// ─── Customer API ──────────────────────────────────────────────────────────────

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await api.get("/api/v1/customers");
    return data;
  },

  getById: async (customerId: string): Promise<Customer> => {
    const { data } = await api.get(`/api/v1/customers/${customerId}`);
    return data;
  },

  create: async (formData: CustomerFormData): Promise<Customer> => {
    const form = new FormData();
    form.append("customerId", formData.customerId);
    form.append("fullName", formData.fullName);
    form.append("nicOrPassport", formData.nicOrPassport);
    form.append("mobile", formData.mobile);
    if (formData.email) form.append("email", formData.email);
    if (formData.licenseImage) form.append("licenseImage", formData.licenseImage);

    const { data } = await api.post("/api/v1/customers", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (customerId: string, formData: CustomerFormData): Promise<Customer> => {
    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("nicOrPassport", formData.nicOrPassport);
    form.append("mobile", formData.mobile);
    if (formData.email) form.append("email", formData.email);
    if (formData.licenseImage) form.append("licenseImage", formData.licenseImage);

    const { data } = await api.put(`/api/v1/customers/${customerId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (customerId: string): Promise<void> => {
    await api.delete(`/api/v1/customers/${customerId}`);
  },

  getLicenseImageUrl: (customerId: string): string =>
    `${API_GATEWAY}/api/v1/customers/${customerId}/license-image`,
};

// ─── Vehicle API ──────────────────────────────────────────────────────────────

export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await api.get("/api/v1/vehicles");
    return data;
  },

  getById: async (vehicleId: string): Promise<Vehicle> => {
    const { data } = await api.get(`/api/v1/vehicles/${vehicleId}`);
    return data;
  },

  create: async (body: VehicleFormData): Promise<Vehicle> => {
    const { data } = await api.post("/api/v1/vehicles", body);
    return data;
  },

  update: async (vehicleId: string, body: VehicleFormData): Promise<Vehicle> => {
    const { data } = await api.put(`/api/v1/vehicles/${vehicleId}`, body);
    return data;
  },

  delete: async (vehicleId: string): Promise<void> => {
    await api.delete(`/api/v1/vehicles/${vehicleId}`);
  },
};

// ─── Booking API ──────────────────────────────────────────────────────────────

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await api.get("/api/v1/bookings");
    return data;
  },

  getById: async (id: number): Promise<Booking> => {
    const { data } = await api.get(`/api/v1/bookings/${id}`);
    return data;
  },

  getByVehicle: async (vehicleId: string): Promise<Booking[]> => {
    const { data } = await api.get("/api/v1/bookings", {
      params: { vehicleId },
    });
    return data;
  },

  create: async (body: BookingFormData): Promise<Booking> => {
    const { data } = await api.post("/api/v1/bookings", body);
    return data;
  },

  update: async (id: number, body: BookingFormData): Promise<Booking> => {
    const { data } = await api.put(`/api/v1/bookings/${id}`, body);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/bookings/${id}`);
  },
};

