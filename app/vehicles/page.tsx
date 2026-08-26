"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { vehicleApi } from "@/lib/api";
import type { Vehicle } from "@/types";
import { VehicleForm, type VehicleFormValues } from "@/components/vehicles/vehicle-form";

function VehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Vehicle | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      setVehicles(await vehicleApi.getAll());
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditTarget(undefined);
      setFormOpen(true);
    }
  }, [searchParams]);

  const filtered = vehicles.filter(
    (v) =>
      v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditTarget(undefined); setFormOpen(true); };
  const openEdit = (v: Vehicle) => { setEditTarget(v); setFormOpen(true); };
  const handleFormClose = () => { setFormOpen(false); router.replace("/vehicles"); };

  const handleFormSubmit = async (values: VehicleFormValues) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await vehicleApi.update(editTarget.vehicleId, values);
        toast.success("Vehicle updated successfully");
      } else {
        await vehicleApi.create(values);
        toast.success("Vehicle created successfully");
      }
      handleFormClose();
      fetchVehicles();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await vehicleApi.delete(deleteTarget.vehicleId);
      toast.success("Vehicle deleted");
      setDeleteOpen(false);
      fetchVehicles();
    } catch {
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
            <Input
              className="pl-9 bg-white/80 border-emerald-200 placeholder:text-emerald-300 focus-visible:ring-emerald-300 focus-visible:border-emerald-400"
              placeholder="Search by ID or vehicle name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={openNew} className="gap-2 shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200">
            <Plus className="h-4 w-4" /> Add Vehicle
          </Button>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-white/80 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-400" />
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50 border-emerald-100 hover:bg-emerald-50">
                  <TableHead className="text-emerald-600 text-xs font-semibold uppercase tracking-wide">Vehicle ID</TableHead>
                  <TableHead className="text-emerald-600 text-xs font-semibold uppercase tracking-wide">Vehicle Name</TableHead>
                  <TableHead className="text-emerald-600 text-xs font-semibold uppercase tracking-wide">Daily Rate</TableHead>
                  <TableHead className="text-right text-emerald-600 text-xs font-semibold uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.vehicleId} className="border-emerald-100 hover:bg-emerald-50/60 transition-colors">
                    <TableCell>
                      <Badge className="font-mono text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                        {v.vehicleId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-xs shrink-0">
                          <Car className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-emerald-700">
                      ${v.dailyRate.toFixed(2)} / day
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-400 hover:text-amber-600 hover:bg-amber-100" onClick={() => openEdit(v)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-100" onClick={() => { setDeleteTarget(v); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-emerald-200 bg-white/80 p-4 space-y-3 shadow-sm">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-xl border border-emerald-200 bg-white/80 p-12 text-center text-emerald-400 text-sm shadow-sm">
            {search ? "No matching vehicles found" : "No vehicles in inventory yet. Add one!"}
          </div>
        )}

        <p className="text-xs text-emerald-500">{filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-md bg-white border-emerald-200">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">{editTarget ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          </DialogHeader>
          <VehicleForm vehicle={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="bg-white border-rose-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700">Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete vehicle <strong className="text-foreground">{deleteTarget?.name}</strong> ({deleteTarget?.vehicleId})?
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

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">Loading vehicles...</div>}>
      <VehiclesContent />
    </Suspense>
  );
}
