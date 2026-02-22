import { storage } from '#imports';
import type { StorageData, Item, Category } from '@/types/storage';
import { DEFAULT_STORAGE_DATA } from './storageDefaults';

const CATEGORIES = 'categories';
const ITEMS = 'items';
const TRIGGER_KEY = 'triggerKey';

const storageDataItem = storage.defineItem<StorageData>('local:storageData', { defaultValue: DEFAULT_STORAGE_DATA });

async function GetStorageValue<K extends keyof StorageData>(key: K): Promise<StorageData[K]> {
  const data = await storageDataItem.getValue();
  return data[key];
}

async function SetStorageValue<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void> {
  const data = await storageDataItem.getValue();
  await storageDataItem.setValue({ ...data, [key]: value });
}

function MoveElement<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function StorageGetAll(): Promise<StorageData> {
  return storageDataItem.getValue();
}

export function StorageSetAll(data: StorageData): Promise<void> {
  return storageDataItem.setValue(data);
}

export function StorageWatch(callback: (newValue: StorageData, oldValue: StorageData | null) => void): () => void {
  return storageDataItem.watch(callback);
}

export async function ItemGet(id: string): Promise<Item | undefined> {
  const items = await GetStorageValue(ITEMS);
  return items.find((i) => i.id === id);
}

export async function ItemAdd(item: Item): Promise<void> {
  const items = await GetStorageValue(ITEMS);
  await SetStorageValue(ITEMS, [...items, item]);
}

export async function ItemUpdate(id: string, partial: Partial<Omit<Item, 'id'>>): Promise<void> {
  const items = await GetStorageValue(ITEMS);
  await SetStorageValue(
    ITEMS,
    items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
  );
}

export async function ItemRemove(id: string): Promise<void> {
  const items = await GetStorageValue(ITEMS);
  await SetStorageValue(
    ITEMS,
    items.filter((i) => i.id !== id),
  );
}

export async function ItemMove(fromIndex: number, toIndex: number): Promise<void> {
  const items = await GetStorageValue(ITEMS);
  await SetStorageValue(ITEMS, MoveElement(items, fromIndex, toIndex));
}

export async function CategoryGet(id: string): Promise<Category | undefined> {
  const categories = await GetStorageValue(CATEGORIES);
  return categories.find((c) => c.id === id);
}

export async function CategoryAdd(category: Category): Promise<void> {
  const categories = await GetStorageValue(CATEGORIES);
  await SetStorageValue(CATEGORIES, [...categories, category]);
}

export async function CategoryUpdate(id: string, partial: Partial<Omit<Category, 'id'>>): Promise<void> {
  const categories = await GetStorageValue(CATEGORIES);
  await SetStorageValue(
    CATEGORIES,
    categories.map((c) => (c.id === id ? { ...c, ...partial } : c)),
  );
}

export async function CategoryRemove(id: string): Promise<void> {
  const categories = await GetStorageValue(CATEGORIES);
  await SetStorageValue(
    CATEGORIES,
    categories.filter((c) => c.id !== id),
  );
}

export async function CategoryMove(fromIndex: number, toIndex: number): Promise<void> {
  const categories = await GetStorageValue(CATEGORIES);
  await SetStorageValue(CATEGORIES, MoveElement(categories, fromIndex, toIndex));
}

export function TriggerKeyGet(): Promise<string> {
  return GetStorageValue(TRIGGER_KEY);
}

export function TriggerKeySet(key: string): Promise<void> {
  return SetStorageValue(TRIGGER_KEY, key);
}
