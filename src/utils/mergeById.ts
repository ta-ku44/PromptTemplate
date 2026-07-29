import { shallow } from 'zustand/shallow';

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
