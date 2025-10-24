"use client";
import React from "react";
import { ContentStoreProvider } from "@/hooks/use-content-store.tsx";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContentStoreProvider>
      <SidebarProvider>
        <Sidebar>
            <DashboardSidebarContent />
        </Sidebar>
        <div className="flex w-full flex-col bg-background">
          <DashboardHeader />
          <SidebarInset>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ContentStoreProvider>
  );
}
