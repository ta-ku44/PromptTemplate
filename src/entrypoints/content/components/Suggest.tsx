import { useMemo } from 'preact/hooks';
import { Category, Item } from '@/types/catalog';
import { CursorPosition } from '../utils/inputBox';

interface SuggestProps {
  items: Item[];
  categories: Category[];
  position: CursorPosition | null;
  onSelect: (item: Item) => void;
}

export default function Suggest({ items, categories, position, onSelect }: SuggestProps) {
  if (items.length === 0 || !position) return null;

  const itemsByCategory = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat.id, [] as Item[]]));
    for (const item of items) {
      map.get(item.categoryId)?.push(item);
    }
    return map;
  }, [items, categories]);

  return (
    <div
      className="pointer-events-auto fixed z-2147483647 min-w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5"
      style={{ top: position.top + position.height, left: position.left }}
    >
      {categories.map((category) => (
        <div key={category.id}>
          <span>{category.name}</span>
          <div>
            {itemsByCategory.get(category.id)?.map((item) => (
              <button key={item.id} type="button" onClick={() => onSelect(item)}>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
