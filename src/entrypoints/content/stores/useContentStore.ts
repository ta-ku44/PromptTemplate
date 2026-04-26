import { create } from 'zustand';
import { createFlowSlice, type FlowSlice } from './slices/flowSlice';
import { createSessionSlice, type SessionSlice } from './slices/sessionSlice';

export const useContentStore = create<FlowSlice & SessionSlice>()((...a) => ({
  ...createFlowSlice(...a),
  ...createSessionSlice(...a),
}));
