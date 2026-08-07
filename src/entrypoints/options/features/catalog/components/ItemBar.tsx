import { memo, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
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
  const { item, overEdge } = useCatalogStore(useShallow((state) => ({
    item: state.items[itemId],
    overEdge: state.activeType === 'item' && state.overId === itemId ? state.edge : null,
  })));
  const { handleRef, isDragSource } = useDraggable({ id: itemId, type: 'item', element: elementRef, data: item });
  useDroppable({ id: itemId, type: 'item', element: elementRef });

  return (
    <m.li
      ref={elementRef}
      layout={true}
      className={`relative flex items-center gap-2 rounded-md border bg-card p-3 transition-opacity duration-200 select-none ${isDragSource ? 'opacity-40' : ''}`}
    >
      {/* ドラッグ中のアイテムの上に、ドロップ先の境界線を表示する */}
      {overEdge && !isDragSource && (
        <div className={`absolute inset-x-0 h-0.5 rounded-full bg-primary ${overEdge === 'top' ? '-top-1' : '-bottom-1'}`}/>
      )}

      <GripVertical
        ref={handleRef}
        size={18}
        className="cursor-grab transition-colors duration-200 hover:text-primary active:cursor-grabbing"
      />
      <span className="cursor-text" onDoubleClick={() => {}}>
        {item.name}
      </span>
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
