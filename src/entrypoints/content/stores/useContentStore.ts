import { create } from 'zustand';
import { createFlowSlice, type FlowSlice } from './slices/flowSlice';

export const useContentStore = create<FlowSlice>()((...a) => ({
  ...createFlowSlice(...a),
}));
