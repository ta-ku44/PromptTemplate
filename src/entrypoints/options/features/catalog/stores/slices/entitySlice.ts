import type { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import type { Item, Category, Catalog } from '@/types/catalog';
import type { DragSlice } from './dragSlice';
import type { ExpandSlice } from './expandSlice';
import { mergeById } from '@/utils/mergeById';

const stableArray = (prev: string[] | undefined, next: string[]): string[] =>
  prev && shallow(prev, next) ? prev : next;

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
  syncCatalog: (catalog) =>
    set((state) => {
      const itemIdsByCategory: Record<string, string[]> = {};
      for (const category of catalog.categories) itemIdsByCategory[category.id] = [];
      for (const item of catalog.items) itemIdsByCategory[item.categoryId]?.push(item.id);

      return {
        items: mergeById(state.items, catalog.items),
        categories: mergeById(state.categories, catalog.categories),
        categoryIds: stableArray(state.categoryIds, catalog.categories.map((category) => category.id)),
        itemIdsByCategory: Object.fromEntries(
          Object.entries(itemIdsByCategory).map(([id, ids]) => [id, stableArray(state.itemIdsByCategory[id], ids)]),
        ),
      };
    }),
});
