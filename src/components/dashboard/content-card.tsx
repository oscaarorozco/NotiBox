"use client";

import Image from "next/image";
import { Link as LinkIcon, FileText, ImageIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/types";
import { useContentStore } from "@/hooks/use-content-store";
import { AddContentDialog } from "./add-content-dialog";

type ContentCardProps = {
  item: ContentItem;
  onCardClick: (id: string) => void;
};

export function ContentCard({ item, onCardClick }: ContentCardProps) {
  const { deleteItem } = useContentStore();

  const renderIcon = () => {
    switch (item.type) {
      case "link":
        return <LinkIcon className="h-4 w-4 text-muted-foreground" />;
      case "note":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case "image":
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        );
      case "note":
        return (
          <p className="text-sm text-muted-foreground line-clamp-4">
            {item.content}
          </p>
        );
      case "link":
        return (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {item.url}
          </a>
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
    <Card className="flex flex-col justify-between group cursor-pointer hover:border-primary/50 transition-all" onClick={handleItemClick}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4">
        <div className="flex-1">
          <CardTitle className="text-base font-headline tracking-wide">{item.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs">
            {renderIcon()}
            <span>{item.type}</span>
            <span title={`Accessed ${item.accessCount} times`}>
                &#8226; {item.accessCount} views
            </span>
          </CardDescription>
        </div>
        <AddContentDialog itemToEdit={item} trigger={
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                <Edit className="h-4 w-4" />
            </Button>
        } />
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}>
            <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderContent()}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
