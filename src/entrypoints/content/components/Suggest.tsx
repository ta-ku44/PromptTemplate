import { useState, useEffect, useMemo } from 'preact/hooks';
import { useShallow } from 'zustand/react/shallow';
import { useCatalog, useKeyBind } from '../hooks';
import { useContentStore } from '../stores/useContentStore';

export default function Suggest() {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const { items, categories } = useCatalog();
  const { phase, onSelect, resetFlow } = useContentStore(
    useShallow((state) => ({ phase: state.phase, onSelect: state.chooseItem, resetFlow: state.resetFlow })),
  );

  const query = phase.kind === 'suggestion' ? phase.query : null;

  const filteredItems = useMemo(() => {
    if (query === null) return [];
    const lowerQuery = query.toLowerCase();
    return lowerQuery === '' ? items : items.filter((item) => item.name.toLowerCase().includes(lowerQuery));
  }, [items, query]);

  const groups = useMemo(() => {
    return categories
      .map((category) => ({ category, items: filteredItems.filter((i) => i.categoryId === category.id) }))
      .filter((group) => group.items.length > 0);
  }, [categories, filteredItems]);

  const flatItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const focusedId = flatItems[focusedIndex]?.id;

  useEffect(() => {
    setFocusedIndex(0);
  }, [filteredItems]);

  useKeyBind({ key: 'ArrowDown', onKeyDown: () => setFocusedIndex((p) => Math.min(p + 1, flatItems.length - 1)) });
  useKeyBind({ key: 'ArrowUp', onKeyDown: () => setFocusedIndex((p) => Math.max(p - 1, 0)) });
  useKeyBind({ key: 'Tab', onKeyDown: () => focusedId && onSelect(flatItems[focusedIndex]) });
  useKeyBind({ key: 'Escape', onKeyDown: () => resetFlow() });

  if (phase.kind !== 'suggestion' || !phase.caretPosition || groups.length === 0) return null;
  const caretPos = phase.caretPosition;

  return (
    <div className="pointer-events-auto fixed" style={{ top: caretPos.top + caretPos.height, left: caretPos.left }}>
      <ul role="listbox" className="max-h-80 min-w-72 overflow-y-auto overscroll-none rounded-sm border bg-card p-3 shadow-sm">
        {groups.map(({ category, items }) => (
          <li className="mb-3 last:mb-0" key={category.id} role="group" aria-labelledby={`cat-${category.id}`}>
            <span id={`cat-${category.id}`} className="mb-1 text-xs font-medium text-foreground-muted uppercase">
              {category.name}
            </span>
            <ul>
              {items.map((item) => (
                <li key={item.id} className="border-b">
                  <button type="button" role="option" aria-selected={item.id === focusedId} onClick={() => onSelect(item)} className={`block w-full px-2 py-1.5 text-left font-normal ${item.id === focusedId ? 'bg-sky-100' : 'hover:bg-accent'}`}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
