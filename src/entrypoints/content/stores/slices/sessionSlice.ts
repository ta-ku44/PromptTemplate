import { StateCreator } from 'zustand';
import { CursorPosition } from '../../utils/inputBox';

type SessionData = {
  query: string;
  cursorPosition: CursorPosition;
} | null;

export interface SessionSlice {
  session: SessionData;
  openSession: (cursorPosition: CursorPosition) => void;
  updateQuery: (query: string) => void;
  clearSession: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  session: null,
  openSession: (cursorPosition) => set({ session: { query: '', cursorPosition } }),
  updateQuery: (query: string) => set((state) => (state.session ? { session: { ...state.session, query } } : state)),
  clearSession: () => set({ session: null }),
});
