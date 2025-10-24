"use client";
import React from "react";
import {
  PlusCircle,
  BarChart,
  PieChart,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ContentGrid } from "@/components/dashboard/content-grid";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { AddContentDialog } from "@/components/dashboard/add-content-dialog";
import { GroupManager } from "@/components/dashboard/group-manager";
import { StatsPreview } from "@/components/dashboard/stats-preview";

export default function DashboardPage() {
  const { activeGroupId } = useContentStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Columna Izquierda: Grupos y Estadísticas */}
      <aside className="lg:col-span-3 flex flex-col gap-8">
        <GroupManager />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Estadísticas</span>
            </CardTitle>
            <CardDescription>Un resumen de tu actividad.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsPreview />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/stats">
                Ver estadísticas completas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </aside>

      {/* Columna Derecha: Contenido */}
      <main className="lg:col-span-9">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center mb-4">
            <div className="ml-auto flex items-center gap-2">
              <AddContentDialog
                trigger={
                  <Button size="sm" className="h-9 gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Contenido
                    </span>
                  </Button>
                }
              />
            </div>
          </div>
          <TabsContent value="all">
            <Card className="min-h-[60vh]">
              <CardHeader>
                <CardTitle>Tu Contenido</CardTitle>
                <CardDescription>
                  Notas, enlaces e imágenes guardadas en el grupo activo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeGroupId ? (
                  <ContentGrid />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-60">
                    <h3 className="text-xl font-semibold font-headline">No hay un grupo seleccionado</h3>
                    <p className="text-muted-foreground mt-2">
                      Elige un grupo de la lista para ver su contenido.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
