import { StateCreator } from 'zustand';
import { CaretPosition } from '../../utils/inputBox';

export interface SessionSlice {
  editorElement: HTMLElement | null;
  caretPosition: CaretPosition;
  setEditorContext: (editorElement: HTMLElement, caretPosition: CaretPosition) => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  editorElement: null,
  caretPosition: { top: 0, left: 0, height: 0 },
  setEditorContext: (editorElement, caretPosition) => set({ editorElement, caretPosition }),
});
