import type { StateCreator } from 'zustand';
import type { DragSlice } from './dragSlice';
import type { EntitySlice } from './entitySlice';

export interface ExpandSlice {
  collapsedIds: Set<string>;

  toggleExpand: (id: string) => void;
  collapse: (id: string) => void;
  expand: (id: string) => void;
}

export const createExpandSlice: StateCreator<ExpandSlice & DragSlice & EntitySlice, [], [], ExpandSlice> = (set) => ({
  collapsedIds: new Set(),

  toggleExpand: (id) => set((state) => {
    const next = new Set(state.collapsedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    return { collapsedIds: next };
  }),
  collapse: (id) => set((state) => ({ collapsedIds: new Set(state.collapsedIds).add(id) })),
  expand: (id) => set((state) => {
    const next = new Set(state.collapsedIds);
    next.delete(id);
    return { collapsedIds: next };
  }),
});
