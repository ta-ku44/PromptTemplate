import { useEffect, useState } from 'preact/hooks';
import { getTextContent, detectTrigger } from '../utils/inputBox';

export function useTriggerQuery(inputBox: HTMLElement | null, triggerKey: string) {
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!inputBox) {
      setQuery(null);
      return;
    }

    const handler = () => {
      const text = getTextContent(inputBox);
      const triggerQuery = detectTrigger(text, triggerKey);
      setQuery(triggerQuery);
    };

    inputBox.addEventListener('input', handler);
    return () => {
      inputBox.removeEventListener('input', handler);
      setQuery(null);
    };
  }, [triggerKey, inputBox]);

  return query;
}
