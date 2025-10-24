
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AppData, Group, ContentItem, StatLog } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = "content-hub-data";

const defaultAppData: AppData = {
  groups: [{ id: "1", name: "General", createdAt: new Date().toISOString(), accessCount: 0 }],
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
  // Group actions
  addGroup: (name: string) => void;
  updateGroup: (id:string, name: string) => void;
  deleteGroup: (id: string) => void;
  // Item actions
  addItem: (item: Omit<ContentItem, "id" | "createdAt" | "accessCount" | "lastAccessed">) => void;
  updateItem: (item: ContentItem) => void;
  deleteItem: (id: string) => void;
  // Stat actions
  logAccess: (targetId: string, targetType: "group" | "item") => void;
  // Data actions
  exportData: () => void;
  importData: (data: AppData) => void;
}

const ContentStoreContext = createContext<ContentStore | null>(null);

export const ContentStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appData, setAppData] = useState<AppData>(defaultAppData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGroupId, setActiveGroupId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAppData(parsedData);
        if (parsedData.groups.length > 0) {
          setActiveGroupId(parsedData.groups[0].id);
        } else {
          setActiveGroupId(null);
        }
      } else {
        setAppData(defaultAppData);
        setActiveGroupId(defaultAppData.groups[0]?.id || null);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
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
        console.error("Failed to save data to localStorage", error);
        toast({
          title: "Error",
          description: "Could not save your changes. Your browser storage might be full.",
          variant: "destructive",
        });
      }
    }
  }, [appData, isLoading, toast]);

  const addGroup = useCallback((name: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      accessCount: 0,
    };
    setAppData((prev) => ({ ...prev, groups: [...prev.groups, newGroup] }));
    setActiveGroupId(newGroup.id);
    toast({ title: "Group Created", description: `Group "${name}" has been created.` });
  }, [toast]);

  const updateGroup = useCallback((id: string, name: string) => {
    setAppData((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => (g.id === id ? { ...g, name } : g)),
    }));
    toast({ title: "Group Updated", description: `Group has been renamed to "${name}".` });
  }, [toast]);

  const deleteGroup = useCallback((id: string) => {
    setAppData((prev) => {
      const newGroups = prev.groups.filter((g) => g.id !== id);
      const newItems = prev.items.filter((i) => i.groupId !== id);
      if (activeGroupId === id) {
        setActiveGroupId(newGroups[0]?.id || null);
      }
      return { ...prev, groups: newGroups, items: newItems };
    });
    toast({ title: "Group Deleted", description: "The group and its contents have been deleted." });
  }, [activeGroupId, toast]);

  const addItem = useCallback((itemData: Omit<ContentItem, "id" | "createdAt" | "accessCount" | "lastAccessed">) => {
    const newItem: ContentItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      accessCount: 0,
      lastAccessed: null,
    } as ContentItem;
    setAppData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    toast({ title: "Item Added", description: `"${itemData.title}" has been added.` });
  }, [toast]);
  
  const updateItem = useCallback((updatedItem: ContentItem) => {
    setAppData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    }));
    toast({ title: "Item Updated", description: `"${updatedItem.title}" has been updated.` });
  }, [toast]);
  
  const deleteItem = useCallback((id: string) => {
    setAppData((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    toast({ title: "Item Deleted", description: "The item has been deleted." });
  }, [toast]);

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
        newGroups = prev.groups.map(g => g.id === targetId ? {...g, accessCount: g.accessCount + 1} : g);
      } else {
        newItems = prev.items.map(i => i.id === targetId ? {...i, accessCount: i.accessCount + 1, lastAccessed: new Date().toISOString() } : i);
      }

      return {
        ...prev,
        groups: newGroups,
        items: newItems,
        stats: [...prev.stats, newLog],
      };
    });
  }, []);

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
      toast({ title: "Export Successful", description: "Your data has been downloaded." });
    } catch (error) {
      console.error("Failed to export data", error);
      toast({ title: "Export Failed", description: "Could not export your data.", variant: "destructive" });
    }
  }, [appData, toast]);

  const importData = useCallback((data: AppData) => {
    // Basic validation
    if (data && Array.isArray(data.groups) && Array.isArray(data.items) && Array.isArray(data.stats)) {
      setAppData(data);
      setActiveGroupId(data.groups[0]?.id || null);
      toast({ title: "Import Successful", description: "Your data has been imported." });
    } else {
      toast({ title: "Import Failed", description: "The imported file is not valid.", variant: "destructive" });
    }
  }, [toast]);

  const value = {
    appData,
    isLoading,
    activeGroupId,
    setActiveGroupId: (id: string | null) => {
      setActiveGroupId(id);
      if (id) logAccess(id, 'group');
    },
    searchQuery,
    setSearchQuery,
    addGroup,
    updateGroup,
    deleteGroup,
    addItem,
    updateItem,
    deleteItem,
    logAccess,
    exportData,
    importData,
  };

  return (
    <ContentStoreContext.Provider value={value}>
      {children}
    </ContentStoreContext.Provider>
  );
};

export const useContentStore = () => {
  const context = useContext(ContentStoreContext);
  if (!context) {
    throw new Error("useContentStore must be used within a ContentStoreProvider");
  }
  return context;
};
