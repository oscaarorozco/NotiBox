"use client";

import React, { useState } from "react";
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

export function GroupManager() {
  const { appData, activeGroupId, setActiveGroupId, addGroup, updateGroup, deleteGroup } = useContentStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState("");
  const [groupToRename, setGroupToRename] = useState<{id: string, name: string} | null>(null);

  const activeGroup = appData.groups.find(g => g.id === activeGroupId);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName("");
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateGroup = () => {
    if (groupToRename && groupToRename.name.trim() && activeGroup) {
      updateGroup(activeGroup.id, groupToRename.name.trim());
      setGroupToRename(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={{ children: 'Gestionar Grupos' }}>
                <Folder />
                <span>{activeGroup?.name || "Grupos"}</span>
            </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="bottom" align="start" sideOffset={5}>
            <DropdownMenuLabel>Seleccionar Grupo</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={activeGroupId || ""} onValueChange={setActiveGroupId}>
                {appData.groups.map(group => (
                    <DropdownMenuRadioItem key={group.id} value={group.id} className="truncate pr-8">
                       <span className="flex-1">{group.name}</span>
                       {activeGroupId === group.id && <Circle className="h-2 w-2 fill-primary text-primary ml-auto" />}
                    </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
            
            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Crear Nuevo Grupo</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!activeGroup || activeGroup.id === "1"}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Renombrar Grupo</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <div className="p-2">
                         <p className="text-sm text-muted-foreground mb-2">Renombrar "{activeGroup?.name}"</p>
                        <Input 
                            id="rename-group-input"
                            defaultValue={activeGroup?.name}
                            onChange={(e) => setGroupToRename({id: activeGroup!.id, name: e.target.value})}
                            onKeyDown={(e) => { if(e.key === 'Enter') handleUpdateGroup() }}
                            autoFocus
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
            <Label htmlFor="new-group-name">Nombre del Grupo</Label>
            <Input 
              id="new-group-name" 
              value={newGroupName} 
              onChange={(e) => setNewGroupName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddGroup}>Crear Grupo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
