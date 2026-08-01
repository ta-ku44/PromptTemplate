import { shallow } from 'zustand/shallow';
import type { Item, Category } from '@/types/catalog';

type WithId = { id: string };

export const mergeById = <T extends WithId>(prev: Record<string, T>, next: T[]): Record<string, T> => {
  let changed = next.length !== Object.keys(prev).length;
  const merged: Record<string, T> = {};

  for (const entity of next) {
    const prevEntity = prev[entity.id];
    if (prevEntity && shallow(prevEntity, entity)) {
      merged[entity.id] = prevEntity;
    } else {
      merged[entity.id] = entity;
      changed = true;
    }
  }

  return changed ? merged : prev;
};

export const stableArray = (prev: string[] | undefined, next: string[]): string[] =>
  prev && shallow(prev, next) ? prev : next;

const itemIdsOf = (items: Item[], categoryId: string): string[] =>
  items.filter((item) => item.categoryId === categoryId).map((item) => item.id);

type IdsByCategory = Record<string, string[]>;

export const mergeIdsByCategory = (prev: IdsByCategory, categories: Category[], items: Item[]): IdsByCategory =>
  Object.fromEntries(categories.map((c) => [c.id, stableArray(prev[c.id], itemIdsOf(items, c.id))]));
