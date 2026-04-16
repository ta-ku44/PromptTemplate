import { storage } from '#imports';
import { nanoid } from 'nanoid';
import { generateKeyBetween, sortByFractionalIndex } from '@/utils/fractionalIndex';
import { Item, Category, Catalog } from '@/types/catalog';
import { DEFAULT_CATALOG, DEFAULT_SETTINGS } from './defaultData';

export const catalog = storage.defineItem<Catalog>('local:catalog', { defaultValue: DEFAULT_CATALOG, version: 1 });
async function getCatalogField<T extends keyof Catalog>(key: T): Promise<Catalog[T]> {
  const data = await catalog.getValue();
  return data[key];
}
async function setCatalogField<T extends keyof Catalog>(key: T, value: Catalog[T]): Promise<void> {
  const data = await catalog.getValue();
  await catalog.setValue({ ...data, [key]: value });
}

export function watchCatalog(callback: (catalog: Catalog) => void) {
  return catalog.watch((data) => {
    callback(data);
  });
}

export async function setCatalog(newCatalog: Catalog): Promise<void> {
  await catalog.setValue(newCatalog);
}

export function getCatalog() {
  return catalog.getValue();
}

export async function resetCatalog() {
  await catalog.setValue(DEFAULT_CATALOG);
}

export async function getItem(id: string): Promise<Item | undefined> {
  const items = await getCatalogField('items');
  return new Map(items.map((i) => [i.id, i])).get(id);
}

export async function addItem(item: Omit<Item, 'id' | 'fractionalIndex'>) {
  const category = await getCategory(item.categoryId);
  if (!category) throw new Error('Category not found');

  const items = await getCatalogField('items');

  // 同一のカテゴリ内での順序から計算
  const categoryItems = sortByFractionalIndex(items.filter((i) => i.categoryId === item.categoryId));
  const lastItem = categoryItems[categoryItems.length - 1];

  const newItem: Item = {
    id: nanoid(),
    ...item,
    fractionalIndex: generateKeyBetween(lastItem?.fractionalIndex, null),
  };
  await setCatalogField('items', [...items, newItem]);
}

export async function updateItem(id: string, updatedFields: Partial<Omit<Item, 'id' | 'fractionalIndex'>>) {
  if (updatedFields.categoryId) {
    const category = await getCategory(updatedFields.categoryId);
    if (!category) throw new Error('Category not found');
  }

  const items = await getCatalogField('items');

  const map = new Map(items.map((i) => [i.id, i]));
  const existing = map.get(id);
  if (!existing) throw new Error('Item not found');

  map.set(id, { ...existing, ...updatedFields });
  await setCatalogField('items', [...map.values()]);
}

export async function deleteItem(id: string) {
  const items = await getCatalogField('items');

  const map = new Map(items.map((i) => [i.id, i]));
  if (!map.has(id)) throw new Error('Item not found');

  map.delete(id);
  await setCatalogField('items', [...map.values()]);
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const categories = await getCatalogField('categories');
  return new Map(categories.map((c) => [c.id, c])).get(id);
}

export async function addCategory(category: Omit<Category, 'id' | 'fractionalIndex'>) {
  const categories = await getCatalogField('categories');

  const sortedCategories = sortByFractionalIndex(categories);
  const lastCategory = sortedCategories[sortedCategories.length - 1];

  const newCategory: Category = {
    id: nanoid(),
    ...category,
    fractionalIndex: generateKeyBetween(lastCategory?.fractionalIndex, null),
  };
  await setCatalogField('categories', [...categories, newCategory]);
}

export async function updateCategory(id: string, updatedFields: Partial<Omit<Category, 'id' | 'fractionalIndex'>>) {
  const categories = await getCatalogField('categories');

  const map = new Map(categories.map((c) => [c.id, c]));
  const existing = map.get(id);
  if (!existing) throw new Error('Category not found');

  map.set(id, { ...existing, ...updatedFields });
  await setCatalogField('categories', [...map.values()]);
}

export async function deleteCategory(id: string) {
  const categories = await getCatalogField('categories');

  const map = new Map(categories.map((c) => [c.id, c]));
  if (!map.has(id)) throw new Error('Category not found');

  map.delete(id);
  await setCatalogField('categories', [...map.values()]);
}
