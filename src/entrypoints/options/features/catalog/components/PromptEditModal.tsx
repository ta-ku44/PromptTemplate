import { useRef, useEffect } from 'react';
import { useCatalogStore } from '../stores/useCatalogStore';

export type EditTarget = { mode: 'edit'; itemId: string } | { mode: 'create'; categoryId: string };

type PromptEditModalProps = {
  target: EditTarget | null;
  onClose: () => void;
};

export const PromptEditModal = ({ target, onClose }: PromptEditModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const item = useCatalogStore((state) => (target?.mode === 'edit' ? state.items[target.itemId] : undefined));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (target && !dialog.open) dialog.showModal();
    if (!target && dialog.open) dialog.close();
  }, [target]);

  return (
    <dialog ref={ref} onClose={onClose} className="modal">
      <></>
    </dialog>
  );
};
