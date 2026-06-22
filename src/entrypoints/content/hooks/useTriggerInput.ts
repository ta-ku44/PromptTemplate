import { useEffect, useRef, useState } from 'preact/hooks';
import { useContentStore } from '../stores/useContentStore';
import { getTextBeforeCursor, detectTrigger, getCaretPosition, type CaretPosition } from '../utils/inputBox';

export function useTriggerInput(inputBox: HTMLElement | null, triggerKey: string) {
  const [query, setQuery] = useState<string | null>(null);
  const [caretPos, setCaretPos] = useState<CaretPosition | null>(null);
  const openSuggest = useContentStore((state) => state.openSuggest);
  const resetFlow = useContentStore((state) => state.resetFlow);

  useEffect(() => {
    if (!inputBox) {
      setQuery(null);
      setCaretPos(null);
      return;
    }

    // TODO: Some editors emit events without meaningful content changes; investigate and restore appropriate change-detection guards.
    const handler = () => {
      const nextQuery = detectTrigger(getTextBeforeCursor(inputBox), triggerKey);
      setQuery(nextQuery);
      setCaretPos(getCaretPosition(inputBox));
      nextQuery !== null ? openSuggest() : resetFlow();
    };

    // TODO: Revisit input/keydown event handling and define clear trigger behavior for suggestion open/close states.
    inputBox.addEventListener('input', handler);
    inputBox.addEventListener('keydown', handler);
    return () => {
      inputBox.removeEventListener('input', handler);
      inputBox.removeEventListener('keydown', handler);
    };
  }, [triggerKey, inputBox, openSuggest, resetFlow]);

  return { query, caretPos };
}
