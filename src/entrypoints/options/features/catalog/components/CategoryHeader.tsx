import { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import * as m from 'motion/react-m';
import { ItemBar } from './ItemBar';
import { useCatalogStore } from '../stores/useCatalogStore';

const EmptyCategorySlot = ({ categoryId }: { categoryId: string }) => {
  const { ref, isDropTarget } = useDroppable({ id: categoryId, type: 'category-slot', collisionPriority: 1 });

  return (
    <li ref={ref} className={isDropTarget ? 'border border-dashed' : ''}>
      ここにドラッグしてアイテムを追加
    </li>
  );
};

type CategoryHeaderProps = {
  categoryId: string;
  index: number;
  onEditItem: (itemId: string) => void;
  onAddItem: (categoryId: string) => void;
};

export const CategoryHeader = memo(({ categoryId, index, onEditItem, onAddItem }: CategoryHeaderProps) => {
  const { category, itemIds, isExpanded, toggleExpand } = useCatalogStore(
    useShallow((state) => ({
      category: state.categories[categoryId],
      itemIds: state.itemIdsByCategory[categoryId],
      isExpanded: state.expandedIds.has(categoryId),
      toggleExpand: state.toggleExpand,
    })),
  );
  const { ref, handleRef } = useSortable({ id: categoryId, index, type: 'category', data: category });

  return (
    <m.section ref={ref} layout={true}>
      <header>
        <button ref={handleRef} type="button" aria-label="ドラッグして並び替え">
          ⠿
        </button>
        <button type="button" onClick={() => toggleExpand(categoryId)} aria-expanded={isExpanded}>
          {category.name}
        </button>
        <button type="button" onClick={() => onAddItem(categoryId)}>
          追加
        </button>
      </header>

      {isExpanded && (
        <ul>
          {itemIds.map((itemId) => (
            <ItemBar key={itemId} itemId={itemId} onEditRequest={onEditItem} />
          ))}
          {itemIds.length === 0 && <EmptyCategorySlot categoryId={categoryId} />}
        </ul>
      )}
    </m.section>
  );
});
