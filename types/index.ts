// Customer types
export interface Customer {
  customerId: string;
  fullName: string;
  nicOrPassport: string;
  mobile: string;
  email?: string;
  licenseImageUrl?: string;
}

export interface CustomerFormData {
  customerId: string;
  fullName: string;
  nicOrPassport: string;
  mobile: string;
  email?: string;
  licenseImage?: File | null;
}

// Vehicle types
export interface Vehicle {
  vehicleId: string;
  name: string;
  dailyRate: number;
}

export interface VehicleFormData {
  vehicleId: string;
  name: string;
  dailyRate: number;
}

// Booking types
export interface CustomerSummary {
  fullName: string;
  nicOrPassport: string;
  mobile: string;
  email?: string;
  licenseImageUrl?: string;
}

export interface Booking {
  id?: number;
  date: string;
  customerId: string;
  vehicleId: string;
  customer?: CustomerSummary;
}

export interface BookingFormData {
  date: string;
  customerId: string;
  vehicleId: string;
}

// API response wrapper
export interface ApiError {
  message: string;
  status?: number;
}

