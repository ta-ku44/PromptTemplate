import { useState, useEffect, useMemo } from 'preact/hooks';
import { useCatalog, useInputBox, useTriggerInput } from './hooks';
import Suggest from './components/Suggest';
import Modal from './components/Modal';
import AnchorLink from './components/AnchorLink';

export default function ContentApp() {
  const { items, categories } = useCatalog();
  const { inputBox, inputBoxRef } = useInputBox();

  // TODO: triggerKey should be customizable
  const { query, cursorPos } = useTriggerInput(inputBox, '#');

  const filteredItems = useMemo(() => {
    if (query === null) return [];
    const lowerQuery = query.toLowerCase();
    return query === '' ? items : items.filter((item) => item.name.toLowerCase().includes(lowerQuery));
  }, [query, items]);

  const filteredCategories = useMemo(() => {
    const ids = new Set(filteredItems.map((item) => item.categoryId));
    return categories.filter((category) => ids.has(category.id));
  }, [filteredItems, categories]);

  return (
    <div className="pointer-events-none fixed top-0 left-0 h-full w-full">
      <Suggest items={filteredItems} categories={filteredCategories} position={cursorPos} onSelect={() => {}} />
      <Modal />
      <AnchorLink />
    </div>
  );
}
