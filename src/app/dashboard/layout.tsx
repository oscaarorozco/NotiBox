"use client";
import { ContentStoreProvider } from "@/hooks/use-content-store.tsx";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContentStoreProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <DashboardSidebar />
        <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-16 md:pl-20 lg:pl-24">
            {children}
        </main>
      </div>
    </ContentStoreProvider>
  );
}
