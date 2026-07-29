import type { StateCreator } from 'zustand';
import type { DragSlice } from './dragSlice';
import type { EntitySlice } from './entitySlice';

export interface ExpandSlice {
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  collapse: (id: string) => void;
  expand: (id: string) => void;
}

export const createExpandSlice: StateCreator<ExpandSlice & DragSlice & EntitySlice, [], [], ExpandSlice> = (set) => ({
  expandedIds: new Set(),
  toggleExpand: (id) => set((state) => {
    const next = new Set(state.expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    return { expandedIds: next };
  }),
  collapse: (id) => set((state) => {
    const next = new Set(state.expandedIds);
    next.delete(id);
    return { expandedIds: next };
  }),
  expand: (id) => set((state) => ({ expandedIds: new Set(state.expandedIds).add(id) })),
});
