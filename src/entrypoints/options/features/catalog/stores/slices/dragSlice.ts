import type { StateCreator } from 'zustand';
import type { ExpandSlice } from './expandSlice';
import type { EntitySlice } from './entitySlice';
import type { Edge } from '../../libs/reorder';

type DragType = 'item' | 'category' | 'category-slot';

export interface DragSlice {
  activeId: string | null;
  activeType: DragType | null;
  overId: string | null;
  overType: DragType | null;
  edge: Edge;

  startDrag: (id: string, type: DragType) => void;
  setOver: (id: string | null, type: DragType | null, edge: Edge) => void;
  endDrag: () => void;
}

export const createDragSlice: StateCreator<ExpandSlice & DragSlice & EntitySlice, [], [], DragSlice> = (set) => ({
  activeId: null,
  activeType: null,
  overId: null,
  overType: null,
  edge: null,

  startDrag: (id, type) => set({ activeId: id, activeType: type }),
  setOver: (overId, overType, edge) => set({ overId, overType, edge }),
  endDrag: () => set({ activeId: null, activeType: null, overId: null, overType: null, edge: null }),
});
