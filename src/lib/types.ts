export type ContentItemType = 'note' | 'link' | 'image' | 'todo';

export type SortOrder = 'createdAt_desc' | 'createdAt_asc' | 'accessCount_desc' | 'title_asc';

export interface BaseContentItem {
  id: string;
  groupId: string;
  type: ContentItemType;
  title: string;
  tags: string[];
  createdAt: string;
  accessCount: number;
  lastAccessed: string | null;
}

export interface NoteItem extends BaseContentItem {
  type: 'note';
  content: string;
}

export interface LinkItem extends BaseContentItem {
  type: 'link';
  url: string;
}

export interface ImageItem extends BaseContentItem {
  type: 'image';
  url: string; // base64 data URL
}

export interface TodoItem extends BaseContentItem {
    type: 'todo';
    tasks: { id: string; text: string; completed: boolean }[];
}

export type ContentItem = NoteItem | LinkItem | ImageItem | TodoItem;

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  accessCount: number;
}

export interface StatLog {
  id: string;
  targetId: string; // Group ID or ContentItem ID
  targetType: 'group' | 'item';
  timestamp: string;
}

export interface AppData {
  groups: Group[];
  items: ContentItem[];
  stats: StatLog[];
}
