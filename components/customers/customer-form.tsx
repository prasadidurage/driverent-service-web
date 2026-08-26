"use client";

import { useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import type { Customer } from "@/types";
import { customerApi } from "@/lib/api";

const schema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .regex(/^[a-zA-Z][a-zA-Z\s.]*$/, "Full name must contain letters and spaces only"),
  nicOrPassport: z.string().min(1, "NIC or Passport number is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  customer?: Customer;
  onSubmit: (values: FormValues, licenseImage?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function CustomerForm({ customer, onSubmit, onCancel, loading }: Props) {
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: customer?.customerId ?? "",
      fullName: customer?.fullName ?? "",
      nicOrPassport: customer?.nicOrPassport ?? "",
      mobile: customer?.mobile ?? "",
      email: customer?.email ?? "",
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLicenseImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values, licenseImage ?? undefined);
  };

  const initials = (customer?.fullName ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* License photo upload */}
        <div className="flex flex-col items-center gap-2.5 pb-2">
          <Avatar className="h-20 w-20 ring-4 ring-rose-50 shadow-md">
            <AvatarImage
              src={
                preview ??
                customer?.licenseImageUrl ??
                (customer ? customerApi.getLicenseImageUrl(customer.customerId) : undefined)
              }
            />
            <AvatarFallback className="bg-rose-100 text-rose-700 text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-2xl text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            {licenseImage ? "Change License Photo" : "Upload License Document"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="col-span-2 sm:col-span-1">
                <FormLabel className="text-xs font-bold text-zinc-700">Customer ID *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CUST-001"
                    {...field}
                    disabled={!!customer}
                    className={`h-11 rounded-2xl font-mono text-sm border-rose-200/80 ${customer ? "bg-rose-50/50" : "bg-white"}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="col-span-2 sm:col-span-1">
                <FormLabel className="text-xs font-bold text-zinc-700">Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="h-11 rounded-2xl bg-white border-rose-200/80 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nicOrPassport"
            render={({ field }) => (
              <FormItem className="col-span-2 sm:col-span-1">
                <FormLabel className="text-xs font-bold text-zinc-700">NIC / Passport *</FormLabel>
                <FormControl>
                  <Input placeholder="199012345678" {...field} className="h-11 rounded-2xl font-mono bg-white border-rose-200/80 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="col-span-2 sm:col-span-1">
                <FormLabel className="text-xs font-bold text-zinc-700">Mobile Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="0771234567" {...field} className="h-11 rounded-2xl bg-white border-rose-200/80 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs font-bold text-zinc-700">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} className="h-11 rounded-2xl bg-white border-rose-200/80 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="rounded-2xl h-11 px-4 border-zinc-200">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-11 px-6 font-bold shadow-md shadow-rose-600/25">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {customer ? "Update Record" : "Create Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
