import { useState, useEffect, useMemo } from 'preact/hooks';
import { useKeyBind } from '../hooks';
import { Category, Item } from '@/types/catalog';
import { CursorPosition } from '../utils/inputBox';

interface SuggestProps {
  items: Item[];
  categories: Category[];
  position: CursorPosition | null;
  onSelect: (item: Item) => void;
}

export default function Suggest({ items, categories, position, onSelect }: SuggestProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

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

  const isVisible = items.length > 0 && position !== null;

  useKeyBind({ key: 'ArrowDown', enabled: isVisible, onKeyDown: () => setFocusedIndex((i) => Math.min(i + 1, flatItems.length - 1)) });
  useKeyBind({ key: 'ArrowUp', enabled: isVisible, onKeyDown: () => setFocusedIndex((i) => Math.max(i - 1, 0)) });
  useKeyBind({ key: 'Tab', enabled: isVisible, onKeyDown: () => onSelect(flatItems[focusedIndex]) });

  if (items.length === 0 || position === null) return null;
  let flatIndex = 0;

  return (
    <div
      className="pointer-events-auto fixed max-h-80 min-w-72 overflow-y-auto overscroll-none rounded-sm border border-[#969799] bg-white p-3 shadow-lg"
      style={{ top: position.top + position.height, left: position.left }}
    >
      {categories.map((category) => (
        <div className="mb-3 last:mb-0" key={category.id}>
          <span className="mb-1 text-xs font-medium text-[#A2A5AB]">{category.name.toLocaleUpperCase()}</span>
          <div>
            {itemsByCategory.get(category.id)?.map((item) => {
              const index = flatIndex++;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`block w-full border-b border-[#E9E9E9] px-2 py-1.5 text-left font-normal text-[#212B50] ${index === focusedIndex ? 'bg-[#ddeeff]' : 'hover:bg-[#ECF5FF]'}`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
