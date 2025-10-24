"use client";

import Image from "next/image";
import { Link as LinkIcon, FileText, ImageIcon, Edit, Trash2, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/types";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { AddContentDialog } from "./add-content-dialog";

type ContentCardProps = {
  item: ContentItem;
  onCardClick: (id: string) => void;
};

export function ContentCard({ item, onCardClick }: ContentCardProps) {
  const { deleteItem } = useContentStore();

  const typeTranslations: {[key: string]: string} = {
    'note': 'Nota',
    'link': 'Enlace',
    'image': 'Imagen'
  }

  const renderIcon = () => {
    const className = "h-4 w-4 text-muted-foreground";
    switch (item.type) {
      case "link": return <LinkIcon className={className} />;
      case "note": return <FileText className={className} />;
      case "image": return <ImageIcon className={className} />;
      default: return null;
    }
  };

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
          <p className="text-sm text-primary hover:underline truncate">
            {item.url}
          </p>
        );
      default:
        return null;
    }
  };
  
  const handleItemClick = () => {
    onCardClick(item.id);
    if (item.type === 'link') {
        window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <Card 
        className="group relative flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10"
        onClick={handleItemClick}
    >
      <CardHeader className="p-4 space-y-2">
        <CardTitle className="text-base font-headline tracking-tight truncate pr-16">{item.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          {renderIcon()}
          <span>{typeTranslations[item.type]}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 cursor-pointer">
        {renderContent()}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex-wrap gap-2">
        {item.tags.length > 0 && item.tags.slice(0,3).map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </CardFooter>

      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <AddContentDialog itemToEdit={item} trigger={
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
            </Button>
        } />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
        </Button>
      </div>

       <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>{item.accessCount}</span>
      </div>
    </Card>
  );
}
