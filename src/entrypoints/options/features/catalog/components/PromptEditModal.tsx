import { useCatalogStore } from '../stores/useCatalogStore';

export type EditTarget =
  | { mode: 'edit'; itemId: string }
  | { mode: 'create'; categoryId: string };

type PromptEditModalProps = {
  target: EditTarget | null;
  onClose: () => void;
};

export const PromptEditModal = ({ target, onClose }: PromptEditModalProps) => {
  const item = useCatalogStore((state) => (target?.mode === 'edit' ? state.items[target.itemId] : undefined));

  return (
    <dialog open className="modal">

    </dialog>
  )
};
