import { useSortable } from '@dnd-kit/react/sortable';
import * as m from 'motion/react-m';
import { updateCategory, deleteCategory } from '@/utils/storage';
import type { Category, Item } from '@/types/catalog';

type CategoryHeaderProps = {
  category: Category;
  index: number;
  items?: Item[];
  onEditItem?: (item: Item) => void;
};

export const CategoryHeader = ({ category, index, items, onEditItem }: CategoryHeaderProps) => {
  const { ref, handleRef, isDragging } = useSortable({ id: category.id, index, type: 'category' });

  return (
    <m.div ref={ref} layout={true}>

    </m.div>
  )
};
