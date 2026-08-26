"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Car, Calendar } from "lucide-react";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, activeColor: "bg-white/15 text-white", dotColor: "bg-white" },
  { label: "Customers", href: "/customers", icon: Users, activeColor: "bg-sky-400/20 text-sky-200", dotColor: "bg-sky-300" },
  { label: "Vehicles", href: "/vehicles", icon: Car, activeColor: "bg-emerald-400/20 text-emerald-200", dotColor: "bg-emerald-300" },
  { label: "Bookings", href: "/bookings", icon: Calendar, activeColor: "bg-amber-400/20 text-amber-200", dotColor: "bg-amber-300" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={close} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0",
          "bg-slate-900 border-r border-white/10",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 flex-shrink-0">
            <Car className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold text-white truncate">DriveFlex Rental</p>
            <p className="text-[11px] text-white/50 truncate">Vehicle Rental Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Navigation
          </p>
          {navItems.map(({ label, href, icon: Icon, activeColor, dotColor }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 h-10 rounded-lg px-3 text-sm font-medium transition-all duration-150 group",
                  active ? activeColor : "text-white/55 hover:bg-white/8 hover:text-white/90"
                )}
              >
                <Icon className={cn("h-[17px] w-[17px] shrink-0", active ? "" : "group-hover:opacity-100 opacity-70")} />
                <span className="flex-1 truncate">{label}</span>
                {active && <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${dotColor}`} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 flex-shrink-0">
          <p className="text-[11px] text-white/40 leading-relaxed">
            Vehicle Rental System<br />
            <span className="text-white/20">Enterprise Cloud Architecture</span>
          </p>
        </div>
      </aside>
    </>
  );
}

