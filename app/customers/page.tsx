"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
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
  { bg: "bg-sky-100",     text: "text-sky-700"     },
  { bg: "bg-violet-100",  text: "text-violet-700"  },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100",   text: "text-amber-700"   },
  { bg: "bg-rose-100",    text: "text-rose-700"    },
  { bg: "bg-indigo-100",  text: "text-indigo-700"  },
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
      toast.error("Failed to load customers");
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
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400" />
            <Input
              className="pl-9 bg-white/80 border-sky-200 placeholder:text-sky-300 focus-visible:ring-sky-300 focus-visible:border-sky-400"
              placeholder="Search name, ID, NIC/Passport or mobile…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={openNew} className="gap-2 shrink-0 bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-200">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-sky-200 bg-white/80 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-cyan-400" />
          <Table>
            <TableHeader>
              <TableRow className="bg-sky-50 border-sky-100 hover:bg-sky-50">
                <TableHead className="w-12 text-sky-600 text-xs"></TableHead>
                <TableHead className="text-sky-600 text-xs font-semibold uppercase tracking-wide">Customer</TableHead>
                <TableHead className="text-sky-600 text-xs font-semibold uppercase tracking-wide">Customer ID</TableHead>
                <TableHead className="text-sky-600 text-xs font-semibold uppercase tracking-wide">NIC / Passport</TableHead>
                <TableHead className="text-sky-600 text-xs font-semibold uppercase tracking-wide">Mobile</TableHead>
                <TableHead className="text-sky-600 text-xs font-semibold uppercase tracking-wide">Email</TableHead>
                <TableHead className="text-right text-sky-600 text-xs font-semibold uppercase tracking-wide">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-sky-100">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow className="border-sky-100">
                  <TableCell colSpan={7} className="text-center py-12 text-sky-400 text-sm">
                    {search ? "No matching customers found" : "No customers registered yet. Add one!"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => {
                  const pal = palette(customer.fullName);
                  return (
                    <TableRow key={customer.customerId} className="border-sky-100 hover:bg-sky-50/60 transition-colors">
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={
                              customer.licenseImageUrl ??
                              customerApi.getLicenseImageUrl(customer.customerId)
                            }
                            alt={customer.fullName}
                          />
                          <AvatarFallback className={`${pal.bg} ${pal.text} text-xs font-semibold`}>
                            {initials(customer.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground text-sm">{customer.fullName}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className="font-mono text-[11px] bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100">
                          {customer.customerId}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-foreground/80">{customer.nicOrPassport}</TableCell>
                      <TableCell className="text-sm text-foreground/80">{customer.mobile}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{customer.email ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-sky-400 hover:text-sky-600 hover:bg-sky-100" onClick={() => setViewTarget(customer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-400 hover:text-amber-600 hover:bg-amber-100" onClick={() => openEdit(customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-100" onClick={() => { setDeleteTarget(customer); setDeleteOpen(true); }}>
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
        </div>
        <p className="text-xs text-sky-500">{filtered.length} customer{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-lg bg-white border-sky-200">
          <DialogHeader>
            <DialogTitle className="text-sky-900">{editTarget ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          </DialogHeader>
          <CustomerForm customer={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-w-sm bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200">
          <DialogHeader>
            <DialogTitle className="text-sky-900">Customer Details</DialogTitle>
          </DialogHeader>
          {viewTarget && (() => {
            const pal = palette(viewTarget.fullName);
            return (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 pt-1">
                  <Avatar className="h-20 w-20 ring-2 ring-sky-200">
                    <AvatarImage
                      src={
                        viewTarget.licenseImageUrl ??
                        customerApi.getLicenseImageUrl(viewTarget.customerId)
                      }
                      alt={viewTarget.fullName}
                    />
                    <AvatarFallback className={`${pal.bg} ${pal.text} text-xl font-semibold`}>
                      {initials(viewTarget.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-foreground">{viewTarget.fullName}</h3>
                    <Badge className="font-mono text-[10px] mt-1 bg-sky-100 text-sky-700 border-sky-200">{viewTarget.customerId}</Badge>
                  </div>
                </div>
                <div className="rounded-xl border border-sky-200 overflow-hidden">
                  {[
                    { label: "NIC / Passport", value: viewTarget.nicOrPassport },
                    { label: "Mobile", value: viewTarget.mobile },
                    { label: "Email", value: viewTarget.email ?? "—" },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label} className={`flex justify-between items-start px-4 py-3 bg-white/70 ${i < arr.length - 1 ? "border-b border-sky-100" : ""}`}>
                      <span className="text-xs text-sky-500 w-28 flex-shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm font-medium text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" className="flex-1 h-10 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" onClick={() => { setViewTarget(null); openEdit(viewTarget); }}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button className="flex-1 h-10 bg-rose-500 hover:bg-rose-600 text-white" onClick={() => { setDeleteTarget(viewTarget); setDeleteOpen(true); setViewTarget(null); }}>
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
        <AlertDialogContent className="bg-white border-rose-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700">Delete Customer</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete customer <strong className="text-foreground">{deleteTarget?.fullName}</strong> ({deleteTarget?.customerId})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-500 hover:bg-rose-600 text-white" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">Loading customers...</div>}>
      <CustomersContent />
    </Suspense>
  );
}
