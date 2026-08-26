"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Calendar, 
  Radio, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard, 
    activeClass: "bg-indigo-600/15 text-indigo-400 border-indigo-500/30",
    iconColor: "text-indigo-400",
    badge: null
  },
  { 
    label: "Customers", 
    href: "/customers", 
    icon: Users, 
    activeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    iconColor: "text-sky-400",
    badge: null
  },
  { 
    label: "Vehicles", 
    href: "/vehicles", 
    icon: Car, 
    activeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    iconColor: "text-emerald-400",
    badge: null
  },
  { 
    label: "Bookings", 
    href: "/bookings", 
    icon: Calendar, 
    activeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    iconColor: "text-amber-400",
    badge: null
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md transition-opacity lg:hidden" 
          onClick={close} 
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-all duration-300 ease-out lg:translate-x-0",
          "bg-[#090d16]/95 backdrop-blur-xl border-r border-white/[0.08] shadow-2xl",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 px-5 h-20 border-b border-white/[0.08] flex-shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 flex-shrink-0">
            <Car className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold tracking-tight text-white truncate">DriveFlex</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">Cloud</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Rental Management Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Operations
          </p>
          {navItems.map(({ label, href, icon: Icon, activeClass, iconColor }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "relative flex items-center gap-3.5 h-11 rounded-xl px-3.5 text-sm font-medium transition-all duration-200 group border border-transparent",
                  active
                    ? cn("shadow-sm font-semibold", activeClass)
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-current shadow-[0_0_8px_currentColor]" />
                )}
                <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110", active ? iconColor : "text-slate-500 group-hover:text-slate-300")} />
                <span className="flex-1 truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Service Gateway Health Widget */}
        <div className="p-3.5 m-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-300">API Gateway</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">7000</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Spring Cloud Microservices Connected</p>
        </div>

        {/* User / Footer */}
        <div className="px-5 py-4 border-t border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Administrator</p>
              <p className="text-[10px] text-slate-500 font-mono">admin@driveflex.local</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
