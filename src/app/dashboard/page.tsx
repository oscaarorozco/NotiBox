"use client";
import React, { useState } from "react";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Trash,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentGrid } from "@/components/dashboard/content-grid";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { AddContentDialog } from "@/components/dashboard/add-content-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GroupManager() {
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
  }

  return (
    <Card className="w-full md:w-1/4 h-fit">
      <CardHeader>
        <CardTitle>Grupos</CardTitle>
        <CardDescription>Organiza tu contenido en grupos.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nombre del nuevo grupo"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
          />
          <Button onClick={handleAddGroup} size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {appData.groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                activeGroupId === group.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
              }`}
            >
              <span className="font-medium text-sm">{group.name}</span>
              {group.id !== "1" && ( // Prevent actions on General group
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
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

export default function DashboardPage() {
  const { activeGroupId } = useContentStore();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <GroupManager />
      <div className="w-full md:w-3/4">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <AddContentDialog trigger={
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Contenido
                  </span>
                </Button>
              } />
            </div>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Contenido</CardTitle>
                <CardDescription>
                  Todas tus notas, enlaces e imágenes guardadas en este grupo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeGroupId ? <ContentGrid /> : <p>Selecciona un grupo para ver su contenido.</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
