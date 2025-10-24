export type ContentItemType = 'note' | 'link' | 'image';

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

export type ContentItem = NoteItem | LinkItem | ImageItem;

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
