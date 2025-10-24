"use client";

import Link from "next/link";
import { Book, Home, LineChart, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Inicio" },
    { href: "/dashboard/stats", icon: LineChart, label: "Estadísticas" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <TooltipProvider>
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-10 md:w-10 md:text-base"
          >
            <Book className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Central de Contenido</span>
          </Link>
          <div className="flex flex-col items-center gap-3 mt-4">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-foreground",
                  pathname === "/dashboard/settings"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Ajustes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Ajustes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
