"use client";

import Link from "next/link";
import { Book, LayoutDashboard, LineChart, Settings, PlusCircle, Folder } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { GroupManager } from "./group-manager";
import { AddContentDialog } from "./add-content-dialog";
import { ThemeToggle } from "../ui/theme-toggle";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/hooks/use-content-store";


export function DashboardSidebarContent() {
  const pathname = usePathname();
  const { activeGroupId } = useContentStore();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Panel" },
    { href: "/dashboard/stats", icon: LineChart, label: "Estadísticas" },
  ];

  return (
    <Sidebar>
        <SidebarHeader>
             <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
            >
                <Book className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Central de Contenido</span>
            </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
            <div className="flex flex-col gap-2">
                 <AddContentDialog 
                    trigger={
                        <Button variant="default" className="w-full justify-start" disabled={!activeGroupId}>
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Agregar Contenido
                        </Button>
                    }
                    defaultGroupId={activeGroupId!}
                 />
                 <GroupManager />
            </div>

            <Separator className="my-4" />

            <SidebarMenu>
                {navItems.map((item) => (
                     <SidebarMenuItem key={item.href}>
                        <Link href={item.href} className="w-full">
                            <SidebarMenuButton
                            isActive={pathname === item.href}
                            >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2">
             <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/dashboard/settings">
                        <SidebarMenuButton isActive={pathname === '/dashboard/settings'}>
                            <Settings className="h-4 w-4" />
                            Ajustes
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <div className="flex items-center justify-center p-2">
                     <ThemeToggle />
                </div>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}
