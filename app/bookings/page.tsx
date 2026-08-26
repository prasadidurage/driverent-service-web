"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Filter, Calendar, RefreshCw, Car, Flame } from "lucide-react";
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
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-red-100", text: "text-red-700" },
  { bg: "bg-zinc-100", text: "text-zinc-800" },
  { bg: "bg-rose-50", text: "text-rose-600" },
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
      toast.error("Failed to load bookings from Gateway");
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
      toast.success("Booking cancelled");
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Filter & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              className="pl-10 h-11 bg-rose-50/40 border-rose-200/80 placeholder:text-zinc-400 focus-visible:ring-rose-500 rounded-2xl text-sm"
              placeholder="Search reservations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="h-11 w-48 bg-rose-50/40 border-rose-200/80 rounded-2xl font-bold text-zinc-700 text-xs">
                <SelectValue placeholder="All Fleet Vehicles" />
              </SelectTrigger>
              <SelectContent className="bg-white border-rose-100 rounded-2xl">
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

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchData} 
            disabled={loading}
            className="h-11 w-11 rounded-2xl border-rose-200 text-rose-700 hover:bg-rose-50 shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button 
            onClick={openNew} 
            className="gap-2 h-11 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/25"
          >
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl border border-rose-100 bg-white shadow-xs overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400" />
        <Table>
          <TableHeader>
            <TableRow className="bg-rose-50/50 border-rose-100 hover:bg-rose-50/50">
              <TableHead className="w-16 text-zinc-700 text-xs font-bold uppercase tracking-wider pl-6">ID</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Customer / Driver</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Vehicle Assigned</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Scheduled Date</TableHead>
              <TableHead className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Dispatch Status</TableHead>
              <TableHead className="text-right text-zinc-700 text-xs font-bold uppercase tracking-wider pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-rose-100">
                  {Array.from({ length: 6 }).map((__, j) => <TableCell key={j} className="py-4"><Skeleton className="h-6 w-full rounded-md" /></TableCell>)}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow className="border-rose-100">
                <TableCell colSpan={6} className="text-center py-16 text-zinc-400 text-sm">
                  <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30 text-rose-500" />
                  {search || vehicleFilter !== "all" ? "No matching reservations found." : "No bookings scheduled yet."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => {
                const displayName = b.customer?.fullName ?? b.customerId;
                const pal = palette(displayName);
                return (
                  <TableRow key={b.id} className="border-rose-100/60 hover:bg-rose-50/40 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs font-black text-rose-700">
                      #{b.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-white shadow-2xs">
                          <AvatarImage src={b.customer?.licenseImageUrl ?? customerApi.getLicenseImageUrl(b.customerId)} />
                          <AvatarFallback className={`${pal.bg} ${pal.text} text-xs font-bold`}>
                            {initials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">{displayName}</p>
                          <span className="text-xs font-mono text-zinc-400">ID: {b.customerId}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg">
                        {b.vehicleId}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-zinc-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-rose-500" />
                        <span className="font-semibold text-zinc-800">{formatDate(b.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Confirmed
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl text-zinc-500 hover:text-amber-600 hover:bg-amber-50" 
                          onClick={() => openEdit(b)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50" 
                          onClick={() => { setDeleteTarget(b); setDeleteOpen(true); }}
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
          <span>Active reservations: <strong>{filtered.length}</strong></span>
          <span className="font-mono text-rose-600">/api/v1/bookings</span>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-rose-100 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              {editTarget ? "Edit Booking Dispatch" : "Schedule New Booking"}
            </DialogTitle>
          </DialogHeader>
          <BookingForm booking={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="bg-white rounded-3xl border-rose-200 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700 font-bold">Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600">
              Are you sure you want to cancel booking <strong className="text-zinc-900">#{deleteTarget?.id}</strong> for <strong className="text-zinc-900">{deleteTarget?.customer?.fullName ?? deleteTarget?.customerId}</strong> (Vehicle: {deleteTarget?.vehicleId})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-2xl border-zinc-200">Keep</AlertDialogCancel>
            <AlertDialogAction className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-zinc-400">Loading booking schedule...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
