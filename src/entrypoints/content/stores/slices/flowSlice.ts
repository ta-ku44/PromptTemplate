import { StateCreator } from 'zustand';
import type { Item } from '@/types/catalog';
import type { VariableAnchor } from '@/types/variable';

type FlowPhase =
  | { kind: 'idle' }
  | { kind: 'suggestion'; query: string }
  | { kind: 'confirming'; prompt: Item; variableValues: Record<string, unknown> }
  | { kind: 'anchored'; prompt: Item; anchors: VariableAnchor[] };

export interface FlowSlice {
  phase: FlowPhase;
  startSuggestion: (query: string) => void;
  chooseItem: (prompt: Item) => void;
  setVariableValue: (variableName: string, value: unknown) => void;
  anchorInsertion: (anchors: VariableAnchor[]) => void;
  resetFlow: () => void;
}

export const createFlowSlice: StateCreator<FlowSlice> = (set) => ({
  phase: { kind: 'idle' },
  startSuggestion: (query) => set({ phase: { kind: 'suggestion', query } }),
  chooseItem: (prompt) => set((state) => (state.phase.kind === 'suggestion' ? { phase: { kind: 'confirming', prompt, variableValues: {} } } : {})),
  setVariableValue: (variableName, value) => set((state) => (state.phase.kind === 'confirming' ? { phase: { ...state.phase, variableValues: { ...state.phase.variableValues, [variableName]: value } } } : {})),
  anchorInsertion: (anchors) => set((state) => (state.phase.kind === 'confirming' ? { phase: { kind: 'anchored', prompt: state.phase.prompt, anchors } } : {})),
  resetFlow: () => set({ phase: { kind: 'idle' } }),
});
