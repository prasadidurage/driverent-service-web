"use client";

import React, { useState, useEffect } from "react";
import { 
  bookingService, 
  customerService, 
  vehicleService, 
  Booking, 
  Customer, 
  Vehicle, 
  BookingFormData 
} from "@/services";
import { toast } from "sonner";
import { Calendar, RefreshCw, Plus, Trash2, Car, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<BookingFormData>({
    customerId: "",
    vehicleId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [bookingsData, customersData, vehiclesData] = await Promise.all([
        bookingService.getAll(),
        customerService.getAll(),
        vehicleService.getAll(),
      ]);
      setBookings(bookingsData);
      setCustomers(customersData);
      setVehicles(vehiclesData);
    } catch (err: any) {
      const msg = err?.message || "Failed to connect to Spring Cloud API Gateway (http://localhost:7000)";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId || !form.vehicleId || !form.date) {
      toast.error("Please select customer, vehicle, and date.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const newBooking = await bookingService.create(form);
      toast.success("Reservation confirmed via Gateway!");
      setBookings((prev) => [newBooking, ...prev]);
      setForm({
        customerId: "",
        vehicleId: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchData();
    } catch (err: any) {
      const msg = err?.message || "Failed to create booking";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id?: number) => {
    if (!id) return;
    try {
      await bookingService.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success(`Booking #${id} cancelled.`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rose-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
            <Flame className="h-6 w-6 text-rose-600" /> Rental Dispatch Console
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gateway Endpoint: <code className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">http://localhost:7000</code>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="rounded-2xl text-xs gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-bold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Gateway Data
        </Button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <span>⚠️</span> <span>{errorMessage}</span>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleCreateBooking} className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Schedule New Rental Dispatch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Customer / Driver *</label>
            <select
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full h-11 px-3 border border-rose-200 rounded-2xl bg-rose-50/40 text-sm focus:ring-2 focus:ring-rose-500"
              disabled={loading}
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.fullName} ({c.customerId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Assigned Vehicle *</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="w-full h-11 px-3 border border-rose-200 rounded-2xl bg-rose-50/40 text-sm focus:ring-2 focus:ring-rose-500"
              disabled={loading}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.name} (${v.dailyRate}/day)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Reservation Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full h-11 px-3 border border-rose-200 rounded-2xl bg-rose-50/40 text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting || loading}
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-11 px-6 text-xs font-bold shadow-md shadow-rose-600/25"
        >
          <Plus className="mr-1.5 h-4 w-4" /> {submitting ? "Processing..." : "Confirm Reservation"}
        </Button>
      </form>

      {/* Bookings Table */}
      <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-rose-50/60 border-b border-rose-100 text-zinc-700 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-6">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-400 text-sm">Loading records from Gateway...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-400 text-sm">No bookings scheduled yet.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id ?? `${b.customerId}-${b.vehicleId}`} className="hover:bg-rose-50/30 transition-colors">
                  <td className="p-4 pl-6 font-mono text-xs font-black text-rose-600">#{b.id}</td>
                  <td className="p-4 font-bold text-zinc-900">{b.customer?.fullName || b.customerId}</td>
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg">
                      {b.vehicleId}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-600 text-xs font-medium">{b.date}</td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
