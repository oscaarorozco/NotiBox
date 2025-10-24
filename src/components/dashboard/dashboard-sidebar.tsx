"use client";
import { AddContentDialog } from "./add-content-dialog";
import { GroupManager } from "./group-manager";
import { ThemeToggle } from "../ui/theme-toggle";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Book, LayoutDashboard, LineChart, Settings, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Panel de Contenido" },
    { href: "/dashboard/stats", icon: LineChart, label: "Estadísticas" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/dashboard"
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-12 md:w-12"
        >
          <Book className="h-5 w-5 transition-all group-hover:scale-110 md:h-6 md:w-6" />
          <span className="sr-only">Central de Contenido</span>
        </Link>
        
        <TooltipProvider>
            <div className="flex flex-col items-center gap-3">
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full">
                         <GroupManager />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Gestionar Grupos</TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <AddContentDialog trigger={
                           <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
                               <PlusCircle className="h-5 w-5" />
                           </Button>
                       } />
                    </TooltipTrigger>
                    <TooltipContent side="right">Agregar Contenido</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>

        <Separator className="my-2 w-2/3" />
        
        <TooltipProvider>
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
            <ThemeToggle />
        </TooltipProvider>
      </nav>
    </aside>
  );
}
