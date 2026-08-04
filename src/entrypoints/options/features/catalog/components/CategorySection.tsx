import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom';
import type { Transition, TargetAndTransition } from 'motion/react';
import * as m from 'motion/react-m';
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import { ItemBar } from './ItemBar';
import { useCatalogStore } from '../stores/useCatalogStore';

const COLLAPSED: TargetAndTransition = { height: 0, opacity: 0 };
const EXPANDED: TargetAndTransition = { height: 'auto', opacity: 1 };
const COLLAPSE_TRANSITION: Transition = { duration: 0.2, ease: 'easeInOut' };

const SENSORS = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 5 }),
      new PointerActivationConstraints.Delay({ value: 200, tolerance: 10 }),
    ],
  }),
];

const EmptyCategorySlot = ({ categoryId }: { categoryId: string }) => {
  const { ref, isDropTarget } = useDroppable({ id: categoryId, type: 'category-slot', collisionPriority: 1 });

  return <li ref={ref} className={isDropTarget ? 'border border-dashed' : ''}></li>;
};

type CategorySectionProps = {
  categoryId: string;
  index: number;
  onEditItem: (itemId: string) => void;
  onAddItem: (categoryId: string) => void;
};

export const CategorySection = memo(({ categoryId, index, onEditItem, onAddItem }: CategorySectionProps) => {
  const { category, itemIds, isExpanded, toggleExpand } = useCatalogStore(
    useShallow((state) => ({
      category: state.categories[categoryId],
      itemIds: state.itemIdsByCategory[categoryId],
      isExpanded: !state.collapsedIds.has(categoryId),
      toggleExpand: state.toggleExpand,
    })),
  );
  const { ref, handleRef } = useSortable({ id: categoryId, index, type: 'category', data: category, sensors: SENSORS });

  return (
    <m.section ref={ref} layout={true} className="flex flex-col overflow-hidden rounded-md border bg-muted">
      <header
        ref={handleRef}
        onClick={() => toggleExpand(categoryId)}
        className={`flex cursor-grab items-center gap-2 border-b p-3 transition-colors duration-200 active:cursor-grabbing ${isExpanded ? 'border-border' : 'border-transparent'}`}
      >
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
        />
        <span className="cursor-text" onPointerDown={(e) => e.stopPropagation()}>
          {category.name}
        </span>
        <button onClick={(e) => e.stopPropagation()} className="mr-1.5 ml-auto">
          <Trash2 size={16} />
        </button>
      </header>

      <m.div animate={isExpanded ? EXPANDED : COLLAPSED} transition={COLLAPSE_TRANSITION} className="overflow-hidden">
        <div className="flex flex-col gap-2.5 px-3 py-2.5">
          <ul className="flex flex-col gap-1">
            {itemIds.length > 0 ? (
              itemIds.map((i) => <ItemBar key={i} itemId={i} onEditRequest={onEditItem} />)
            ) : (
              <EmptyCategorySlot categoryId={categoryId} />
            )}
          </ul>
          <button
            onClick={() => onAddItem(categoryId)}
            className="flex items-center justify-center gap-1 rounded-md border border-dashed p-2 text-sm text-muted-foreground"
          >
            <Plus size={14} />
            <span>テンプレートの追加</span>
          </button>
        </div>
      </m.div>
    </m.section>
  );
});
