import { StateCreator } from 'zustand';
import type { Item } from '@/types/catalog';
import type { VariableEntry } from '@/types/variable';

type IdlePhase = { type: 'idle' };
type SuggestingPhase = { type: 'suggesting' };
type VariablePhase = { type: 'variable'; item: Item; entries: VariableEntry[] };
type AnchoredPhase = { type: 'anchored' };

type FlowPhase = IdlePhase | SuggestingPhase | VariablePhase | AnchoredPhase;

export interface FlowSlice {
  phase: FlowPhase;
  openSuggest: () => void;
  chooseItem: (item: Item, entries: VariableEntry[]) => void;
  confirmVariables: (values: Record<string, string>) => void;
  resetFlow: () => void;
}

export const createFlowSlice: StateCreator<FlowSlice> = (set) => ({
  phase: { type: 'idle' },
  openSuggest: () => set({ phase: { type: 'suggesting' } }),
  chooseItem: (item, entries) => set({ phase: entries.length > 0 ? { type: 'variable', item, entries } : { type: 'idle' } }),
  confirmVariables: (_values) => set({ phase: { type: 'anchored' } }),
  resetFlow: () => set({ phase: { type: 'idle' } }),
});
