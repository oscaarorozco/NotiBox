"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { AppData, Group, ContentItem, StatLog, TodoItem, ContentItemType, SortOrder, CardAspect } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LOCAL_STORAGE_KEY = "content-hub-data";

const defaultAppData: AppData = {
  groups: [{ id: "1", name: "General", icon: "folder", createdAt: new Date().toISOString(), accessCount: 0 }],
  items: [],
  stats: [],
};

interface ContentStore {
  appData: AppData;
  isLoading: boolean;
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: ContentItem[];
  // Group actions
  addGroup: (name: string, icon?: string) => void;
  updateGroup: (id:string, name: string, icon?: string) => void;
  deleteGroup: (id: string) => void;
  // Item actions
  addItem: (item: Omit<ContentItem, "id" | "createdAt" | "accessCount" | "lastAccessed">) => void;
  updateItem: (item: ContentItem) => void;
  deleteItem: (id: string) => void;
  moveItem: (itemId: string, targetGroupId: string) => void;
  duplicateItem: (itemId: string) => void;
  // Stat actions
  logAccess: (targetId: string, targetType: "group" | "item") => void;
  // Data actions
  exportData: () => void;
  importData: (data: AppData) => void;
  // Filtering & Sorting
  filterByType: ContentItemType | null;
  setFilterByType: (type: ContentItemType | null) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const ContentStoreContext = createContext<ContentStore | null>(null);

type DeletionConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
};

const DeletionConfirmDialog: React.FC<DeletionConfirmDialogProps> = ({ open, onOpenChange, onConfirm, title, description }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);


