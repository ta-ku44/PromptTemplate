import { memo, useRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import * as m from 'motion/react-m';
import { useShallow } from 'zustand/shallow';
import { updateItem, deleteItem } from '@/utils/storage';
import { useCatalogStore } from '../stores/useCatalogStore';

type ItemBarProps = {
  itemId: string;
  onEditRequest: (itemId: string) => void;
};

export const ItemBar = memo(({ itemId, onEditRequest }: ItemBarProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useDraggable({ id: itemId, type: 'item', element: elementRef });
  useDroppable({ id: itemId, type: 'item', element: elementRef });

  const item = useCatalogStore((state) => state.items[itemId]);

  return (
    <m.div ref={elementRef} layout={true}>
      <></>
    </m.div>
  );
});
