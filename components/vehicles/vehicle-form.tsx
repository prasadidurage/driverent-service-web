"use client";

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
import { Loader2 } from "lucide-react";
import type { Vehicle } from "@/types";

const schema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  name: z.string().min(1, "Vehicle name is required"),
  dailyRate: z.number().min(0, "Daily rate must be 0 or greater"),
});

export type VehicleFormValues = z.infer<typeof schema>;

interface Props {
  vehicle?: Vehicle;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function VehicleForm({ vehicle, onSubmit, onCancel, loading }: Props) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleId: vehicle?.vehicleId ?? "",
      name: vehicle?.name ?? "",
      dailyRate: vehicle?.dailyRate ?? 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle ID *</FormLabel>
              <FormControl>
                <Input
                  placeholder="VEH-001"
                  {...field}
                  disabled={!!vehicle}
                  className={vehicle ? "bg-slate-50 font-mono" : "font-mono"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Toyota Axio / Honda Grace"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dailyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Rate ($ / LKR) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  value={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {vehicle ? "Update Vehicle" : "Create Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
