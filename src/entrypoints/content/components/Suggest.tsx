import { useState, useEffect, useMemo } from 'preact/hooks';
import { useContentStore } from '../stores/useContentStore';
import { useKeyBind } from '../hooks';
import type { CSSProperties } from 'preact';
import type { Category, Item } from '@/types/catalog';

interface SuggestProps {
  items: Item[];
  categories: Category[];
  onSelect: (item: Item) => void;
  style: CSSProperties;
}

export default function Suggest({ items, categories, onSelect, style }: SuggestProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const resetFlow = useContentStore((state) => state.resetFlow);

  useEffect(() => {
    setFocusedIndex(0);
  }, [items]);

  const itemsByCategory = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.id, [] as Item[]]));
    for (const item of items) {
      map.get(item.categoryId)?.push(item);
    }
    return map;
  }, [items, categories]);

  const flatItems = useMemo(
    () => categories.flatMap((cat) => itemsByCategory.get(cat.id) ?? []),
    [categories, itemsByCategory],
  );

  useKeyBind({ key: 'ArrowDown', onKeyDown: () => setFocusedIndex((i) => Math.min(i + 1, flatItems.length - 1)) });
  useKeyBind({ key: 'ArrowUp', onKeyDown: () => setFocusedIndex((i) => Math.max(i - 1, 0)) });
  useKeyBind({ key: 'Tab', onKeyDown: () => onSelect(flatItems[focusedIndex]) });
  useKeyBind({ key: 'Escape', onKeyDown: () => resetFlow() });

  if (items.length === 0) return null;
  let flatIndex = 0;

  return (
    <div className="pointer-events-auto fixed" style={style}>
      <ul role="listbox" className="max-h-80 min-w-72 overflow-y-auto overscroll-none rounded-sm border bg-card p-3 shadow-sm">
        {categories.map((category) => (
          <li className="mb-3 last:mb-0" key={category.id} role="group" aria-labelledby={`category-${category.id}`}>
            <span id={`category-${category.id}`} className="mb-1 text-xs font-medium text-foreground-muted uppercase">
              {category.name}
            </span>
            <ul>
              {itemsByCategory.get(category.id)?.map((item) => {
                const index = flatIndex++;
                return (
                  <li key={item.id} className="border-b">
                    <button type="button" role="option" aria-selected={index === focusedIndex} onClick={() => onSelect(item)} className={`block w-full px-2 py-1.5 text-left font-normal ${index === focusedIndex ? 'bg-sky-100' : 'hover:bg-accent'}`}>
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
