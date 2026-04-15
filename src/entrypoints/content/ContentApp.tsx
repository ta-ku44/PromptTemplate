import { createContext } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useCatalog, useInputBox, useTriggerQuery } from './hooks';
import Suggest from './components/Suggest';
import Modal from './components/Modal';
import AnchorLink from './components/AnchorLink';

export const PortalTargetContext = createContext<HTMLElement | null>(null);

export default function ContentApp({ portalTarget }: { portalTarget: HTMLElement }) {
  const { items, categories } = useCatalog();
  const { inputBox, inputBoxRef } = useInputBox();

  // TODO: triggerKey should be customizable
  const query = useTriggerQuery(inputBox, '#');

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
    <PortalTargetContext.Provider value={portalTarget}>
      <Suggest items={filteredItems} categories={filteredCategories} onSelect={() => {}} />
      <Modal />
      <AnchorLink />
    </PortalTargetContext.Provider>
  );
}
