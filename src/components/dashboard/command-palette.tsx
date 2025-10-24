"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { useContentStore } from "@/hooks/use-content-store";
import { FileText, Link, ImageIcon, ListTodo, Search } from "lucide-react";
import { Button } from "../ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { ContentItem } from "@/lib/types";

const typeIcons: { [key: string]: React.ElementType } = {
  note: FileText,
  link: Link,
  image: ImageIcon,
  todo: ListTodo,
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { appData, logAccess } = useContentStore();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  const handleSelect = (item: ContentItem) => {
    logAccess(item.id, 'item');
    if (item.type === 'link') {
        window.open(item.url, '_blank', 'noopener,noreferrer');
    }
    setOpen(false);
  }

  const recentItems = useMemo(() => 
    appData.items
        .filter(item => item.lastAccessed)
        .sort((a, b) => new Date(b.lastAccessed!).getTime() - new Date(a.lastAccessed!).getTime())
        .slice(0, 5),
    [appData.items]
  );
  
  const filteredItems = useMemo(() => {
      if (!search) return [];
      return appData.items
        .filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  }, [search, appData.items]);

  if (!mounted) {
    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 text-muted-foreground text-sm w-full max-w-sm justify-start"
            disabled
        >
            <Search className="h-4 w-4" />
            <span>Buscando...</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 text-muted-foreground text-sm w-full sm:w-[250px] justify-start"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Buscar contenido...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Paleta de Comandos</DialogTitle>
        <CommandInput 
            placeholder="Busca en todo tu contenido..." 
            value={search}
            onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          
          {!search && recentItems.length > 0 && (
            <CommandGroup heading="Visto Recientemente">
                {recentItems.map(item => {
                  const Icon = typeIcons[item.type];
                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          )}

          {search && filteredItems.length > 0 && (
            <CommandGroup heading="Resultados de la Búsqueda">
                 {filteredItems.map(item => {
                    const Icon = typeIcons[item.type];
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </CommandItem>
                    );
                  })}
            </CommandGroup>
          )}
          
        </CommandList>
      </CommandDialog>
    </>
  );
}
