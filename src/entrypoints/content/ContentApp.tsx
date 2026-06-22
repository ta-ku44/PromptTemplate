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
  const phase = useContentStore((state) => state.phase);
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
      {phase.type === 'suggesting' && caretPos && (
        <Suggest
          items={filteredItems}
          categories={filteredCategories}
          onSelect={handleChooseItem}
          style={{ top: caretPos.top + caretPos.height, left: caretPos.left }}
        />
      )}
      <Modal />
      <AnchorLink />
    </div>
  );
}
