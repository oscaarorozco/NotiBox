"use client";

import { useContentStore } from "@/hooks/use-content-store";
import * as LucideIcons from "lucide-react";
import { Folder } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SortOrder } from "@/lib/types";
import { CommandPalette } from "./command-palette";

const toPascalCase = (str: string) => {
    return str.replace(/(^\w|-\w)/g, (g) => g.replace(/-/, "").toUpperCase());
};

export function ContentToolbar() {
    const { 
        activeGroupId, 
        appData,
        sortOrder,
        setSortOrder,
    } = useContentStore();

    const activeGroup = appData.groups.find(g => g.id === activeGroupId);
    
    const iconName = activeGroup?.icon ? toPascalCase(activeGroup.icon) : 'Folder';
    const ActiveGroupIcon = LucideIcons[iconName as keyof typeof LucideIcons] || Folder;


    const sortOptions: { value: SortOrder, label: string}[] = [
        { value: 'createdAt_desc', label: 'Más recientes' },
        { value: 'createdAt_asc', label: 'Más antiguos' },
        { value: 'accessCount_desc', label: 'Más visitados' },
        { value: 'title_asc', label: 'Título (A-Z)' },
    ];
    
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex-1">
                <h1 className="text-2xl font-headline font-semibold flex items-center gap-2">
                    {activeGroup && <ActiveGroupIcon className="h-6 w-6 text-muted-foreground"/>}
                    <span>{activeGroup ? activeGroup.name : 'Panel'}</span>
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

    