"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { customerApi, vehicleApi } from "@/lib/api";
import type { Customer, Vehicle, Booking } from "@/types";

const schema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  date: z.string().min(1, "Date is required"),
});

export type BookingFormValues = z.infer<typeof schema>;

interface Props {
  booking?: Booking;
  onSubmit: (values: BookingFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function BookingForm({ booking, onSubmit, onCancel, loading }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([customerApi.getAll(), vehicleApi.getAll()])
      .then(([c, v]) => {
        setCustomers(c);
        setVehicles(v);
      })
      .finally(() => setFetching(false));
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: booking?.customerId ?? "",
      vehicleId: booking?.vehicleId ?? "",
      date: booking?.date ?? new Date().toISOString().split("T")[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-zinc-700">Customer / Driver *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={fetching}
              >
                <FormControl>
                  <SelectTrigger className="h-11 rounded-2xl bg-white border-rose-200/80 text-sm">
                    <SelectValue placeholder={fetching ? "Loading customers…" : "Select a registered customer"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border-rose-100 rounded-2xl">
                  {customers.map((c) => (
                    <SelectItem key={c.customerId} value={c.customerId}>
                      {c.fullName}{" "}
                      <span className="text-zinc-400 text-xs">({c.customerId})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-zinc-700">Assigned Fleet Vehicle *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={fetching}
              >
                <FormControl>
                  <SelectTrigger className="h-11 rounded-2xl bg-white border-rose-200/80 text-sm">
                    <SelectValue placeholder={fetching ? "Loading fleet…" : "Select an available vehicle"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border-rose-100 rounded-2xl">
                  {vehicles.map((v) => (
                    <SelectItem key={v.vehicleId} value={v.vehicleId}>
                      {v.name} <span className="text-zinc-400 text-xs font-mono">({v.vehicleId} - ${v.dailyRate}/day)</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold text-zinc-700">Reservation Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-11 rounded-2xl bg-white border-rose-200/80 text-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="rounded-2xl h-11 px-4 border-zinc-200">
            Cancel
          </Button>
          <Button type="submit" disabled={loading || fetching} className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-11 px-6 font-bold shadow-md shadow-rose-600/25">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {booking ? "Update Booking" : "Confirm Reservation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
