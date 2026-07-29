import { useCallback, useEffect, useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { LazyMotion } from 'motion/react';
import { CategoryHeader } from './CategoryHeader';
import { useCatalog } from '@/hooks';
import { useCatalogStore } from '../stores/useCatalogStore';
import { generateKeyBetween } from 'fractional-indexing';
import { updateItem, updateCategory } from '@/utils/storage';
import type { EditTarget } from './PromptEditModal';

const loadFeatures = () => import('../features').then((res) => res.default);

export const CatalogBoard = () => {
  const catalog = useCatalog();
  const syncCatalog = useCatalogStore((state) => state.syncCatalog);
  const categoryIds = useCatalogStore((state) => state.categoryIds);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  useEffect(() => {
    syncCatalog(catalog);
  }, [catalog, syncCatalog]);

  const handleAddItem = useCallback((categoryId: string) => setEditTarget({ mode: 'create', categoryId }), []);
  const handleEditItem = useCallback((itemId: string) => setEditTarget({ mode: 'edit', itemId }), []);

  return (
    <LazyMotion features={loadFeatures}>
      <DragDropProvider>

      </DragDropProvider>
    </LazyMotion>
  );
};
