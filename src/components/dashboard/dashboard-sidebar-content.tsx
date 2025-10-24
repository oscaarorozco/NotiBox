"use client";

import Link from "next/link";
import { Book, LayoutDashboard, LineChart, Settings, PlusCircle } from "lucide-react";
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
import { AddContentDialog } from "./add-content-dialog";
import { useContentStore } from "@/hooks/use-content-store";


export function DashboardSidebarContent() {
  const pathname = usePathname();
  const { activeGroupId } = useContentStore();

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
                 <SidebarMenuItem>
                    <AddContentDialog 
                        trigger={
                           <SidebarMenuButton tooltip={{ children: 'Agregar Contenido' }} disabled={!activeGroupId}>
                                <PlusCircle/>
                                <span>Agregar Contenido</span>
                            </SidebarMenuButton>
                        }
                        defaultGroupId={activeGroupId!}
                    />
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
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
