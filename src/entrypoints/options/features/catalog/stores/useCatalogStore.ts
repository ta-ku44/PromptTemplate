import { create } from 'zustand';
import { createDragSlice, type DragSlice } from './slices/dragSlice';
import { createExpandSlice, type ExpandSlice } from './slices/expandSlice';
import { createEntitySlice, type EntitySlice } from './slices/entitySlice';

export const useCatalogStore = create<DragSlice & ExpandSlice & EntitySlice>()((...a) => ({
  ...createDragSlice(...a),
  ...createExpandSlice(...a),
  ...createEntitySlice(...a),
}));