export const ContentStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appData, setAppData] = useState<AppData>(defaultAppData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGroupId, setActiveGroupIdState] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [filterByType, setFilterByType] = useState<ContentItemType | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('createdAt_desc');


  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as AppData;
        // Simple migration for accessCount if it's missing
        if (!parsedData.groups.every(g => 'accessCount' in g)) {
            parsedData.groups = parsedData.groups.map(g => ({ ...g, accessCount: g.accessCount || 0 }));
        }
        if (!parsedData.items.every(i => 'accessCount' in i)) {
            parsedData.items = parsedData.items.map(i => ({ ...i, accessCount: i.accessCount || 0, lastAccessed: i.lastAccessed || null }));
        }
        if (!parsedData.groups.every(g => 'icon' in g)) {
          parsedData.groups = parsedData.groups.map(g => ({ ...g, icon: g.icon || 'folder' }));
        }
        if (!parsedData.items.every(i => 'aspect' in i)) {
          parsedData.items = parsedData.items.map(i => ({ ...i, aspect: i.aspect || 'default' }));
        }

        setAppData(parsedData);
        if (parsedData.groups.length > 0 && !parsedData.groups.find((g: Group) => g.id === activeGroupId)) {
          setActiveGroupIdState(parsedData.groups[0].id);
        } else if (parsedData.groups.length === 0) {
           setActiveGroupIdState(null);
        }
      } else {
        setAppData(defaultAppData);
        setActiveGroupIdState(defaultAppData.groups[0]?.id || null);
      }
    } catch (error) {
      console.error("No se pudieron cargar los datos de localStorage", error);
      setAppData(defaultAppData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
      } catch (error) {
        console.error("No se pudieron guardar los datos en localStorage", error);
        toast({
          title: "Error",
          description: "No se pudieron guardar tus cambios. El almacenamiento de tu navegador podría estar lleno.",
          variant: "destructive",
        });
      }
    }
  }, [appData, isLoading, toast]);

  const logAccess = useCallback((targetId: string, targetType: "group" | "item") => {
    const newLog: StatLog = {
      id: Date.now().toString(),
      targetId,
      targetType,
      timestamp: new Date().toISOString(),
    };
    
    setAppData((prev) => {
      let newGroups = prev.groups;
      let newItems = prev.items;

      if(targetType === 'group') {
        newGroups = prev.groups.map(g => g.id === targetId ? {...g, accessCount: (g.accessCount || 0) + 1} : g);
      } else {
        newItems = prev.items.map(i => i.id === targetId ? {...i, accessCount: (i.accessCount || 0) + 1, lastAccessed: new Date().toISOString() } : i);
      }

      return {
        ...prev,
        groups: newGroups,
        items: newItems,
        stats: [...prev.stats, newLog],
      };
    });
  }, []);

  const setActiveGroupId = useCallback((id: string | null) => {
      setActiveGroupIdState(id);
      if (id) logAccess(id, 'group');
  }, [logAccess]);

  const addGroup = useCallback((name: string, icon: string = 'folder') => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      icon,
      createdAt: new Date().toISOString(),
      accessCount: 0,
    };
    setAppData((prev) => ({ ...prev, groups: [...prev.groups, newGroup] }));
    setActiveGroupId(newGroup.id);
    toast({ title: "Grupo Creado", description: `El grupo "${name}" ha sido creado.` });
  }, [toast, setActiveGroupId]);

  const updateGroup = useCallback((id: string, name: string, icon?: string) => {
    setAppData((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => (g.id === id ? { ...g, name, icon: icon || g.icon } : g)),
    }));
    toast({ title: "Grupo Actualizado", description: `El grupo ha sido renombrado a "${name}".` });
  }, [toast]);
  
  const confirmDeleteGroup = useCallback(() => {
    if(!groupToDelete) return;
    setAppData((prev) => {
      const newGroups = prev.groups.filter((g) => g.id !== groupToDelete);
      const newItems = prev.items.filter((i) => i.groupId !== groupToDelete);
      if (activeGroupId === groupToDelete) {
        setActiveGroupIdState(newGroups[0]?.id || null);
      }
      return { ...prev, groups: newGroups, items: newItems };
    });
    toast({ title: "Grupo Eliminado", description: "El grupo y su contenido han sido eliminados." });
    setGroupToDelete(null);
  }, [activeGroupId, toast, groupToDelete]);

  const deleteGroup = useCallback((id: string) => {
    setGroupToDelete(id);
  }, []);


  const addItem = useCallback((itemData: Omit<ContentItem, "id" | "createdAt" | "accessCount" | "lastAccessed">) => {
    const newItem: ContentItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      accessCount: 0,
      lastAccessed: null,
      icon: itemData.icon || undefined,
      aspect: itemData.aspect || 'default',
    } as ContentItem;
    
    if (newItem.type === 'todo') {
        (newItem as TodoItem).tasks = (newItem as TodoItem).tasks || [];
    }

    setAppData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    toast({ title: "Elemento Agregado", description: `"${itemData.title}" ha sido agregado.` });
  }, [toast]);
  
  const updateItem = useCallback((updatedItem: ContentItem) => {
    setAppData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    }));
    toast({ title: "Elemento Actualizado", description: `"${updatedItem.title}" ha sido actualizado.` });
  }, [toast]);
  
  const confirmDeleteItem = useCallback(() => {
    if(!itemToDelete) return;
    setAppData((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemToDelete) }));
    toast({ title: "Elemento Eliminado", description: "El elemento ha sido eliminado." });
    setItemToDelete(null);
  }, [itemToDelete, toast]);

  const deleteItem = useCallback((id: string) => {
    setItemToDelete(id);
  }, []);
  
  const moveItem = useCallback((itemId: string, targetGroupId: string) => {
      setAppData(prev => ({
          ...prev,
          items: prev.items.map(item => item.id === itemId ? { ...item, groupId: targetGroupId } : item)
      }));
      toast({ title: "Elemento Movido", description: "El elemento ha sido movido a otro grupo."});
  }, [toast]);

  const duplicateItem = useCallback((itemId: string) => {
    setAppData(prev => {
        const itemToDuplicate = prev.items.find(i => i.id === itemId);
        if (!itemToDuplicate) return prev;

        const duplicatedItem: ContentItem = {
            ...itemToDuplicate,
            id: Date.now().toString(),
            title: `${itemToDuplicate.title} (copia)`,
            createdAt: new Date().toISOString(),
            accessCount: 0,
            lastAccessed: null,
        };
        return { ...prev, items: [...prev.items, duplicatedItem] };
    });
    toast({ title: "Elemento Duplicado", description: "Se ha creado una copia del elemento." });
  }, [toast]);

  const exportData = useCallback(() => {
    try {
      const jsonString = JSON.stringify(appData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Exportación Exitosa", description: "Tus datos han sido descargados." });
    } catch (error) {
      console.error("Falló la exportación de datos", error);
      toast({ title: "Exportación Fallida", description: "No se pudieron exportar tus datos.", variant: "destructive" });
    }
  }, [appData, toast]);

  const importData = useCallback((data: AppData) => {
    // Basic validation
    if (data && Array.isArray(data.groups) && Array.isArray(data.items) && Array.isArray(data.stats)) {
      setAppData(data);
      setActiveGroupId(data.groups[0]?.id || null);
      toast({ title: "Importación Exitosa", description: "Tus datos han sido importados." });
    } else {
      toast({ title: "Importación Fallida", description: "El archivo importado no es válido.", variant: "destructive" });
    }
  }, [toast, setActiveGroupId]);

  const filteredItems = useMemo(() => {
     let items = appData.items.filter((item) => item.groupId === activeGroupId);

     if(filterByType) {
         items = items.filter(item => item.type === filterByType);
     }
     
     if(searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(item => {
            const inTitle = item.title.toLowerCase().includes(query);
            const inTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
            let inContent = false;
            if (item.type === 'note') {
                inContent = item.content.toLowerCase().includes(query);
            } else if (item.type === 'link') {
                inContent = item.url.toLowerCase().includes(query);
            }
            return inTitle || inTags || inContent;
        });
     }

     return items.sort((a, b) => {
        switch(sortOrder) {
            case 'createdAt_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'createdAt_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'accessCount_desc': return (b.accessCount || 0) - (a.accessCount || 0);
            case 'title_asc': return a.title.localeCompare(b.title);
            default: return 0;
        }
     });

  }, [appData.items, activeGroupId, searchQuery, filterByType, sortOrder]);

  const value = {
    appData,
    isLoading,
    activeGroupId,
    setActiveGroupId,
    searchQuery,
    setSearchQuery,
    filteredItems,
    addGroup,
    updateGroup,
    deleteGroup,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
    duplicateItem,
    logAccess,
    exportData,
    importData,
    filterByType,
    setFilterByType,
    sortOrder,
    setSortOrder
  };

  return (
    <ContentStoreContext.Provider value={value}>
      {children}
      <DeletionConfirmDialog 
        open={!!groupToDelete} 
        onOpenChange={(open) => !open && setGroupToDelete(null)}
        onConfirm={confirmDeleteGroup}
        title="¿Estás seguro de que quieres eliminar este grupo?"
        description="Esta acción no se puede deshacer. Todos los contenidos dentro de este grupo también serán eliminados permanentemente."
      />
      <DeletionConfirmDialog 
        open={!!itemToDelete} 
        onOpenChange={(open) => !open && setItemToDelete(null)}
        onConfirm={confirmDeleteItem}
        title="¿Estás seguro de que quieres eliminar este elemento?"
        description="Esta acción no se puede deshacer. El elemento se eliminará permanentemente."
      />
    </ContentStoreContext.Provider>
  );
};

export const useContentStore = () => {
  const context = useContext(ContentStoreContext);
  if (!context) {
    throw new Error("useContentStore debe ser usado dentro de un ContentStoreProvider");
  }
  return context;
};
