import { stableArray, mergeById, mergeIdsByCategory } from '../../libs/diffMerge';
import type { StateCreator } from 'zustand';
import type { Item, Category, Catalog } from '@/types/catalog';
import type { DragSlice } from './dragSlice';
import type { ExpandSlice } from './expandSlice';

export interface EntitySlice {
  items: Record<string, Item>;
  categories: Record<string, Category>;
  categoryIds: string[];
  itemIdsByCategory: Record<string, string[]>;

  syncCatalog: (catalog: Catalog) => void;
}

export const createEntitySlice: StateCreator<ExpandSlice & DragSlice & EntitySlice, [], [], EntitySlice> = (set) => ({
  items: {},
  categories: {},
  categoryIds: [],
  itemIdsByCategory: {},

  syncCatalog: (catalog) => set((state) => ({
    items: mergeById(state.items, catalog.items),
    categories: mergeById(state.categories, catalog.categories),
    categoryIds: stableArray(state.categoryIds, catalog.categories.map((c) => c.id)),
    itemIdsByCategory: mergeIdsByCategory(state.itemIdsByCategory, catalog.categories, catalog.items),
  })),
});
