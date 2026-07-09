import { useEffect, useRef } from 'preact/hooks';
import { useShallow } from 'zustand/shallow';
import { useContentStore } from '../stores/useContentStore';

export default function Modal() {
  const ref = useRef<HTMLDialogElement>(null);
  const { phase, resetFlow } = useContentStore(
    useShallow((state) => ({ phase: state.phase, resetFlow: state.resetFlow })),
  );

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  if (phase.kind !== 'confirming') return null;

  return (
    <dialog ref={ref} onClose={resetFlow} className="pointer-events-auto fixed m-auto">
      
    </dialog>
  );
}
