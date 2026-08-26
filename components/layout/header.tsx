"use client";

import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Users, Car, Calendar, Server, RefreshCw, Flame, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "./sidebar-context";
import { useState, useEffect } from "react";

const routeMeta: Record<string, { title: string; subtitle: string; icon: any; color: string; badge: string }> = {
  "/dashboard": { 
    title: "Operations Console", 
    subtitle: "Real-time microservices dispatch & analytics", 
    icon: LayoutDashboard, 
    color: "text-rose-600 bg-rose-50 border-rose-200", 
    badge: "Fleet Live" 
  },
  "/customers": { 
    title: "Customer Registry", 
    subtitle: "Verified drivers, identity profiles, and documentation", 
    icon: Users, 
    color: "text-rose-600 bg-rose-50 border-rose-200", 
    badge: "Drivers Database" 
  },
  "/vehicles": { 
    title: "Vehicle Fleet Inventory", 
    subtitle: "Automotive assets, daily rates, and availability", 
    icon: Car, 
    color: "text-rose-600 bg-rose-50 border-rose-200", 
    badge: "Active Fleet" 
  },
  "/bookings": { 
    title: "Booking & Rental Schedule", 
    subtitle: "Active rental dispatches, timelines, and customer assignments", 
    icon: Calendar, 
    color: "text-rose-600 bg-rose-50 border-rose-200", 
    badge: "Reservations" 
  },
};

function getMeta(pathname: string) {
  for (const [key, val] of Object.entries(routeMeta)) {
    if (pathname === key || pathname.startsWith(key + "/")) return val;
  }
  return { 
    title: "DriveRed Enterprise Portal", 
    subtitle: "Spring Cloud Microservices System", 
    icon: Flame, 
    color: "text-rose-600 bg-rose-50 border-rose-200", 
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
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-rose-100/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 transition-all">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden h-10 w-10 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3.5">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm ${meta.color} hidden sm:flex`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-extrabold text-zinc-900 tracking-tight">{meta.title}</h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 tracking-wide">
                {meta.badge}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium hidden sm:block">{meta.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Gateway Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50/80 border border-rose-200/80 text-xs font-semibold text-rose-900 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="text-[11px] text-rose-700 font-mono">Gateway :7000</span>
        </div>

        {/* Date Display */}
        {currentDate && (
          <div className="hidden lg:block text-xs font-bold text-zinc-600 bg-zinc-50 px-3.5 py-1.5 rounded-xl border border-zinc-200 shadow-2xs">
            📅 {currentDate}
          </div>
        )}
      </div>
    </header>
  );
}
