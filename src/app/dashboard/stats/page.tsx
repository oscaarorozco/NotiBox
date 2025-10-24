"use client";

import { StatsView } from "@/components/dashboard/stats-view";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsPage() {
  const { isLoading } = useContentStore();

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
                <Skeleton className="h-[350px] w-full" />
            </div>
            <div className="col-span-3">
                <Skeleton className="h-[350px] w-full" />
            </div>
            <div className="col-span-full">
                <Skeleton className="h-[350px] w-full" />
            </div>
        </div>
    );
  }

  return <StatsView />;
}
