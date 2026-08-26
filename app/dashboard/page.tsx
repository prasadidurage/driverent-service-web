"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Car, 
  Calendar, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Activity, 
  Clock, 
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { customerApi, vehicleApi, bookingApi } from "@/lib/api";
import type { Vehicle, Booking } from "@/types";

interface Stats {
  customers: number;
  vehicles: number;
  bookings: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [customers, vehs, bookings] = await Promise.all([
        customerApi.getAll(),
        vehicleApi.getAll(),
        bookingApi.getAll(),
      ]);
      setStats({
        customers: customers.length,
        vehicles: vehs.length,
        bookings: bookings.length,
      });
      setRecentBookings(bookings.slice(-5).reverse());
      setVehicles(vehs);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const statCards = [
    {
      label: "Registered Customers",
      value: stats?.customers ?? 0,
      subtext: "Verified drivers & profiles",
      icon: Users,
      href: "/customers",
      gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
      accentBorder: "border-rose-200 hover:border-rose-500/50",
      iconBg: "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20",
      metricColor: "text-rose-950",
      tag: "Drivers Database",
      tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      label: "Fleet Inventory",
      value: stats?.vehicles ?? 0,
      subtext: "Active rental inventory",
      icon: Car,
      href: "/vehicles",
      gradient: "from-red-500/10 via-red-500/5 to-transparent",
      accentBorder: "border-red-200 hover:border-red-500/50",
      iconBg: "bg-red-500/10 text-red-600 ring-1 ring-red-500/20",
      metricColor: "text-red-950",
      tag: "Available Fleet",
      tagColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      label: "Total Reservations",
      value: stats?.bookings ?? 0,
      subtext: "Scheduled vehicle dispatches",
      icon: Calendar,
      href: "/bookings",
      gradient: "from-rose-600/10 via-orange-500/5 to-transparent",
      accentBorder: "border-rose-200 hover:border-rose-500/50",
      iconBg: "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20",
      metricColor: "text-rose-950",
      tag: "Active Dispatches",
      tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Signature Red Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d0709] via-[#1f090e] to-[#0d0709] p-6 sm:p-9 text-white shadow-2xl border border-rose-900/30">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-56 h-56 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-600/25 text-rose-300 border border-rose-500/40 backdrop-blur-sm shadow-xs">
                <Flame className="h-3.5 w-3.5 mr-1.5 text-rose-400" /> DriveRed Velocity Operations
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-rose-500 inline-block mr-2 shadow-[0_0_8px_#f43f5e] animate-pulse" />
                Live API Gateway (:7000)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Fleet Operations & Rental Dispatch
            </h2>
            <p className="text-sm text-zinc-300 max-w-2xl font-medium leading-relaxed">
              Enterprise Spring Cloud architecture coordinating real-time Customer records, Fleet inventory, and Booking services.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing || loading}
              className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-100 border-rose-500/30 backdrop-blur-sm h-11 px-5 rounded-2xl shadow-lg font-semibold"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin text-rose-400" : ""}`} />
              Sync Gateway
            </Button>
          </div>
        </div>
      </div>

      {/* Top 3 Interactive Metrics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <div
                className={`relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border ${card.accentBorder} transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60`} />
                <div className="relative flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${card.tagColor} shadow-2xs`}>
                      {card.tag}
                    </span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      {card.label}
                    </p>
                    {loading ? (
                      <Skeleton className="h-9 w-20 mt-1.5" />
                    ) : (
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className={`text-3xl sm:text-4xl font-black tracking-tight ${card.metricColor}`}>
                          {card.value}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-zinc-400 mt-1 font-medium">{card.subtext}</p>
                  </div>

                  <div className="pt-2 flex items-center text-xs font-bold text-rose-600 group-hover:text-rose-700 transition-colors">
                    <span>Manage records</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Recent Bookings & Fleet Showcase */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings Feed */}
        <Card className="rounded-3xl border-rose-100 bg-white/95 shadow-sm overflow-hidden backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-rose-50 px-6 py-5">
            <div>
              <CardTitle className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-600" /> Recent Booking Dispatches
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-0.5">
                Active rental timeline from Booking Service
              </CardDescription>
            </div>
            <Link href="/bookings">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))
            ) : recentBookings.length === 0 ? (
              <div className="py-10 text-center text-zinc-400">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40 text-rose-500" />
                <p className="text-sm font-semibold">No bookings registered yet.</p>
                <Link href="/bookings?action=new">
                  <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20">
                    Schedule First Booking
                  </Button>
                </Link>
              </div>
            ) : (
              recentBookings.map((b) => (
                <div
                  key={b.id ?? `${b.customerId}-${b.vehicleId}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-100/80 bg-rose-50/30 hover:bg-white hover:border-rose-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white font-black text-xs shadow-xs">
                      #{b.id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        {b.customer?.fullName ?? b.customerId}
                      </p>
                      <span className="text-[11px] text-zinc-500 font-mono">Vehicle: {b.vehicleId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-rose-700 border border-rose-200 font-mono shadow-2xs">
                      {b.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Fleet Inventory Snapshot */}
        <Card className="rounded-3xl border-rose-100 bg-white/95 shadow-sm overflow-hidden backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-rose-50 px-6 py-5">
            <div>
              <CardTitle className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Car className="h-4 w-4 text-rose-600" /> Active Fleet Inventory
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-0.5">
                Automotive vehicles via Vehicle Microservice
              </CardDescription>
            </div>
            <Link href="/vehicles">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl">
                Manage Fleet <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))
            ) : vehicles.length === 0 ? (
              <div className="py-10 text-center text-zinc-400">
                <Car className="h-8 w-8 mx-auto mb-2 opacity-40 text-rose-500" />
                <p className="text-sm font-semibold">No fleet vehicles recorded.</p>
                <Link href="/vehicles?action=new">
                  <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20">
                    Add Vehicle
                  </Button>
                </Link>
              </div>
            ) : (
              vehicles.slice(0, 5).map((v) => (
                <div
                  key={v.vehicleId}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-100/80 bg-rose-50/30 hover:bg-white hover:border-rose-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold text-xs">
                      <Car className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{v.name}</p>
                      <span className="font-mono text-[10px] font-bold text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
                        {v.vehicleId}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-rose-600">
                      ${v.dailyRate.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-medium">per day</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Dispatch Launchpad */}
      <Card className="rounded-3xl border-rose-100 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-600" /> Quick Operations Launchpad
            </h3>
            <p className="text-xs text-zinc-500">Fast action triggers for vehicle operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/customers?action=new">
            <div className="group flex items-center gap-3.5 p-4 rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50/60 to-white hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/25 group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">Register Customer</p>
                <p className="text-xs text-zinc-500">Driver identity & license</p>
              </div>
            </div>
          </Link>

          <Link href="/vehicles?action=new">
            <div className="group flex items-center gap-3.5 p-4 rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50/60 to-white hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">Add Fleet Vehicle</p>
                <p className="text-xs text-zinc-500">Inventory assets & rates</p>
              </div>
            </div>
          </Link>

          <Link href="/bookings?action=new">
            <div className="group flex items-center gap-3.5 p-4 rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50/60 to-white hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-700 to-rose-500 text-white shadow-md shadow-rose-700/25 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">Create Booking</p>
                <p className="text-xs text-zinc-500">Schedule rental date</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
