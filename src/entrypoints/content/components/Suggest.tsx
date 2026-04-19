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
      className="pointer-events-auto fixed max-h-80 min-w-72 overflow-y-auto rounded-sm border border-[#969799] bg-white p-2 shadow-lg"
      style={{ top: position.top + position.height, left: position.left }}
    >
      {categories.map((category) => (
        <div key={category.id}>
          <span className="text-sm font-medium text-[#A2A5AB]">{category.name.toLocaleUpperCase()}</span>
          <div>
            {itemsByCategory.get(category.id)?.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className="block w-full px-2 py-1 text-left font-normal text-[#212B50] hover:bg-[#ECF5FF]"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
