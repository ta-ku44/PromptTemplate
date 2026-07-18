import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { LazyMotion } from 'motion/react';
import { updateItem, updateCategory } from '@/utils/storage';
import { generateKeyBetween } from 'fractional-indexing';

const loadFeatures = () => import('motion/react').then((res) => res.domAnimation);

export const CatalogBoard = () => {
  return (
    <LazyMotion features={loadFeatures}>
      <DragDropProvider>

      </DragDropProvider>
    </LazyMotion>
  );
};
