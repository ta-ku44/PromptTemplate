import { useRef, useEffect } from 'preact/hooks';
import { RefObject } from 'preact';
import { useContentStore } from '../stores/useContentStore';

type KeyBindProps = {
  key: KeyboardEvent['key'];
  onKeyDown?: (e: KeyboardEvent) => void;
  targetRef?: RefObject<HTMLElement>;
};

export function useKeyBind({ key, onKeyDown, targetRef }: KeyBindProps) {
  const onKeyDownLatest = useLatest(onKeyDown);

  useEffect(() => {
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
  }, [key, targetRef]);
}

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
