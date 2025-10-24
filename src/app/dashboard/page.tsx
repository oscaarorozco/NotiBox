"use client";
import React from "react";
import { ContentGrid } from "@/components/dashboard/content-grid";
import { ContentToolbar } from "@/components/dashboard/content-toolbar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <ContentToolbar />
        <ContentGrid />
    </div>
  );
}
