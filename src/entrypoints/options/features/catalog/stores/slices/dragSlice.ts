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
  pendingExpandId: string | null;

  startDrag: (id: string, type: DragType) => void;
  setOver: (id: string | null, type: DragType | null, edge: Edge) => void;
  endDrag: () => void;
  settleExpand: (id: string) => void;
}

export const createDragSlice: StateCreator<ExpandSlice & DragSlice & EntitySlice, [], [], DragSlice> = (set, get) => ({
  activeId: null,
  activeType: null,
  overId: null,
  overType: null,
  edge: null,
  pendingExpandId: null,

  startDrag: (id, type) => {
    const wasExpanded = !get().collapsedIds.has(id);
    if (type === 'category') get().collapse(id);
    set({ activeId: id, activeType: type, pendingExpandId: type === 'category' && wasExpanded ? id : null });
  },
  setOver: (overId, overType, edge) => set({ overId, overType, edge }),
  endDrag: () => set({ activeId: null, activeType: null, overId: null, overType: null, edge: null }),
  settleExpand: (id) => set((state) => {
    if (state.pendingExpandId !== id) return {};
    const next = new Set(state.collapsedIds);
    next.delete(id);
    return { collapsedIds: next, pendingExpandId: null };
  }),
});
