import { memo, useRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import * as m from 'motion/react-m';
import { GripVertical, Trash2, Pencil } from 'lucide-react';
import { useCatalogStore } from '../stores/useCatalogStore';

type ItemBarProps = {
  itemId: string;
  onEditRequest: (itemId: string) => void;
};

export const ItemBar = memo(({ itemId, onEditRequest }: ItemBarProps) => {
  const elementRef = useRef<HTMLLIElement>(null);
  const item = useCatalogStore((state) => state.items[itemId]);
  const { handleRef } = useDraggable({ id: itemId, type: 'item', element: elementRef, data: item });
  useDroppable({ id: itemId, type: 'item', element: elementRef });

  return (
    <m.li ref={elementRef} layout={true} className="flex items-center gap-2 rounded-md border bg-card p-3">
      <GripVertical ref={handleRef} size={18} className="cursor-grab active:cursor-grabbing" />
      <span>{item.name}</span>
      <div className="mr-1.5 ml-auto flex gap-3">
        <button onClick={() => onEditRequest(itemId)}>
          <Pencil size={16} />
        </button>
        <button onClick={() => {}}>
          <Trash2 size={16} />
        </button>
      </div>
    </m.li>
  );
});
