"use client";

import { useContentStore } from "@/hooks/use-content-store.tsx";
import { useMemo } from "react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Link as LinkIcon, FileText, ImageIcon, ListTodo, Eye } from "lucide-react";
import { ContentItem } from "@/lib/types";

const typeIcons: { [key in ContentItem['type']]: React.FC<any> } = {
  note: FileText,
  link: LinkIcon,
  image: ImageIcon,
  todo: ListTodo,
};


export function RecentItems() {
    const { appData, logAccess } = useContentStore();

    const recentItems = useMemo(() => {
        return appData.items
            .filter(item => item.lastAccessed)
            .sort((a, b) => new Date(b.lastAccessed!).getTime() - new Date(a.lastAccessed!).getTime())
            .slice(0, 10);
    }, [appData.items]);

    const handleItemClick = (item: ContentItem) => {
        logAccess(item.id, 'item');
        if (item.type === 'link') {
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    };
    
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Visto Recientemente</CardTitle>
                <CardDescription>Tus 10 elementos más recientes.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                        {recentItems.length > 0 ? recentItems.map(item => {
                            const Icon = typeIcons[item.type];
                            return (
                                <div key={item.id} className="flex items-start gap-3 cursor-pointer group" onClick={() => handleItemClick(item)}>
                                    <div className="p-2 bg-accent rounded-md">
                                       <Icon className="h-4 w-4 text-accent-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium truncate group-hover:underline">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Visto {formatDistanceToNow(new Date(item.lastAccessed!), { addSuffix: true, locale: es })}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                        <Eye className="h-3 w-3" />
                                        <span>{item.accessCount}</span>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="text-sm text-muted-foreground text-center pt-8">No hay actividad reciente.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
