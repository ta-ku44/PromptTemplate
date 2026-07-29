import type { StateCreator } from 'zustand';
import type { ExpandSlice } from './expandSlice';
import type { EntitySlice } from './entitySlice';

type DragType = 'item' | 'category';
type Edge = 'top' | 'bottom' | null;

export interface DragSlice {
  activeId: string | null;
  activeType: DragType | null;
  overId: string | null;
  overType: DragType | null;
  edge: Edge;
  wasExpandedBeforeDrag: boolean;

  startDrag: (id: string, type: DragType) => void;
  setOver: (id: string | null, type: DragType | null, edge: Edge) => void;
  endDrag: (cancelled: boolean) => void;
}

export const createDragSlice: StateCreator<ExpandSlice & DragSlice & EntitySlice, [], [], DragSlice> = (set, get) => ({
  activeId: null,
  activeType: null,
  overId: null,
  overType: null,
  edge: null,
  wasExpandedBeforeDrag: false,

  startDrag: (id, type) => {
    const wasExpanded = get().expandedIds.has(id);
    if (type === 'category') get().collapse(id);
    set({ activeId: id, activeType: type, wasExpandedBeforeDrag: wasExpanded });
  },
  setOver: (overId, overType, edge) => set({ overId, overType, edge }),
  endDrag: (cancelled) => {
    const { activeId, activeType, wasExpandedBeforeDrag, expand } = get();
    if (cancelled && activeType === 'category' && activeId && wasExpandedBeforeDrag) expand(activeId);
    set({ activeId: null, activeType: null, overId: null, overType: null, edge: null });
  },
});
