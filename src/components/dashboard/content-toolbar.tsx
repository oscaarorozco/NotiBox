"use client";

import { useContentStore } from "@/hooks/use-content-store";
import { Input } from "@/components/ui/input";
import { Search, ListFilter, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SortOrder, ContentItemType } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { AddContentDialog } from "./add-content-dialog";

export function ContentToolbar() {
    const { 
        searchQuery, 
        setSearchQuery,
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
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar contenido..."
                        value={searchQuery}
                        className="w-full rounded-md bg-secondary pl-9"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={!activeGroupId}
                    />
                </div>
                 <div className="flex items-center gap-2">
                    <AddContentDialog 
                        trigger={
                            <Button variant="outline" size="icon" disabled={!activeGroupId}>
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        }
                        defaultGroupId={activeGroupId!}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto" disabled={!activeGroupId}>
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
                        <SelectTrigger className="w-full sm:w-[160px]">
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
