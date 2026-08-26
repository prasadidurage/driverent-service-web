import { customerService } from "@/services/customerService";
import { vehicleService } from "@/services/vehicleService";
import { bookingService } from "@/services/bookingService";

// Re-export services and backward-compatible aliases
export const customerApi = customerService;
export const vehicleApi = vehicleService;
export const bookingApi = bookingService;

export { customerService, vehicleService, bookingService };
export * from "@/lib/apiClient";
