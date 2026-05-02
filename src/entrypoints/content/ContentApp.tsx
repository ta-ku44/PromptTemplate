import { useMemo } from 'preact/hooks';
import { useCatalog, useInputBox, useTriggerInput } from './hooks';
import { injectPrompt, parseVariables } from './utils/inputBox';
import { useContentStore } from './stores/useContentStore';
import type { Item } from '@/types/catalog';
import Suggest from './components/Suggest';
import Modal from './components/Modal';
import AnchorLink from './components/AnchorLink';

export default function ContentApp() {
  const { items, categories } = useCatalog();
  const { inputBox, inputBoxRef } = useInputBox();
  const chooseItem = useContentStore((state) => state.chooseItem);

  // TODO: triggerKey should be customizable
  const { query, caretPos } = useTriggerInput(inputBox, '#');

  const filteredItems = useMemo(() => {
    if (query === null) return [];
    const lowerQuery = query.toLowerCase();
    return query === '' ? items : items.filter((item) => item.name.toLowerCase().includes(lowerQuery));
  }, [query, items]);

  const filteredCategories = useMemo(() => {
    const ids = new Set(filteredItems.map((item) => item.categoryId));
    return categories.filter((category) => ids.has(category.id));
  }, [filteredItems, categories]);

  const handleChooseItem = (item: Item) => {
    const entries = parseVariables(item.content);
    injectPrompt(inputBoxRef.current, item.content, '#');
    chooseItem(item, entries);
  };

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full">
      {cursorPos && filteredItems.length > 0 && (
        <div className="pointer-events-auto" style={{ top: cursorPos.top + cursorPos.height, left: cursorPos.left }}>
          <Suggest items={filteredItems} categories={filteredCategories} onSelect={handleChooseItem} />
        </div>
      )}
      <Modal />
      <AnchorLink />
    </div>
  );
}
