import { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { LazyMotion } from 'motion/react';
import { CategorySection } from './CategorySection';
import { useCatalog } from '@/hooks';
import { useCatalogStore } from '../stores/useCatalogStore';
import { insertIndex, keyForInsertion } from '../libs/reorder';
import { updateItem, updateCategory } from '@/utils/storage';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/react';
import type { EditTarget } from './PromptEditModal';

const loadFeatures = () => import('../features').then((res) => res.default);

export const CatalogBoard = () => {
  const catalog = useCatalog();
  const { syncCatalog, categoryIds, startDrag, setOver, endDrag } = useCatalogStore(
    useShallow((state) => ({
      syncCatalog: state.syncCatalog,
      categoryIds: state.categoryIds,
      startDrag: state.startDrag,
      setOver: state.setOver,
      endDrag: state.endDrag,
    })),
  );
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const handleAddItem = useCallback((categoryId: string) => setEditTarget({ mode: 'create', categoryId }), []);
  const handleEditItem = useCallback((itemId: string) => setEditTarget({ mode: 'edit', itemId }), []);

  useEffect(() => {
    syncCatalog(catalog);
  }, [catalog, syncCatalog]);

  const handleDragStart = (event: DragStartEvent) => {
    const { source } = event.operation;
    if (!source) return;
    startDrag(String(source.id), source.type as 'item' | 'category');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { target, position } = event.operation;
    if (!target || !target.shape) {
      setOver(null, null, null);
      return;
    }
    const edge = position.current.y < target.shape.center.y ? 'top' : 'bottom';
    setOver(String(target.id), target.type as 'item' | 'category' | 'category-slot', edge);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { activeId, activeType, overId, overType, edge, categories, items, itemIdsByCategory } =
      useCatalogStore.getState();
    endDrag(event.canceled);
    if (event.canceled || !activeId || !overId) return;

    if (activeType === 'category' && overType === 'category') {
      const siblingIds = categoryIds.filter((id) => id !== activeId);
      const fractionalIndex = keyForInsertion(siblingIds, categories, insertIndex(siblingIds, overId, edge));
      updateCategory(activeId, { fractionalIndex });
      return;
    }

    if (activeType === 'item') {
      const targetCategoryId = overType === 'item' ? items[overId]?.categoryId : overId;
      if (!targetCategoryId) return;

      const siblingIds = (itemIdsByCategory[targetCategoryId] ?? []).filter((id) => id !== activeId);
      const index = overType === 'item' ? insertIndex(siblingIds, overId, edge) : 0;
      const fractionalIndex = keyForInsertion(siblingIds, items, index);
      updateItem(activeId, { categoryId: targetCategoryId, fractionalIndex });
    }
  };

  return (
    <LazyMotion features={loadFeatures}>
      <DragDropProvider onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="mx-auto flex max-w-2xl flex-col gap-2.5">
          {categoryIds.map((c, i) => (
            <CategorySection key={c} categoryId={c} index={i} onEditItem={handleEditItem} onAddItem={handleAddItem} />
          ))}
        </div>
        <DragOverlay>
          {(source) => {
            const data = source.data as { name: string } | undefined;
            return data ? <div>{data.name}</div> : null;
          }}
        </DragOverlay>
      </DragDropProvider>
    </LazyMotion>
  );
};
