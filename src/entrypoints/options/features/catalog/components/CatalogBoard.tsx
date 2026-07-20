import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { LazyMotion } from 'motion/react';
import { generateKeyBetween } from 'fractional-indexing';
import { updateItem, updateCategory } from '@/utils/storage';

const loadFeatures = () => import('../features').then((res) => res.default);

export const CatalogBoard = () => {
  return (
    <LazyMotion features={loadFeatures}>
      <DragDropProvider>

      </DragDropProvider>
    </LazyMotion>
  );
};
