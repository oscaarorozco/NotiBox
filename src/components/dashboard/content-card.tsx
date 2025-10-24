"use client";

import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { Link as LinkIcon, FileText, ImageIcon, ListTodo, Edit, Trash2, Eye, CheckCircle, Circle, FolderSymlink, Copy, Expand, Folder, MoreHorizontal } from "lucide-react";
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
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentItem, ImageItem } from "@/lib/types";
import { useContentStore } from "@/hooks/use-content-store";
import { AddContentDialog } from "./add-content-dialog";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ContentCardProps = {
  item: ContentItem;
};

const toPascalCase = (str: string) => {
    if (!str) return 'Folder';
    const camelCase = str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

const ImageViewer = ({ item, trigger, onOpen }: { item: ImageItem, trigger: React.ReactNode, onOpen: () => void }) => {
    return (
        <Dialog>
            <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); onOpen(); }}>{trigger}</DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] p-0">
                <DialogTitle className="sr-only">{item.title}</DialogTitle>
                <Image src={item.url} alt={item.title} fill className="object-contain p-4"/>
            </DialogContent>
        </Dialog>
    )
}

export function ContentCard({ item }: ContentCardProps) {
  const { appData, deleteItem, updateItem, logAccess, moveItem, duplicateItem } = useContentStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const iconName = toPascalCase(item.icon || '');
  const CardIcon = LucideIcons[iconName as keyof typeof LucideIcons] || Folder;

  const typeTranslations: {[key: string]: string} = {
    'note': 'Nota',
    'link': 'Enlace',
    'image': 'Imagen',
    'todo': 'Tareas'
  }

  const renderTypeIcon = () => {
    const className = "h-4 w-4 text-muted-foreground";
    switch (item.type) {
      case "link": return <LinkIcon className={className} />;
      case "note": return <FileText className={className} />;
      case "image": return <ImageIcon className={className} />;
      case "todo": return <ListTodo className={className} />;
      default: return null;
    }
  };

  const handleToggleTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (item.type !== 'todo') return;
    const updatedTasks = item.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateItem({ ...item, tasks: updatedTasks });
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'link') {
        window.open(item.url, '_blank', 'noopener,noreferrer');
        logAccess(item.id, 'item');
    }
  }

  const renderContent = () => {
    switch (item.type) {
      case "image":
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border">
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
             <ImageViewer item={item} onOpen={() => logAccess(item.id, 'item')} trigger={
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Expand className="h-8 w-8 text-white" />
                </div>
            } />
          </div>
        );
      case "note":
        return (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.content}
          </p>
        );
      case "link":
        return (
          <p onClick={handleLinkClick} className="text-sm text-primary hover:underline truncate cursor-pointer">
            {item.url}
          </p>
        );
      case "todo":
        const completedTasks = item.tasks.filter(t => t.completed).length;
        const totalTasks = item.tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        return (
            <div className="space-y-3">
                <div className="space-y-2">
                    {item.tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleToggleTask(e, task.id)}>
                            {task.completed ? <CheckCircle className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                            <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.text}
                            </span>
                        </div>
                    ))}
                    {item.tasks.length > 3 && (
                        <p className="text-xs text-muted-foreground">+ {item.tasks.length - 3} más...</p>
                    )}
                </div>
                {totalTasks > 0 && (
                  <div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right mt-1">{completedTasks} de {totalTasks} completadas</p>
                  </div>
                )}
                 {totalTasks === 0 && (
                  <p className="text-sm text-muted-foreground">No hay tareas pendientes.</p>
                )}
            </div>
        )
      default:
        return null;
    }
  };
  
  const handleItemClick = (e: React.MouseEvent) => {
    // This stops the click from propagating to parent elements if needed.
    // e.stopPropagation();
  }

  const otherGroups = appData.groups.filter(g => g.id !== item.groupId);
  
  const cardClasses = cn(
    "group relative flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out animate-slide-up-and-fade",
    {
      'default': 'hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10',
      'highlighted': 'border-primary/50 shadow-md shadow-primary/10',
      'minimalist': 'bg-transparent shadow-none border-dashed hover:border-solid hover:border-primary/50',
    }[item.aspect || 'default']
  );

  return (
    <Card 
        className={cardClasses}
        onClick={handleItemClick}
    >
      <CardHeader className="p-4 space-y-2">
        <div className="flex items-start justify-between">
            <CardTitle className="text-base font-headline tracking-tight flex items-center gap-2 pr-4">
                <CardIcon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="flex-1 truncate">{item.title}</span>
            </CardTitle>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 -mt-1" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
                    <AddContentDialog itemToEdit={item} trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                    }/>
                    <DropdownMenuItem onClick={() => duplicateItem(item.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicar</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger disabled={otherGroups.length === 0}>
                            <FolderSymlink className="mr-2 h-4 w-4" />
                            <span>Mover a...</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {otherGroups.map(group => (
                                    <DropdownMenuItem key={group.id} onClick={() => moveItem(item.id, group.id)}>
                                        <span>{group.name}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={() => deleteItem(item.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          {renderTypeIcon()}
          <span>{typeTranslations[item.type]}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        {renderContent()}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex-wrap gap-2">
        {item.tags.length > 0 && item.tags.slice(0,3).map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </CardFooter>

       <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>{item.accessCount}</span>
      </div>
    </Card>
  );
}
