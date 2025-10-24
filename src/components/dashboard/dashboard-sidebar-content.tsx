"use client";

import Link from "next/link";
import { Book, LayoutDashboard, LineChart, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { GroupManager } from "./group-manager";
import { ThemeToggle } from "../ui/theme-toggle";

export function DashboardSidebarContent() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Panel" },
    { href: "/dashboard/stats", icon: LineChart, label: "Estadísticas" },
  ];

  return (
    <>
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
            <SidebarMenu>
                <SidebarMenuItem>
                    <GroupManager />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2">
             <SidebarMenu>
                {navItems.map((item) => (
                     <SidebarMenuItem key={item.href}>
                        <Link href={item.href} className="w-full">
                            <SidebarMenuButton
                            isActive={pathname === item.href}
                            tooltip={{children: item.label}}
                            >
                            <item.icon />
                            <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
                 <SidebarMenuItem>
                    <Link href="/dashboard/settings">
                        <SidebarMenuButton 
                            isActive={pathname === '/dashboard/settings'}
                            tooltip={{children: 'Ajustes'}}
                        >
                            <Settings />
                            <span>Ajustes</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                     <ThemeToggle />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
