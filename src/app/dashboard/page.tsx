"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentGrid } from "@/components/dashboard/content-grid";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const { appData, activeGroupId, setSearchQuery } = useContentStore();
  const activeGroup = appData.groups.find(g => g.id === activeGroupId);

  return (
    <div className="flex flex-col gap-4 p-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex-1">
                <h1 className="text-2xl font-headline font-semibold">
                    {activeGroup ? activeGroup.name : 'Panel de Contenido'}
                </h1>
                <p className="text-muted-foreground">
                    {activeGroup ? 'Viendo todo el contenido de este grupo.' : 'Selecciona un grupo para empezar.'}
                </p>
             </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar en el grupo..."
                className="w-full rounded-full bg-secondary pl-9 md:w-[250px] lg:w-[350px]"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>

        <Card className="min-h-[75vh] w-full">
            <CardContent className="p-4 md:p-6">
            {activeGroupId ? (
                <ContentGrid />
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full min-h-[50vh]">
                <h3 className="text-xl font-semibold font-headline">No hay un grupo seleccionado</h3>
                <p className="text-muted-foreground mt-2">
                    Crea un nuevo grupo o selecciona uno existente desde la barra lateral.
                </p>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
