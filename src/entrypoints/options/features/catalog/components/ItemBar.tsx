import { useDraggable, useDroppable } from '@dnd-kit/react';
import * as m from 'motion/react-m';
import { updateItem, deleteItem } from '@/utils/storage';
import { useShallow } from 'zustand/shallow';
import type { Item } from '@/types/catalog';

type ItemBarProps = {
  item: Item;
  onEditRequest?: (itemId: string) => void;
};

export const ItemBar = ({ item, onEditRequest }: ItemBarProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { ref: dragRef } = useDraggable({ id: item.id, type: 'item', element: elementRef });
  const { ref: dropRef } = useDroppable({ id: item.id, type: 'item', element: elementRef });

  return (
    <m.div ref={elementRef} layout={true}>
      <></>
    </m.div>
  );
};