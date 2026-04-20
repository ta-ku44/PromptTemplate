import { useEffect, useState } from 'preact/hooks';
import { getTextContent, detectTrigger, getCursorPosition, type CursorPosition } from '../utils/inputBox';

export function useTriggerInput(inputBox: HTMLElement | null, triggerKey: string) {
  const [query, setQuery] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<CursorPosition | null>(null);

  useEffect(() => {
    if (!inputBox) {
      setQuery(null);
      setCursorPos(null);
      return;
    }

    const handler = () => {
      setQuery(detectTrigger(getTextContent(inputBox), triggerKey));
      setCursorPos(getCursorPosition(inputBox));
    };

    inputBox.addEventListener('input', handler);
    inputBox.addEventListener('keydown', handler);
    return () => {
      inputBox.removeEventListener('input', handler);
      inputBox.removeEventListener('keydown', handler);
    };
  }, [triggerKey, inputBox]);

  return { query, cursorPos };
}
