"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Car, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Activity, 
  Clock, 
  RefreshCw 
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
      gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
      accentBorder: "border-sky-500/20 hover:border-sky-500/40",
      iconBg: "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20",
      metricColor: "text-sky-900",
      tag: "Drivers DB",
      tagColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      label: "Fleet Inventory",
      value: stats?.vehicles ?? 0,
      subtext: "Active vehicles in fleet",
      icon: Car,
      href: "/vehicles",
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      accentBorder: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
      metricColor: "text-emerald-900",
      tag: "Available Fleet",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Total Reservations",
      value: stats?.bookings ?? 0,
      subtext: "Recorded rental dispatches",
      icon: Calendar,
      href: "/bookings",
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      accentBorder: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
      metricColor: "text-amber-900",
      tag: "Bookings Stream",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1 text-indigo-300" /> Enterprise Console
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
                Live Cloud Gateway
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Vehicle Rental Operations Center
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Spring Cloud microservices architecture managing distributed Customer, Vehicle inventory, and Booking resources in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing || loading}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm h-10 px-4 rounded-xl shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
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
                className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border ${card.accentBorder} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`} />
                <div className="relative flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${card.tagColor}`}>
                      {card.tag}
                    </span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {card.label}
                    </p>
                    {loading ? (
                      <Skeleton className="h-9 w-20 mt-1" />
                    ) : (
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className={`text-3xl font-extrabold tracking-tight ${card.metricColor}`}>
                          {card.value}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1 font-medium">{card.subtext}</p>
                  </div>

                  <div className="pt-2 flex items-center text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
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
        <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm overflow-hidden backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-4.5">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> Recent Booking Dispatches
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Latest transactions from Booking Microservice
              </CardDescription>
            </div>
            <Link href="/bookings">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))
            ) : recentBookings.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40 text-amber-500" />
                <p className="text-sm font-medium">No bookings logged yet.</p>
                <Link href="/bookings?action=new">
                  <Button size="sm" className="mt-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs">
                    Create First Booking
                  </Button>
                </Link>
              </div>
            ) : (
              recentBookings.map((b) => (
                <div
                  key={b.id ?? `${b.customerId}-${b.vehicleId}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold text-xs">
                      #{b.id}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {b.customer?.fullName ?? b.customerId}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-mono">Vehicle: {b.vehicleId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-mono text-[10px]">
                      {b.date}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Fleet Inventory Snapshot */}
        <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm overflow-hidden backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-4.5">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Car className="h-4 w-4 text-emerald-500" /> Active Fleet Inventory
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Managed assets via Vehicle Microservice
              </CardDescription>
            </div>
            <Link href="/vehicles">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
                Manage Fleet <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))
            ) : vehicles.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Car className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-500" />
                <p className="text-sm font-medium">No vehicles registered in fleet.</p>
                <Link href="/vehicles?action=new">
                  <Button size="sm" className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs">
                    Add Vehicle
                  </Button>
                </Link>
              </div>
            ) : (
              vehicles.slice(0, 5).map((v) => (
                <div
                  key={v.vehicleId}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
                      <Car className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                      <Badge variant="outline" className="font-mono text-[10px] text-slate-500 border-slate-200 bg-white">
                        {v.vehicleId}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">
                      ${v.dailyRate.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-slate-400">per day</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Operations Launchpad */}
      <Card className="rounded-2xl border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quick Dispatch Launchpad</h3>
            <p className="text-xs text-slate-500">Fast action triggers for vehicle operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/customers?action=new">
            <div className="group flex items-center gap-3.5 p-4 rounded-xl border border-sky-200/80 bg-gradient-to-r from-sky-50/60 to-white hover:border-sky-400 hover:shadow-md transition-all cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">Register Customer</p>
                <p className="text-xs text-slate-500">Add driver identity & license</p>
              </div>
            </div>
          </Link>

          <Link href="/vehicles?action=new">
            <div className="group flex items-center gap-3.5 p-4 rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/60 to-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Add Fleet Vehicle</p>
                <p className="text-xs text-slate-500">Insert vehicle inventory & rates</p>
              </div>
            </div>
          </Link>

          <Link href="/bookings?action=new">
            <div className="group flex items-center gap-3.5 p-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/60 to-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">Create Booking</p>
                <p className="text-xs text-slate-500">Schedule customer rental date</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
