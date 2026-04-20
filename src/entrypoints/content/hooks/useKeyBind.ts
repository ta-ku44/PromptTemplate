import { useRef, useEffect } from 'preact/hooks';
import { RefObject } from 'preact';

type KeyBindProps = {
  key: KeyboardEvent['key'];
  onKeyDown?: (e: KeyboardEvent) => void;
  targetRef?: RefObject<HTMLElement>;
  enabled?: boolean;
};

export function useKeyBind({ key, onKeyDown, targetRef, enabled = true }: KeyBindProps) {
  const onKeyDownLatest = useLatest(onKeyDown);

  useEffect(() => {
    if (!enabled) return;

    const eventListener = (e: KeyboardEvent) => {
      if (e.key !== key) return;

      e.preventDefault();
      onKeyDownLatest.current?.(e);
    };

    if (targetRef?.current) {
      const target = targetRef.current;
      target.addEventListener('keydown', eventListener);
      return () => target.removeEventListener('keydown', eventListener);
    } else {
      window.addEventListener('keydown', eventListener);
      return () => window.removeEventListener('keydown', eventListener);
    }
  }, [key, targetRef, enabled]);
}

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
