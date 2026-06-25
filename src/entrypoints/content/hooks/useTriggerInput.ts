import { useEffect, useState } from 'preact/hooks';
import { useContentStore } from '../stores/useContentStore';
import { getTextBeforeCursor, detectTrigger, getCaretPosition, type CaretPosition } from '../utils/inputBox';

export function useTriggerInput(inputBox: HTMLElement | null, triggerKey: string) {
  // TODO: Move query/caretPos state to Zustand session slice and make this hook a store updater only.
  const [query, setQuery] = useState<string | null>(null);
  const [caretPos, setCaretPos] = useState<CaretPosition | null>(null);
  const openSuggest = useContentStore((state) => state.startSuggestion);
  const resetFlow = useContentStore((state) => state.resetFlow);

  useEffect(() => {
    if (!inputBox) {
      setQuery(null);
      setCaretPos(null);
      return;
    }

    let prevText: string | null = null;
    let rafId: number | null = null;

    const isCaretOnly = (): boolean => {
      if (inputBox instanceof HTMLTextAreaElement) return inputBox.selectionStart === inputBox.selectionEnd;
      const sel = window.getSelection();
      return !!sel && sel.isCollapsed && inputBox.contains(sel.anchorNode);
    };

    const process = () => {
      if (!isCaretOnly()) return;

      const currText = getTextBeforeCursor(inputBox);
      if (currText === prevText) return;
      prevText = currText;
      const nextQuery = detectTrigger(currText, triggerKey);

      setQuery(nextQuery);
      setCaretPos(getCaretPosition(inputBox));
      nextQuery !== null ? openSuggest(nextQuery) : resetFlow();
    };

    const handler = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(process);
    };

    const target: Document | HTMLElement = inputBox instanceof HTMLTextAreaElement ? inputBox : document;
    target.addEventListener('selectionchange', handler);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      target.removeEventListener('selectionchange', handler);
    };
  }, [triggerKey, inputBox, openSuggest, resetFlow]);

  return { query, caretPos };
}
