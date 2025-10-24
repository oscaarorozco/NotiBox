"use client";

import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash, ChevronsUpDown, Check, PlusCircle, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";

export function GroupManager() {
  const { appData, activeGroupId, setActiveGroupId, addGroup, updateGroup, deleteGroup } = useContentStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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
  
  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId)
    setIsPopoverOpen(false);
  };

  const handleOpenAddDialog = () => {
    setIsPopoverOpen(false);
    setIsAddDialogOpen(true);
  }

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
           <Button
            variant="ghost"
            role="combobox"
            aria-expanded={isPopoverOpen}
            className="w-full justify-start gap-2"
          >
            <Folder />
            <span className="truncate">
                {activeGroup ? activeGroup.name : "Seleccionar grupo..."}
            </span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
           <Command>
             <CommandInput placeholder="Buscar o crear..." />
             <CommandList>
                <CommandEmpty>No se encontraron grupos.</CommandEmpty>
                <CommandGroup>
                {appData.groups.map((group) => (
                    <CommandItem
                        key={group.id}
                        value={group.name}
                        onSelect={() => handleSelectGroup(group.id)}
                        className="flex justify-between items-center"
                    >
                        <div className="flex items-center flex-1 truncate">
                            <Check
                                className={cn("mr-2 h-4 w-4", activeGroupId === group.id ? "opacity-100" : "opacity-0")}
                            />
                            <span className="truncate">{group.name}</span>
                        </div>
                        {group.id !== "1" && (
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 -mr-1"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" align="start" sideOffset={8} onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem onSelect={() => { setIsPopoverOpen(false); setGroupToRename(group); setIsRenameDialogOpen(true); }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Renombrar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => { setIsPopoverOpen(false); deleteGroup(group.id); }}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </CommandItem>
                ))}
                </CommandGroup>
             </CommandList>
             <DropdownMenuSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleOpenAddDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear nuevo grupo
                </CommandItem>
              </CommandGroup>
           </Command>
        </PopoverContent>
      </Popover>

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
      
      {/* Rename Group Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
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
              autoFocus
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
