"use client";

import React, { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useContentStore } from "@/hooks/use-content-store";
import { FileText, Link, ImageIcon, ListTodo, Search } from "lucide-react";
import { Button } from "../ui/button";

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


  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  const handleSelect = (itemId: string, itemType: string, url?: string) => {
    logAccess(itemId, 'item');
    if (itemType === 'link' && url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="outline"
        className="hidden md:flex items-center gap-2 text-muted-foreground text-sm"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Buscar...</span>
        <kbd className="pointer-events-none ml-4 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Busca en todo tu contenido..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {appData.groups.map(group => (
            <CommandGroup key={group.id} heading={group.name}>
              {appData.items
                .filter(item => item.groupId === group.id)
                .map(item => {
                  const Icon = typeIcons[item.type];
                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(item.id, item.type, (item as any).url)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
