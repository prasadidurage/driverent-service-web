"use client";

import { useEffect, useState } from "react";
import { Users, Car, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { customerApi, vehicleApi, bookingApi } from "@/lib/api";
import type { Vehicle, Booking } from "@/types";

interface Stats { customers: number; vehicles: number; bookings: number; }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [customers, vehs, bookings] = await Promise.all([
          customerApi.getAll(), vehicleApi.getAll(), bookingApi.getAll(),
        ]);
        setStats({ customers: customers.length, vehicles: vehs.length, bookings: bookings.length });
        setRecentBookings(bookings.slice(-5).reverse());
        setVehicles(vehs);
      } catch { } finally { setLoading(false); }
    }
    load();
  }, []);

  const statCards = [
    {
      label: "Total Customers", value: stats?.customers ?? 0, icon: Users, href: "/customers",
      topBar: "bg-gradient-to-r from-sky-400 to-cyan-400",
      iconWrap: "bg-sky-100 text-sky-600",
      numClass: "text-sky-700",
      cardBg: "bg-gradient-to-br from-sky-50 to-cyan-50/60 border-sky-200",
    },
    {
      label: "Total Vehicles", value: stats?.vehicles ?? 0, icon: Car, href: "/vehicles",
      topBar: "bg-gradient-to-r from-emerald-400 to-teal-400",
      iconWrap: "bg-emerald-100 text-emerald-600",
      numClass: "text-emerald-700",
      cardBg: "bg-gradient-to-br from-emerald-50 to-teal-50/60 border-emerald-200",
    },
    {
      label: "Total Bookings", value: stats?.bookings ?? 0, icon: Calendar, href: "/bookings",
      topBar: "bg-gradient-to-r from-amber-400 to-yellow-400",
      iconWrap: "bg-amber-100 text-amber-600",
      numClass: "text-amber-700",
      cardBg: "bg-gradient-to-br from-amber-50 to-yellow-50/60 border-amber-200",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, topBar, iconWrap, numClass, cardBg, href }) => (
          <Link key={label} href={href}>
            <div className={`rounded-xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all ${cardBg}`}>
              <div className={`h-1.5 w-full ${topBar}`} />
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-14 mt-1.5" />
                  ) : (
                    <p className={`text-3xl font-bold mt-1 ${numClass}`}>{value}</p>
                  )}
                </div>
                <div className={`rounded-xl p-3 ${iconWrap}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-amber-900">Recent Bookings</CardTitle>
            <Link href="/bookings">
              <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 gap-1 text-xs h-8">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 px-5 pb-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-lg" />)
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No bookings recorded yet</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-amber-200 bg-white/70 px-3 py-2.5 hover:bg-white transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.customer?.fullName ?? b.customerId}</p>
                    <p className="text-xs text-muted-foreground">Vehicle ID: {b.vehicleId}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="text-[10px] bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">#{b.id}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{b.date}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Vehicles Overview */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-emerald-900">Vehicles Overview</CardTitle>
            <Link href="/vehicles">
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 gap-1 text-xs h-8">
                Manage <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 px-5 pb-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-lg" />)
            ) : vehicles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No vehicles in fleet yet</p>
            ) : (
              vehicles.slice(0, 5).map((v) => (
                <div key={v.vehicleId} className="flex items-center justify-between rounded-lg border border-emerald-200 bg-white/70 px-3 py-2.5 hover:bg-white transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-emerald-700 font-semibold">${v.dailyRate.toFixed(2)} / day</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 font-mono text-[10px]">{v.vehicleId}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pt-4 px-5 pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href="/customers?action=new">
              <Button variant="outline" className="w-full justify-start gap-2.5 h-11 bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 transition-all">
                <Users className="h-4 w-4" /> Add New Customer
              </Button>
            </Link>
            <Link href="/vehicles?action=new">
              <Button variant="outline" className="w-full justify-start gap-2.5 h-11 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all">
                <Car className="h-4 w-4" /> Add New Vehicle
              </Button>
            </Link>
            <Link href="/bookings?action=new">
              <Button variant="outline" className="w-full justify-start gap-2.5 h-11 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all">
                <Calendar className="h-4 w-4" /> New Booking
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
