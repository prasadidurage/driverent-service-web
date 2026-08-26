"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Calendar, 
  ShieldAlert, 
  Flame, 
  Activity, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard, 
    badge: "Live"
  },
  { 
    label: "Customers", 
    href: "/customers", 
    icon: Users, 
    badge: "Drivers"
  },
  { 
    label: "Vehicles", 
    href: "/vehicles", 
    icon: Car, 
    badge: "Fleet"
  },
  { 
    label: "Bookings", 
    href: "/bookings", 
    icon: Calendar, 
    badge: "Schedule"
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-opacity lg:hidden" 
          onClick={close} 
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-all duration-300 ease-out lg:translate-x-0",
          "bg-[#08090d] border-r border-rose-950/40 shadow-2xl shadow-rose-950/20",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 px-5 h-20 border-b border-white/[0.06] flex-shrink-0 relative overflow-hidden">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-rose-400 text-white shadow-lg shadow-rose-600/40 ring-1 ring-white/20 flex-shrink-0">
            <Car className="h-5 w-5 text-white drop-shadow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-black"></span>
            </span>
          </div>

          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-extrabold tracking-tight text-white truncate">DRIVE<span className="text-rose-500">RED</span></span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest">PRO</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">Velocity Rental Cloud</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          <div className="flex items-center justify-between px-3 pb-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500/70">
              Operations Center
            </p>
            <Sparkles className="h-3 w-3 text-rose-500/50" />
          </div>

          {navItems.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "relative flex items-center gap-3.5 h-11 rounded-xl px-3.5 text-sm font-medium transition-all duration-200 group border",
                  active
                    ? "bg-gradient-to-r from-rose-600/20 to-rose-600/5 text-white font-semibold border-rose-500/30 shadow-md shadow-rose-950/40"
                    : "text-zinc-400 border-transparent hover:bg-white/[0.04] hover:text-zinc-100 hover:border-white/[0.05]"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-rose-500 shadow-[0_0_12px_#f43f5e]" />
                )}
                
                <Icon className={cn(
                  "h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110",
                  active ? "text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" : "text-zinc-500 group-hover:text-rose-300"
                )} />
                
                <span className="flex-1 truncate">{label}</span>

                {badge && (
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-md text-xs transition-colors",
                    active 
                      ? "bg-rose-500/25 text-rose-200 border border-rose-500/40" 
                      : "bg-zinc-900 text-zinc-500 border border-white/[0.06] group-hover:text-zinc-300"
                  )}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Microservices Gateway Status Widget */}
        <div className="p-3.5 m-3.5 rounded-xl bg-gradient-to-br from-rose-950/30 via-zinc-900/60 to-black border border-rose-500/20 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-600/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
              </span>
              <span className="text-[11px] font-bold text-zinc-200">Spring Gateway</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
              :7000
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-tight">Customer • Vehicle • Booking Services</p>
        </div>

        {/* User / Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between flex-shrink-0 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-950/60 border border-rose-700/40 flex items-center justify-center text-xs font-bold text-rose-200">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-white">System Admin</p>
              <p className="text-[10px] text-zinc-500 font-mono">admin@drivered.io</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
