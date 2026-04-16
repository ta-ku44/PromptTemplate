export { generateKeyBetween, generateNKeysBetween } from 'fractional-indexing';

export function sortByFractionalIndex<T extends { fractionalIndex: string }>(items: T[]): T[] {
  return items.sort((a, b) => a.fractionalIndex.localeCompare(b.fractionalIndex));
}
