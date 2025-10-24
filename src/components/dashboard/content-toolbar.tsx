"use client";

import { useContentStore } from "@/hooks/use-content-store";
import { ListFilter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SortOrder, ContentItemType } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CommandPalette } from "./command-palette";

export function ContentToolbar() {
    const { 
        activeGroupId, 
        appData,
        sortOrder,
        setSortOrder,
        filterByType,
        setFilterByType
    } = useContentStore();

    const activeGroup = appData.groups.find(g => g.id === activeGroupId);

    const sortOptions: { value: SortOrder, label: string}[] = [
        { value: 'createdAt_desc', label: 'Más recientes' },
        { value: 'createdAt_asc', label: 'Más antiguos' },
        { value: 'accessCount_desc', label: 'Más visitados' },
        { value: 'title_asc', label: 'Título (A-Z)' },
    ];
    
    const filterOptions: { value: ContentItemType, label: string}[] = [
        { value: 'note', label: 'Notas' },
        { value: 'link', label: 'Enlaces' },
        { value: 'image', label: 'Imágenes' },
        { value: 'todo', label: 'Tareas' },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex-1">
                <h1 className="text-2xl font-headline font-semibold">
                    {activeGroup ? activeGroup.name : 'Panel'}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {activeGroup ? `Viendo ${appData.items.filter(i => i.groupId === activeGroupId).length} elemento(s).` : 'Selecciona un grupo para empezar.'}
                </p>
             </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <div className="w-full sm:w-auto">
                      <CommandPalette />
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex-1 sm:flex-initial" disabled={!activeGroupId}>
                                <ListFilter className="mr-2 h-4 w-4"/>
                                Filtrar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuRadioGroup value={filterByType || 'all'} onValueChange={(v) => setFilterByType(v === 'all' ? null : v as ContentItemType)}>
                                <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
                                {filterOptions.map(opt => (
                                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>{opt.label}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)} disabled={!activeGroupId}>
                        <SelectTrigger className="w-full sm:w-[160px] flex-1 sm:flex-initial">
                            <SelectValue placeholder="Ordenar por..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            </div>
        </div>
    );
}
