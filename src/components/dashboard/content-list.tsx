"use client";

import * as LucideIcons from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/hooks/use-content-store";
import { AddContentDialog } from "./add-content-dialog";
import { MoreHorizontal, FolderSymlink, Copy, Edit, Trash2, Folder, FileText, Link, ImageIcon, ListTodo } from "lucide-react";
import type { ContentItem } from "@/lib/types";

const typeIcons: { [key: string]: React.ElementType } = {
  note: FileText,
  link: Link,
  image: ImageIcon,
  todo: ListTodo,
};

const toPascalCase = (str: string) => {
    if (!str) return 'Folder';
    const camelCase = str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};


export function ContentList() {
  const { filteredItems, appData, moveItem, duplicateItem, deleteItem, logAccess, searchQuery } = useContentStore();
  const otherGroups = appData.groups.filter(g => g.id !== (filteredItems[0]?.groupId || ''));

  const handleLinkClick = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    if (item.type === 'link') {
        window.open(item.url, '_blank', 'noopener,noreferrer');
        logAccess(item.id, 'item');
    }
  }

  const renderContentSummary = (item: ContentItem) => {
    switch(item.type) {
      case 'note':
        return <p className="truncate max-w-xs">{item.content}</p>;
      case 'link':
      case 'image':
        return <p className="truncate max-w-xs">{item.url}</p>;
      case 'todo':
        const completed = item.tasks.filter(t => t.completed).length;
        return `${completed} de ${item.tasks.length} completadas`;
      default:
        return '-';
    }
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg min-h-[50vh]">
        <h3 className="text-xl font-semibold font-headline text-foreground/80">Aún no hay contenido</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {searchQuery 
            ? `No se encontraron resultados para "${searchQuery}".`
            : 'Haz clic en "Agregar Contenido" para empezar a organizar tu vida digital.'}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Contenido</TableHead>
            <TableHead className="hidden lg:table-cell">Tipo</TableHead>
            <TableHead className="hidden xl:table-cell">Etiquetas</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Fecha de Creación</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => {
            const iconName = toPascalCase(item.icon || '');
            const ItemIcon = LucideIcons[iconName as keyof typeof LucideIcons] || Folder;
            const TypeIcon = typeIcons[item.type];
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <ItemIcon className="h-5 w-5 text-primary" />
                </TableCell>
                <TableCell className="font-medium">
                  {item.type === 'link' ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => handleLinkClick(e, item)} className="hover:underline">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {renderContentSummary(item)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground"/>
                        <span className="capitalize">{item.type}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                  {format(new Date(item.createdAt), "dd MMM, yyyy", { locale: es })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                                    {appData.groups.filter(g => g.id !== item.groupId).map(group => (
                                        <DropdownMenuItem key={group.id} onClick={() => moveItem(item.id, group.id)}>
                                            <span>{group.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
