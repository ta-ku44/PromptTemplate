import { useCallback, useEffect, useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import type { DragDropEvents } from '@dnd-kit/react';
import { LazyMotion } from 'motion/react';
import { useShallow } from 'zustand/shallow';
import { CategoryHeader } from './CategoryHeader';
import { useCatalog } from '@/hooks';
import { useCatalogStore } from '../stores/useCatalogStore';
import { generateKeyBetween } from 'fractional-indexing';
import { updateItem, updateCategory } from '@/utils/storage';
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

  useEffect(() => {
    syncCatalog(catalog);
  }, [catalog, syncCatalog]);

  const handleAddItem = useCallback((categoryId: string) => setEditTarget({ mode: 'create', categoryId }), []);
  const handleEditItem = useCallback((itemId: string) => setEditTarget({ mode: 'edit', itemId }), []);

  const handleDragStart = (event: Parameters<DragDropEvents['dragstart']>[0]) => {
    const { source } = event.operation;
    if (!source) return;
    startDrag(String(source.id), source.type as 'item' | 'category');
  };

  const handleDragOver = (event: Parameters<DragDropEvents['dragover']>[0]) => {
    const { target, position } = event.operation;
    if (!target || !target.shape) {
      setOver(null, null, null);
      return;
    }
    const edge = position.current.y < target.shape.center.y ? 'top' : 'bottom';
    setOver(String(target.id), target.type as 'item' | 'category' | 'category-slot', edge);
  };

  const handleDragEnd = (event: Parameters<DragDropEvents['dragend']>[0]) => {
    endDrag(event.canceled);
    // TODO: 並び替え後のfractionalIndex計算・updateItem/updateCategoryを実装
  };

  return (
    <LazyMotion features={loadFeatures}>
      <DragDropProvider onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <></>
      </DragDropProvider>
    </LazyMotion>
  );
};
