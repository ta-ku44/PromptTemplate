import { StateCreator } from 'zustand';
import type { Item } from '@/types/catalog';
import type { VariableAnchor } from '@/types/variable';
import type { CaretRect } from '../../utils/inputBox';

type FlowPhase =
  | { kind: 'idle' }
  | { kind: 'suggestion'; query: string; caretPosition: CaretRect | null }
  | { kind: 'confirming'; prompt: Item; values: Record<string, unknown> }
  | { kind: 'injecting'; prompt: Item }
  | { kind: 'anchored'; prompt: Item; anchors: VariableAnchor[] };

export interface FlowSlice {
  phase: FlowPhase;
  updateSuggestion: (query: string, caretPosition: CaretRect | null) => void;
  chooseItem: (prompt: Item) => void;
  setVariableValue: (variableName: string, value: unknown) => void;
  confirmVariables: () => void;
  anchorInsertion: (anchors: VariableAnchor[]) => void;
  resetFlow: () => void;
}

type Transition<K extends FlowPhase['kind']> = (phase: Extract<FlowPhase, { kind: K }>) => FlowPhase | null;

export const createFlowSlice: StateCreator<FlowSlice> = (set) => {
  const guard = <K extends FlowPhase['kind']>(kind: K, fn: Transition<K>) =>
    set((state: FlowSlice) => {
      if (state.phase.kind !== kind) return {};
      const next = fn(state.phase as Extract<FlowPhase, { kind: K }>);
      return next ? { phase: next } : {};
    });

  return {
    phase: { kind: 'idle' },
    updateSuggestion: (query, caretPosition) => set({ phase: { kind: 'suggestion', query, caretPosition } }),
    chooseItem: (prompt): void => guard('suggestion', (_) => ({ kind: 'injecting', prompt })),
    setVariableValue: (name, value) => guard('confirming', (p) => ({ ...p, values: { ...p.values, [name]: value } })),
    confirmVariables: () => guard('confirming', (p) => ({ kind: 'injecting', prompt: p.prompt })),
    anchorInsertion: (anchors) => guard('injecting', (p) => ({ kind: 'anchored', prompt: p.prompt, anchors })),
    resetFlow: () => set({ phase: { kind: 'idle' } }),
  };
};
