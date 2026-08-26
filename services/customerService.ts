import { apiClient, API_GATEWAY_URL } from "@/lib/apiClient";
import type { Customer, CustomerFormData } from "@/types";

export const customerService = {
  // GET /api/v1/customers - Fetch all customers
  getAll: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get<Customer[]>("/api/v1/customers");
    return data;
  },

  // GET /api/v1/customers/{id} - Fetch customer by ID
  getById: async (customerId: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/api/v1/customers/${customerId}`);
    return data;
  },

  // POST /api/v1/customers - Register/Create a new customer (supports image)
  create: async (formData: CustomerFormData): Promise<Customer> => {
    const form = new FormData();
    form.append("customerId", formData.customerId);
    form.append("fullName", formData.fullName);
    form.append("nicOrPassport", formData.nicOrPassport);
    form.append("mobile", formData.mobile);
    if (formData.email) form.append("email", formData.email);
    if (formData.licenseImage) form.append("licenseImage", formData.licenseImage);

    const { data } = await apiClient.post<Customer>("/api/v1/customers", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  // PUT /api/v1/customers/{id} - Update customer details
  update: async (customerId: string, formData: CustomerFormData): Promise<Customer> => {
    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("nicOrPassport", formData.nicOrPassport);
    form.append("mobile", formData.mobile);
    if (formData.email) form.append("email", formData.email);
    if (formData.licenseImage) form.append("licenseImage", formData.licenseImage);

    const { data } = await apiClient.put<Customer>(`/api/v1/customers/${customerId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  // DELETE /api/v1/customers/{id} - Delete customer
  delete: async (customerId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/customers/${customerId}`);
  },

  // Helper URL for license image streaming
  getLicenseImageUrl: (customerId: string): string =>
    `${API_GATEWAY_URL}/api/v1/customers/${customerId}/license-image`,
};
