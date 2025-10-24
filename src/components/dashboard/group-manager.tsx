"use client";

import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash, ChevronsUpDown, Check, PlusCircle, FolderSymlink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
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
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { cn } from "@/lib/utils";

export function GroupManager() {
  const { appData, activeGroupId, setActiveGroupId, addGroup, updateGroup, deleteGroup } = useContentStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  
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
    if (groupToRename && groupToRename.name.trim()) {
      updateGroup(groupToRename.id, groupToRename.name.trim());
      setGroupToRename(null);
      setIsRenameDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto text-left"
          >
            <div className="truncate">
                <span className="text-xs text-muted-foreground">Grupo</span>
                <p className="font-semibold">{activeGroup?.name || 'Seleccionar...'}</p>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          {appData.groups.map((group) => (
            <DropdownMenuItem
              key={group.id}
              className="flex justify-between items-center"
              onClick={() => {
                setActiveGroupId(group.id);
                setIsMenuOpen(false);
              }}
            >
              <span className="truncate flex-1 pr-2">{group.name}</span>
              {activeGroupId === group.id && <Check className="h-4 w-4" />}
               {group.id !== "1" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mr-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" sideOffset={8} onClick={e => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => { setGroupToRename(group); setIsRenameDialogOpen(true); }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Renombrar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteGroup(group.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
             <PlusCircle className="mr-2 h-4 w-4" />
             Crear nuevo grupo
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
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddGroup}>Crear Grupo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename Group Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={() => { setIsRenameDialogOpen(false); setGroupToRename(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Grupo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="group-name">Nombre del Grupo</Label>
            <Input 
              id="group-name" 
              value={groupToRename?.name || ''} 
              onChange={(e) => setGroupToRename(g => g ? {...g, name: e.target.value} : null)} 
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateGroup()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRenameDialogOpen(false); setGroupToRename(null);}}>Cancelar</Button>
            <Button onClick={handleUpdateGroup}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
