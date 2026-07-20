import { useRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import * as m from 'motion/react-m';
import { useShallow } from 'zustand/react/shallow';
import { updateItem, deleteItem } from '@/utils/storage';
import type { Item } from '@/types/catalog';

type ItemBarProps = {
  item: Item;
  onEditRequest?: (itemId: string) => void;
};

export const ItemBar = ({ item, onEditRequest }: ItemBarProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useDraggable({ id: item.id, type: 'item', element: elementRef });
  useDroppable({ id: item.id, type: 'item', element: elementRef });

  return (
    <m.div ref={elementRef} layout={true}>
      <></>
    </m.div>
  );
};