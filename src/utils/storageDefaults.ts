import { StorageData } from '@/types/storage';

export const DEFAULT_STORAGE_DATA: StorageData = {
  version: 1,
  items: [
    { id: '', name: 'summarize', content: '' },
    { id: '', name: 'explain', content: '' },
    { id: '', name: 'fact-check', content: '' },
    { id: '', name: 'grammar', content: '' },
    { id: '', name: 'composition', content: '' },
    { id: '', name: 'best-words', content: '' },
    { id: '', name: 'review', content: '' },
    { id: '', name: 'best-practices', content: '' },
    { id: '', name: 'refactor', content: '' },
  ],
  categories: [
    { id: '', name: 'General', itemIds: [] },
    { id: '', name: 'Writing', itemIds: [] },
    { id: '', name: 'Code', itemIds: [] },
  ],
  triggerKey: '#',
};
