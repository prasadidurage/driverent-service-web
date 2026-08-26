"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Car, RefreshCw, DollarSign } from "lucide-react";
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
      toast.error("Failed to load vehicles from Gateway");
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10 h-11 bg-slate-50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-emerald-500 rounded-xl"
            placeholder="Search by vehicle name or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchVehicles} 
            disabled={loading}
            className="h-11 w-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button 
            onClick={openNew} 
            className="gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-slate-100 hover:bg-slate-50/80">
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider pl-6">Vehicle ID</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Vehicle Model & Name</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Daily Rental Rate</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-slate-600 text-xs font-bold uppercase tracking-wider pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-100">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j} className="py-4"><Skeleton className="h-6 w-full rounded-md" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow className="border-slate-100">
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                  <Car className="h-10 w-10 mx-auto mb-2 opacity-30 text-emerald-500" />
                  {search ? "No matching vehicles found." : "No vehicles in inventory. Add your first vehicle!"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((v) => (
                <TableRow key={v.vehicleId} className="border-slate-100 hover:bg-emerald-50/40 transition-colors">
                  <TableCell className="pl-6">
                    <Badge variant="outline" className="font-mono text-xs bg-slate-50 text-slate-700 border-slate-200">
                      {v.vehicleId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs shrink-0">
                        <Car className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{v.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-bold text-emerald-600 text-sm">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span>{v.dailyRate.toFixed(2)}</span>
                      <span className="text-xs font-normal text-slate-400">/ day</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Ready for Dispatch
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50" 
                        onClick={() => openEdit(v)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50" 
                        onClick={() => { setDeleteTarget(v); setDeleteOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
          <span>Fleet count: <strong>{filtered.length}</strong></span>
          <span>Spring Cloud Gateway /api/v1/vehicles</span>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-md bg-white rounded-2xl border-slate-200 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-lg font-bold">
              {editTarget ? "Edit Vehicle Info" : "Add Vehicle to Fleet"}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm vehicle={editTarget} onSubmit={handleFormSubmit} onCancel={handleFormClose} loading={submitting} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent className="bg-white rounded-2xl border-rose-200 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-700 font-bold">Remove Vehicle from Fleet</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{deleteTarget?.name}</strong> ({deleteTarget?.vehicleId}) from the fleet?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
              Delete Vehicle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-slate-400">Loading vehicle fleet...</div>}>
      <VehiclesContent />
    </Suspense>
  );
}
