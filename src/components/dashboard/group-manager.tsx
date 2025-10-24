"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Edit, Trash, PlusCircle, Folder, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useContentStore } from "@/hooks/use-content-store";
import { SidebarMenuButton } from "../ui/sidebar";
import { IconPicker, LucideIcon } from "../icon-picker";

export function GroupManager() {
  const { appData, activeGroupId, setActiveGroupId, addGroup, updateGroup, deleteGroup } = useContentStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupIcon, setNewGroupIcon] = useState<string>("folder");
  const [groupToRename, setGroupToRename] = useState<{id: string, name: string, icon?: string} | null>(null);

  const activeGroup = appData.groups.find(g => g.id === activeGroupId);
  const ActiveGroupIcon = LucideIcons[activeGroup?.icon as keyof typeof LucideIcons] || Folder;

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim(), newGroupIcon);
      setNewGroupName("");
      setNewGroupIcon("folder");
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateGroup = () => {
    if (groupToRename && groupToRename.name.trim() && activeGroup) {
      updateGroup(activeGroup.id, groupToRename.name.trim(), groupToRename.icon);
      setGroupToRename(null);
    }
  };
  
  const openRenameSubMenu = () => {
    if (activeGroup) {
      setGroupToRename({ id: activeGroup.id, name: activeGroup.name, icon: activeGroup.icon });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={{ children: 'Gestionar Grupos' }}>
                <ActiveGroupIcon />
                <span>{activeGroup?.name || "Grupos"}</span>
            </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="bottom" align="start" sideOffset={5}>
            <DropdownMenuLabel>Seleccionar Grupo</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={activeGroupId || ""} onValueChange={setActiveGroupId}>
                {appData.groups.map(group => {
                   const GroupIcon = LucideIcons[group.icon as keyof typeof LucideIcons] || Folder;
                   return (
                    <DropdownMenuRadioItem key={group.id} value={group.id} className="truncate pr-8 flex items-center gap-2">
                       <GroupIcon className="h-4 w-4 text-muted-foreground" />
                       <span className="flex-1">{group.name}</span>
                       {activeGroupId === group.id && <Circle className="h-2 w-2 fill-primary text-primary ml-auto" />}
                    </DropdownMenuRadioItem>
                   )
                })}
            </DropdownMenuRadioGroup>
            
            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Crear Nuevo Grupo</span>
            </DropdownMenuItem>

            <DropdownMenuSub onOpenChange={(open) => open && openRenameSubMenu()}>
                <DropdownMenuSubTrigger disabled={!activeGroup || activeGroup.id === "1"}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Renombrar Grupo</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <div className="p-2 space-y-2">
                         <p className="text-sm text-muted-foreground">Renombrar "{activeGroup?.name}"</p>
                        <Input 
                            id="rename-group-input"
                            value={groupToRename?.name || ''}
                            onChange={(e) => setGroupToRename(prev => prev ? {...prev, name: e.target.value} : null)}
                            onKeyDown={(e) => { if(e.key === 'Enter') handleUpdateGroup() }}
                        />
                        <IconPicker 
                           value={groupToRename?.icon} 
                           onChange={(icon) => setGroupToRename(prev => prev ? {...prev, icon} : null)} 
                        />
                         <Button size="sm" className="w-full mt-2" onClick={handleUpdateGroup}>Renombrar</Button>
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuSub>

             <DropdownMenuItem 
                onSelect={(e) => {
                    e.preventDefault();
                    if (activeGroup) deleteGroup(activeGroup.id);
                }} 
                className="text-destructive focus:text-destructive"
                disabled={!activeGroup || activeGroup.id === "1"}
            >
                <Trash className="mr-2 h-4 w-4" />
                <span>Eliminar Grupo Actual</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Group Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Grupo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="new-group-name">Nombre del Grupo</Label>
                <Input 
                id="new-group-name" 
                value={newGroupName} 
                onChange={(e) => setNewGroupName(e.target.value)} 
                autoFocus
                />
            </div>
            <div className="space-y-2">
                 <Label>Icono del Grupo</Label>
                 <IconPicker value={newGroupIcon} onChange={setNewGroupIcon} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddGroup} disabled={!newGroupName.trim()}>Crear Grupo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
