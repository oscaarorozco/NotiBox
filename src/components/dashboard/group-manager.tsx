"use client";

import React, { useState } from "react";
import { MoreHorizontal, PlusCircle, Edit, Trash, Folder } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState<{id: string, name: string} | null>(null);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  const handleUpdateGroup = () => {
    if (editingGroup && editingGroup.name.trim()) {
      updateGroup(editingGroup.id, editingGroup.name.trim());
      setEditingGroup(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            <span>Grupos</span>
        </CardTitle>
        <CardDescription>Organiza tu contenido en grupos.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nombre del nuevo grupo"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
            className="h-9"
          />
          <Button onClick={handleAddGroup} size="icon" className="h-9 w-9">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
          {appData.groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={cn(
                "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
                activeGroupId === group.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted/50"
              )}
            >
              <span className="font-medium text-sm truncate pr-2">{group.name}</span>
              {group.id !== "1" && ( // Prevent actions on General group
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingGroup(group); }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Renombrar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Grupo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="group-name">Nombre del Grupo</Label>
            <Input 
              id="group-name" 
              value={editingGroup?.name || ''} 
              onChange={(e) => setEditingGroup(g => g ? {...g, name: e.target.value} : null)} 
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateGroup()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGroup(null)}>Cancelar</Button>
            <Button onClick={handleUpdateGroup}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
