"use client";

import { useContentStore } from "@/hooks/use-content-store.tsx";
import { ContentCard } from "./content-card";
import { PlusCircle } from "lucide-react";
import { AddContentDialog } from "./add-content-dialog";
import { Button } from "../ui/button";

export function ContentGrid() {
  const { appData, activeGroupId, searchQuery } = useContentStore();

  const filteredItems = appData.items.filter((item) => {
    const inGroup = item.groupId === activeGroupId;
    if (!inGroup) return false;

    const query = searchQuery.toLowerCase();
    if (!query) return true;

    const inTitle = item.title.toLowerCase().includes(query);
    const inTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
    
    let inContent = false;
    if (item.type === 'note') {
      inContent = item.content.toLowerCase().includes(query);
    } else if (item.type === 'link') {
      inContent = item.url.toLowerCase().includes(query);
    }
    
    return inTitle || inTags || inContent;
  });

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg min-h-[50vh]">
        <h3 className="text-xl font-semibold font-headline text-foreground/80">Aún no hay contenido</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {searchQuery 
            ? `No se encontraron resultados para "${searchQuery}".`
            : 'Haz clic en "Agregar Contenido" en la barra lateral para empezar a organizar tu vida digital.'}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {filteredItems.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
