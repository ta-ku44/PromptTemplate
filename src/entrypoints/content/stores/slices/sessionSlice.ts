import { StateCreator } from 'zustand';
import { CaretPosition } from '../../utils/inputBox';

type SessionData = {
  query: string;
  caretPosition: CaretPosition;
} | null;

export interface SessionSlice {
  session: SessionData;
  openSession: (caretPosition: CaretPosition) => void;
  updateQuery: (query: string) => void;
  clearSession: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  session: null,
  openSession: (caretPosition) => set({ session: { query: '', caretPosition } }),
  updateQuery: (query: string) => set((state) => (state.session ? { session: { ...state.session, query } } : state)),
  clearSession: () => set({ session: null }),
});
