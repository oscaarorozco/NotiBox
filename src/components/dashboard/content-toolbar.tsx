"use client";

import { useContentStore } from "@/hooks/use-content-store";
import * as LucideIcons from "lucide-react";
import { Folder, LayoutGrid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SortOrder, ViewMode } from "@/lib/types";
import { CommandPalette } from "./command-palette";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const toPascalCase = (str: string) => {
    if (!str) return 'Folder';
    const camelCase = str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};


export function ContentToolbar() {
    const { 
        activeGroupId, 
        appData,
        sortOrder,
        setSortOrder,
        updateGroupViewMode,
    } = useContentStore();

    const activeGroup = appData.groups.find(g => g.id === activeGroupId);
    
    const iconName = activeGroup?.icon ? toPascalCase(activeGroup.icon) : 'Folder';
    const ActiveGroupIcon = LucideIcons[iconName as keyof typeof LucideIcons] || Folder;

    const handleViewModeChange = (viewMode: ViewMode) => {
        if (activeGroupId) {
            updateGroupViewMode(activeGroupId, viewMode);
        }
    }

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
                 <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                    <Button variant="ghost" size="icon" className={cn("h-8 w-8", activeGroup?.viewMode === 'grid' && 'bg-background shadow-sm')} onClick={() => handleViewModeChange('grid')} disabled={!activeGroupId}>
                        <LayoutGrid className="h-4 w-4"/>
                    </Button>
                     <Button variant="ghost" size="icon" className={cn("h-8 w-8", activeGroup?.viewMode === 'list' && 'bg-background shadow-sm')} onClick={() => handleViewModeChange('list')} disabled={!activeGroupId}>
                        <List className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}
