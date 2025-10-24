"use client";

import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Book, PanelLeft } from "lucide-react";
import Link from "next/link";
import { useContentStore } from "@/hooks/use-content-store";

export function DashboardHeader() {
    const { isMobile } = useSidebar();
    const { activeGroupId } = useContentStore();

    if (!isMobile) {
        return null;
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:hidden">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
            >
                <Book className="h-6 w-6 text-primary" />
                <span className="sr-only">Central de Contenido</span>
            </Link>

            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                 <div className="ml-auto flex-1 sm:flex-initial" />
                {activeGroupId && <SidebarTrigger>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </SidebarTrigger>}
            </div>
        </header>
    );
}
