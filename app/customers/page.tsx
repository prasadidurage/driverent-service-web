"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Eye, Users, RefreshCw, Phone, Mail, IdCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { customerApi } from "@/lib/api";
import type { Customer } from "@/types";
import { CustomerForm } from "@/components/customers/customer-form";

const PALETTES = [
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-red-100", text: "text-red-700" },
  { bg: "bg-zinc-100", text: "text-zinc-800" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-orange-100", text: "text-orange-700" },
];

function palette(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return PALETTES[code % PALETTES.length];
}

function CustomersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [viewTarget, setViewTarget] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      setCustomers(await customerApi.getAll());
    } catch {
      toast.error("Failed to load customers from Gateway");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditTarget(undefined);
      setFormOpen(true);
    }
  }, [searchParams]);

  const filtered = customers.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerId.toLowerCase().includes(search.toLowerCase()) ||
    c.nicOrPassport.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  const openNew = () => { setEditTarget(undefined); setFormOpen(true); };
  const openEdit = (c: Customer) => { setEditTarget(c); setFormOpen(true); };
  const handleFormClose = () => { setFormOpen(false); router.replace("/customers"); };

  const handleFormSubmit = async (
    values: { customerId: string; fullName: string; nicOrPassport: string; mobile: string; email?: string },
    licenseImage?: File
  ) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await customerApi.update(editTarget.customerId, { ...values, licenseImage });
        toast.success("Customer updated successfully");
      } else {
        await customerApi.create({ ...values, licenseImage });
        toast.success("Customer created successfully");
      }
      handleFormClose();
      fetchCustomers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await customerApi.delete(deleteTarget.customerId);
      toast.success("Customer deleted");
      setDeleteOpen(false);
      fetchCustomers();
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-10 h-11 bg-rose-50/40 border-rose-200/80 placeholder:text-zinc-400 focus-visible:ring-rose-500 rounded-2xl text-sm"
            placeholder="Search by name, ID, NIC/Passport, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchCustomers} 
            disabled={loading}
            className="h-11 w-11 rounded-2xl border-rose-200 text-rose-700 hover:bg-rose-50 shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button 
            onClick={openNew} 
            className="gap-2 h-11 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/25"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-rose-100 bg-white shadow-xs overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400" />
        <Table>
          <TableHeader>
            <TableRow className="bg-rose-50/50 border-rose-100 hover:bg-rose-50/50">
              <TableHead className="w-14 text-zinc-500 text-xs font-bold uppercase tracking-wider pl-6"></TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Customer Name</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Customer ID</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">NIC / Passport</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Contact</TableHead>
              <TableHead className="text-right text-zinc-700 text-xs font-bold uppercase tracking-wider pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-rose-100">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j} className="py-4"><Skeleton className="h-6 w-full rounded-md" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow className="border-rose-100">
                <TableCell colSpan={6} className="text-center py-16 text-zinc-400 text-sm">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30 text-rose-500" />
                  {search ? "No matching customers found." : "No customers registered yet."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => {
                const pal = palette(customer.fullName);
                return (
                  <TableRow key={customer.customerId} className="border-rose-100/60 hover:bg-rose-50/40 transition-colors">
                    <TableCell className="pl-6">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-2xs">
                        <AvatarImage
                          src={customer.licenseImageUrl ?? customerApi.getLicenseImageUrl(customer.customerId)}
                          alt={customer.fullName}
                        />
                        <AvatarFallback className={`${pal.bg} ${pal.text} text-xs font-bold`}>
                          {initials(customer.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-zinc-900 text-sm">{customer.fullName}</p>
                      <p className="text-xs text-zinc-400">{customer.email ?? "No email provided"}</p>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg">
                        {customer.customerId}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-zinc-700">
                      {customer.nicOrPassport}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-medium">
                        <Phone className="h-3.5 w-3.5 text-rose-400" />
                        <span>{customer.mobile}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50" 
                          onClick={() => setViewTarget(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl text-zinc-500 hover:text-amber-600 hover:bg-amber-50" 
                          onClick={() => openEdit(customer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50" 
                          onClick={() => { setDeleteTarget(customer); setDeleteOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="px-6 py-3 border-t border-rose-100 bg-rose-50/30 flex justify-between items-center text-xs text-zinc-500">
          <span>Total records: <strong>{filtered.length}</strong></span>
          <span className="font-mono text-rose-600">/api/v1/customers</span>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-lg bg-white rounded-3xl border-rose-100 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              {editTarget ? "Edit Customer Record" : "Register New Customer"}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm customer={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-rose-100 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 text-lg font-bold">Driver Identity Details</DialogTitle>
          </DialogHeader>
          {viewTarget && (() => {
            const pal = palette(viewTarget.fullName);
            return (
              <div className="space-y-5 pt-2">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-20 w-20 ring-4 ring-rose-50 shadow-md">
                    <AvatarImage
                      src={viewTarget.licenseImageUrl ?? customerApi.getLicenseImageUrl(viewTarget.customerId)}
                      alt={viewTarget.fullName}
                    />
                    <AvatarFallback className={`${pal.bg} ${pal.text} text-xl font-bold`}>
                      {initials(viewTarget.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-base font-bold text-zinc-900">{viewTarget.fullName}</h3>
                    <span className="font-mono text-xs mt-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full inline-block">
                      ID: {viewTarget.customerId}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-100 overflow-hidden divide-y divide-rose-50 bg-rose-50/20">
                  {[
                    { label: "NIC / Passport", value: viewTarget.nicOrPassport, icon: IdCard },
                    { label: "Mobile Phone", value: viewTarget.mobile, icon: Phone },
                    { label: "Email Address", value: viewTarget.email ?? "—", icon: Mail },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex justify-between items-center px-4 py-3 bg-white">
                      <span className="text-xs text-zinc-500 flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-rose-500" /> {label}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 rounded-2xl border-rose-200 bg-rose-50/40 text-rose-700 hover:bg-rose-100 font-semibold" 
                    onClick={() => { setViewTarget(null); openEdit(viewTarget); }}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                  <Button 
                    className="flex-1 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-600/20" 
                    onClick={() => { setDeleteTarget(viewTarget); setDeleteOpen(true); setViewTarget(null); }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="bg-white rounded-3xl border-rose-200 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700 font-bold">Delete Customer Record</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600">
              Are you sure you want to remove customer <strong className="text-zinc-900">{deleteTarget?.fullName}</strong> ({deleteTarget?.customerId})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-2xl border-zinc-200">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-zinc-400">Loading customer registry...</div>}>
      <CustomersContent />
    </Suspense>
  );
}
