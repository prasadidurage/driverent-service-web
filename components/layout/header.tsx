"use client";

import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Users, Car, Calendar, Server, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "./sidebar-context";
import { useState, useEffect } from "react";

const routeMeta: Record<string, { title: string; subtitle: string; icon: any; color: string; badge: string }> = {
  "/dashboard": { 
    title: "Operations Dashboard", 
    subtitle: "Real-time analytics and microservices overview", 
    icon: LayoutDashboard, 
    color: "text-indigo-600 bg-indigo-50 border-indigo-200", 
    badge: "Live Fleet" 
  },
  "/customers": { 
    title: "Customer Registry", 
    subtitle: "Manage registered drivers, identities, and documentation", 
    icon: Users, 
    color: "text-sky-600 bg-sky-50 border-sky-200", 
    badge: "Driver Records" 
  },
  "/vehicles": { 
    title: "Vehicle Fleet Management", 
    subtitle: "Active rental inventory, availability, and daily rates", 
    icon: Car, 
    color: "text-emerald-600 bg-emerald-50 border-emerald-200", 
    badge: "Fleet Assets" 
  },
  "/bookings": { 
    title: "Booking & Rental Schedule", 
    subtitle: "Dispatch assignments, schedules, and active reservations", 
    icon: Calendar, 
    color: "text-amber-600 bg-amber-50 border-amber-200", 
    badge: "Reservations" 
  },
};

function getMeta(pathname: string) {
  for (const [key, val] of Object.entries(routeMeta)) {
    if (pathname === key || pathname.startsWith(key + "/")) return val;
  }
  return { 
    title: "DriveFlex Rental Portal", 
    subtitle: "Cloud Architecture Vehicle Management", 
    icon: LayoutDashboard, 
    color: "text-indigo-600 bg-indigo-50 border-indigo-200", 
    badge: "Enterprise" 
  };
}

export function Header() {
  const pathname = usePathname();
  const meta = getMeta(pathname);
  const Icon = meta.icon;
  const { toggle } = useSidebar();
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    setCurrentDate(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 transition-all">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm ${meta.color} hidden sm:flex`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">{meta.title}</h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {meta.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">{meta.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-medium text-slate-700 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-slate-600 font-mono">Gateway :7000</span>
        </div>

        {/* Date Display */}
        {currentDate && (
          <div className="hidden lg:block text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            📅 {currentDate}
          </div>
        )}
      </div>
    </header>
  );
}
