"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Filter, Calendar, RefreshCw, Car } from "lucide-react";
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
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10 h-11 bg-slate-50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-amber-500 rounded-xl"
              placeholder="Search bookings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="h-11 w-48 bg-slate-50 border-slate-200 rounded-xl font-medium text-slate-700">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 rounded-xl">
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
            className="h-11 w-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button 
            onClick={openNew} 
            className="gap-2 h-11 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md shadow-amber-600/20"
          >
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-slate-100 hover:bg-slate-50/80">
              <TableHead className="w-16 text-slate-600 text-xs font-bold uppercase tracking-wider pl-6">ID</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Customer / Driver</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Vehicle Assigned</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Scheduled Date</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-slate-600 text-xs font-bold uppercase tracking-wider pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-100">
                  {Array.from({ length: 6 }).map((__, j) => <TableCell key={j} className="py-4"><Skeleton className="h-6 w-full rounded-md" /></TableCell>)}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow className="border-slate-100">
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                  <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
                  {search || vehicleFilter !== "all" ? "No matching reservations found." : "No bookings scheduled yet."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => {
                const displayName = b.customer?.fullName ?? b.customerId;
                const pal = palette(displayName);
                return (
                  <TableRow key={b.id} className="border-slate-100 hover:bg-amber-50/30 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs font-bold text-amber-700">
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
                          <p className="font-semibold text-slate-900 text-sm">{displayName}</p>
                          <span className="text-xs font-mono text-slate-400">ID: {b.customerId}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono text-xs hover:bg-emerald-100">
                        {b.vehicleId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatDate(b.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                        Confirmed
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50" 
                          onClick={() => openEdit(b)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50" 
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
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
          <span>Active reservations: <strong>{filtered.length}</strong></span>
          <span>Spring Cloud Gateway /api/v1/bookings</span>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-md bg-white rounded-2xl border-slate-200 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-lg font-bold">
              {editTarget ? "Edit Booking Dispatch" : "Schedule New Booking"}
            </DialogTitle>
          </DialogHeader>
          <BookingForm booking={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="bg-white rounded-2xl border-rose-200 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700 font-bold">Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to cancel booking <strong className="text-slate-900">#{deleteTarget?.id}</strong> for <strong className="text-slate-900">{deleteTarget?.customer?.fullName ?? deleteTarget?.customerId}</strong> (Vehicle: {deleteTarget?.vehicleId})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200">Keep</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
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
    <Suspense fallback={<div className="p-10 text-center text-sm text-slate-400">Loading booking schedule...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
