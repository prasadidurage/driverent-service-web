"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

const routeMeta: Record<string, { title: string; gradient: string; textColor: string }> = {
  "/dashboard": { title: "Dashboard", gradient: "from-violet-500/10 to-purple-400/5", textColor: "text-violet-900" },
  "/customers": { title: "Manage Customers", gradient: "from-sky-500/10 to-cyan-400/5", textColor: "text-sky-900" },
  "/vehicles": { title: "Manage Vehicles", gradient: "from-emerald-500/10 to-teal-400/5", textColor: "text-emerald-900" },
  "/bookings": { title: "Manage Bookings", gradient: "from-amber-500/10 to-yellow-400/5", textColor: "text-amber-900" },
};

function getMeta(pathname: string) {
  for (const [key, val] of Object.entries(routeMeta)) {
    if (pathname === key || pathname.startsWith(key + "/")) return val;
  }
  return { title: "Vehicle Rental Portal", gradient: "from-violet-500/10 to-purple-400/5", textColor: "text-violet-900" };
}

export function Header() {
  const pathname = usePathname();
  const { title, gradient, textColor } = getMeta(pathname);
  const { toggle } = useSidebar();

  return (
    <header className={`sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-gradient-to-r ${gradient} backdrop-blur-sm bg-card/80 px-4 sm:px-6`}>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-black/5"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className={`text-base font-semibold ${textColor}`}>{title}</h1>
      </div>
    </header>
  );
}

