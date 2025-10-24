"use client";

import { useContentStore } from "@/hooks/use-content-store";
import { ListFilter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SortOrder, ContentItemType } from "@/lib/types";
import { CommandPalette } from "./command-palette";

export function ContentToolbar() {
    const { 
        activeGroupId, 
        appData,
        sortOrder,
        setSortOrder,
    } = useContentStore();

    const activeGroup = appData.groups.find(g => g.id === activeGroupId);

    const sortOptions: { value: SortOrder, label: string}[] = [
        { value: 'createdAt_desc', label: 'Más recientes' },
        { value: 'createdAt_asc', label: 'Más antiguos' },
        { value: 'accessCount_desc', label: 'Más visitados' },
        { value: 'title_asc', label: 'Título (A-Z)' },
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
                    <CommandPalette />
                    
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
