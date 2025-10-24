"use client";

import { useContentStore } from "@/hooks/use-content-store.tsx";
import { ContentCard } from "./content-card";
import { PlusCircle } from "lucide-react";
import { AddContentDialog } from "./add-content-dialog";
import { Button } from "../ui/button";

export function ContentGrid() {
  const { filteredItems, activeGroupId, searchQuery } = useContentStore();

  if (!activeGroupId) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full min-h-[50vh]">
        <h3 className="text-xl font-semibold font-headline">No hay un grupo seleccionado</h3>
        <p className="text-muted-foreground mt-2">
            Crea un nuevo grupo o selecciona uno existente desde la barra lateral.
        </p>
        </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg min-h-[50vh]">
        <h3 className="text-xl font-semibold font-headline text-foreground/80">Aún no hay contenido</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {searchQuery 
            ? `No se encontraron resultados para "${searchQuery}".`
            : 'Haz clic en "Agregar Contenido" para empezar a organizar tu vida digital.'}
        </p>
        {!searchQuery && (
          <AddContentDialog trigger={
            <Button variant="outline" className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar tu primer elemento
            </Button>
          } />
        )}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
      {filteredItems.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
