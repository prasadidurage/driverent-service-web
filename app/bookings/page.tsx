"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bookingApi, vehicleApi, customerApi } from "@/lib/api";
import type { Booking, Vehicle } from "@/types";
import { BookingForm, type BookingFormValues } from "@/components/bookings/booking-form";

const PALETTES = [
  { bg: "bg-amber-100",   text: "text-amber-700"   },
  { bg: "bg-sky-100",     text: "text-sky-700"     },
  { bg: "bg-violet-100",  text: "text-violet-700"  },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100",    text: "text-rose-700"    },
  { bg: "bg-indigo-100",  text: "text-indigo-700"  },
];

function palette(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return PALETTES[code % PALETTES.length];
}

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Booking | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bks, vehs] = await Promise.all([bookingApi.getAll(), vehicleApi.getAll()]);
      setBookings(bks);
      setVehicles(vehs);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditTarget(undefined);
      setFormOpen(true);
    }
  }, [searchParams]);

  const filtered = bookings.filter((b) => {
    const customerDisplayName = b.customer?.fullName ?? b.customerId;
    const matchesSearch =
      customerDisplayName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerId.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleId.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (vehicleFilter === "all" || b.vehicleId === vehicleFilter);
  });

  const openNew = () => { setEditTarget(undefined); setFormOpen(true); };
  const openEdit = (b: Booking) => { setEditTarget(b); setFormOpen(true); };
  const handleFormClose = () => { setFormOpen(false); router.replace("/bookings"); };

  const handleFormSubmit = async (values: BookingFormValues) => {
    setSubmitting(true);
    try {
      if (editTarget?.id) {
        await bookingApi.update(editTarget.id, values);
        toast.success("Booking updated successfully");
      } else {
        await bookingApi.create(values);
        toast.success("Booking created successfully");
      }
      handleFormClose();
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      await bookingApi.delete(deleteTarget.id);
      toast.success("Booking deleted");
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const formatDate = (d: string) => {
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return d;
    }
  };

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
              <Input
                className="pl-9 bg-white/80 border-amber-200 placeholder:text-amber-400 focus-visible:ring-amber-300 focus-visible:border-amber-400"
                placeholder="Search customer or vehicle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-amber-500 shrink-0" />
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-48 bg-white/80 border-amber-200 text-foreground">
                  <SelectValue placeholder="All Vehicles" />
                </SelectTrigger>
                <SelectContent className="bg-white border-amber-200">
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map((v) => (
                    <SelectItem key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleId} – {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={openNew} className="gap-2 shrink-0 bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200">
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-amber-600">
            <strong className="text-amber-800">{filtered.length}</strong> booking{filtered.length !== 1 ? "s" : ""}
          </span>
          {vehicleFilter !== "all" && (
            <Badge className="cursor-pointer bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200" onClick={() => setVehicleFilter("all")}>
              Vehicle: {vehicleFilter} ×
            </Badge>
          )}
        </div>

        <div className="rounded-xl border border-amber-200 bg-white/80 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-yellow-400" />
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50 border-amber-100 hover:bg-amber-50">
                <TableHead className="w-10 text-amber-700 text-xs font-semibold uppercase tracking-wide">#</TableHead>
                <TableHead className="text-amber-700 text-xs font-semibold uppercase tracking-wide">Customer</TableHead>
                <TableHead className="text-amber-700 text-xs font-semibold uppercase tracking-wide">Customer ID / NIC</TableHead>
                <TableHead className="text-amber-700 text-xs font-semibold uppercase tracking-wide">Vehicle</TableHead>
                <TableHead className="text-amber-700 text-xs font-semibold uppercase tracking-wide">Booking Date</TableHead>
                <TableHead className="text-right text-amber-700 text-xs font-semibold uppercase tracking-wide">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-amber-100">
                    {Array.from({ length: 6 }).map((__, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow className="border-amber-100">
                  <TableCell colSpan={6} className="text-center py-12 text-amber-500 text-sm">
                    {search || vehicleFilter !== "all" ? "No matching bookings found" : "No bookings created yet. Create one!"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => {
                  const displayName = b.customer?.fullName ?? b.customerId;
                  const pal = palette(displayName);
                  return (
                    <TableRow key={b.id} className="border-amber-100 hover:bg-amber-50/60 transition-colors">
                      <TableCell className="text-amber-600 text-xs font-mono">#{b.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={b.customer?.licenseImageUrl ?? customerApi.getLicenseImageUrl(b.customerId)} />
                            <AvatarFallback className={`${pal.bg} ${pal.text} text-xs font-semibold`}>
                              {initials(displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground text-sm">{displayName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="font-mono text-[11px] bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100">
                          {b.customer?.nicOrPassport ?? b.customerId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-mono">
                          {b.vehicleId}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/80">{formatDate(b.date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-700 hover:bg-amber-100" onClick={() => openEdit(b)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-100" onClick={() => { setDeleteTarget(b); setDeleteOpen(true); }}>
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
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-md bg-white border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">{editTarget ? "Edit Booking" : "New Booking"}</DialogTitle>
          </DialogHeader>
          <BookingForm booking={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="bg-white border-rose-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700">Delete Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete booking <strong className="text-foreground">#{deleteTarget?.id}</strong> for <strong className="text-foreground">{deleteTarget?.customer?.fullName ?? deleteTarget?.customerId}</strong> (Vehicle: {deleteTarget?.vehicleId})?
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

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">Loading bookings...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
