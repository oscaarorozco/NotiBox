
"use client";

import Link from "next/link";
import { Book, Home, LineChart, Settings, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GroupManager } from "./group-manager";
import { AddContentDialog } from "./add-content-dialog";
import { ThemeToggle } from "../ui/theme-toggle";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Panel de Contenido" },
    { href: "/dashboard/stats", icon: LineChart, label: "Estadísticas" },
    { href: "/dashboard/settings", icon: Settings, label: "Ajustes" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-16 flex-col border-r bg-background sm:w-20 md:w-20 lg:w-24">
      <div className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/dashboard"
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-12 md:w-12"
        >
          <Book className="h-5 w-5 transition-all group-hover:scale-110 md:h-6 md:w-6" />
          <span className="sr-only">Central de Contenido</span>
        </Link>
        <Separator className="w-2/3" />
        <TooltipProvider>
            <div className="flex flex-col items-center gap-2">
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full px-2">
                         <GroupManager />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Gestionar Grupos</TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <AddContentDialog trigger={
                           <Button variant="outline" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-lg">
                               <PlusCircle className="h-5 w-5 md:h-6 md:w-6" />
                           </Button>
                       } />
                    </TooltipTrigger>
                    <TooltipContent side="right">Agregar Contenido</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>

      </div>
      <nav className="mt-auto flex flex-col items-center gap-2 px-2 py-4">
        <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-12 md:w-12",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
            <Separator className="w-2/3 my-2" />
             <ThemeToggle />
        </TooltipProvider>
      </nav>
    </aside>
  );
}
