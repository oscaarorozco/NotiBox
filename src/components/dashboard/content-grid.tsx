"use client";

import { useContentStore } from "@/hooks/use-content-store";
import { ContentCard } from "./content-card";

export function ContentGrid() {
  const { appData, activeGroupId, searchQuery, logAccess } = useContentStore();

  const filteredItems = appData.items.filter((item) => {
    const inGroup = item.groupId === activeGroupId;
    if (!inGroup) return false;

    const query = searchQuery.toLowerCase();
    if (!query) return true;

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

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-60">
        <h3 className="text-xl font-semibold font-headline">No Content Yet</h3>
        <p className="text-muted-foreground mt-2">
          Click "Add Content" to start organizing your digital life.
        </p>
      </div>
    );
  }
  
  const handleCardClick = (id: string) => {
    logAccess(id, 'item');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredItems.map((item) => (
        <ContentCard key={item.id} item={item} onCardClick={handleCardClick} />
      ))}
    </div>
  );
}
