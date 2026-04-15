import { useState, useEffect, useRef } from 'preact/hooks';
import { DomObserver } from '../utils/domObserver';

export function useInputBox() {
  const [inputBox, setInputBox] = useState<HTMLElement | null>(null);
  const inputBoxRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new DomObserver({
      onFound: (el) => {
        inputBoxRef.current = el;
        setInputBox(el);
      },
      onLost: () => {
        inputBoxRef.current = null;
        setInputBox(null);
      },
    });
    observer.start();
    return () => observer.stop();
  }, []);

  return { inputBox, inputBoxRef };
}
