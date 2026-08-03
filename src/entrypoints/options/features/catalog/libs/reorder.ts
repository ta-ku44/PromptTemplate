import { generateKeyBetween } from '@/utils/fractionalIndex';

export type Edge = 'top' | 'bottom' | null;

export const insertIndex = (ids: string[], overId: string, edge: Edge): number =>
  ids.indexOf(overId) + (edge === 'bottom' ? 1 : 0);

export const keyForInsertion = (
  ids: string[],
  entities: Record<string, { fractionalIndex: string }>,
  index: number,
): string =>
  generateKeyBetween(entities[ids[index - 1]]?.fractionalIndex ?? null, entities[ids[index]]?.fractionalIndex ?? null);
