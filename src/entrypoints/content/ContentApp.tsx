import { createContext } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import Suggest from './components/Suggest';
import Modal from './components/Modal';
import AnchorLink from './components/AnchorLink';
import useCatalog from './hooks/useCatalog';

export const PortalTargetContext = createContext<HTMLElement | null>(null);

export default function ContentApp({ portalTarget }: { portalTarget: HTMLElement }) {
  const { items, categories } = useCatalog();

  return (
    <PortalTargetContext.Provider value={portalTarget}>
      <Suggest items={[]} categories={[]} onSelect={() => {}} />
      <Modal />
      <AnchorLink />
    </PortalTargetContext.Provider>
  );
}
