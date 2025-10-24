"use client";
import React from "react";
import { ContentGrid } from "@/components/dashboard/content-grid";
import { ContentList } from "@/components/dashboard/content-list";
import { ContentToolbar } from "@/components/dashboard/content-toolbar";
import { useContentStore } from "@/hooks/use-content-store";

export default function DashboardPage() {
  const { appData, activeGroupId } = useContentStore();
  const activeGroup = appData.groups.find(g => g.id === activeGroupId);
  const viewMode = activeGroup?.viewMode || 'grid';

  return (
    <div className="flex flex-col gap-6">
      <ContentToolbar />
      {viewMode === 'grid' ? <ContentGrid /> : <ContentList />}
    </div>
  );
}
