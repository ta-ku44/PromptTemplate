import { useEffect } from 'preact/hooks';
import { useContentStore } from '../stores/useContentStore';
import { getTextBeforeCursor, detectTrigger, getCaretRect } from '../utils/inputBox';

export function useTriggerInput(inputBox: HTMLElement | null, triggerKey: string) {
  const updateSuggestion = useContentStore((state) => state.updateSuggestion);
  const resetFlow = useContentStore((state) => state.resetFlow);

  useEffect(() => {
    resetFlow();
    if (!inputBox) return;

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
      nextQuery !== null ? updateSuggestion(nextQuery, getCaretRect(inputBox)) : resetFlow();
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
  }, [triggerKey, inputBox, updateSuggestion, resetFlow]);
}
