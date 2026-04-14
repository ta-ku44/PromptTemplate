import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { Suggest, Modal, AnchorLink } from './components';

export const PortalTargetContext = createContext<HTMLElement | null>(null);

export default function ContentApp({ portalTarget }: { portalTarget: HTMLElement }) {
  return (
    <PortalTargetContext.Provider value={portalTarget}>
      <Suggest />
      <Modal />
      <AnchorLink />
    </PortalTargetContext.Provider>
  );
}