import { memo, useRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import * as m from 'motion/react-m';
import { useCatalogStore } from '../stores/useCatalogStore';

type ItemBarProps = {
  itemId: string;
  onEditRequest: (itemId: string) => void;
};

export const ItemBar = memo(({ itemId, onEditRequest }: ItemBarProps) => {
  const elementRef = useRef<HTMLLIElement>(null);
  const item = useCatalogStore((state) => state.items[itemId]);
  useDraggable({ id: itemId, type: 'item', element: elementRef, data: item });
  useDroppable({ id: itemId, type: 'item', element: elementRef });

  return (
    <m.li ref={elementRef} layout={true}>
      <button type="button" onClick={() => onEditRequest(itemId)}>
        {item.name}
      </button>
    </m.li>
  );
});
