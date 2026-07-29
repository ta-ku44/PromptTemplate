import { memo } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import * as m from 'motion/react-m';
import { ItemBar } from './ItemBar';
import { updateCategory, deleteCategory } from '@/utils/storage';
import { useCatalogStore } from '../stores/useCatalogStore';

const EmptyCategorySlot = () => {

}

type CategoryHeaderProps = {
  categoryId: string;
  index: number;
  onEditItem: (itemId: string) => void;
  onAddItem: (categoryId: string) => void;
};

export const CategoryHeader = memo(({ categoryId, index, onEditItem, onAddItem }: CategoryHeaderProps) => {
  const { ref, handleRef, isDragging } = useSortable({ id: categoryId, index, type: 'category' });
  const category = useCatalogStore((state) => state.categories[categoryId]);
  const itemIds = useCatalogStore((state) => state.itemIdsByCategory[categoryId]);

  return (
    <m.div ref={ref} layout={true}>

    </m.div>
  )
});
