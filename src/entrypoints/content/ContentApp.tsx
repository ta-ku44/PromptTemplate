import { useEffect } from 'preact/hooks';
import { useContentStore } from './stores/useContentStore';
import { useInputBox, useTriggerInput } from './hooks';
import { injectPrompt } from './utils/inputBox';
import Suggest from './components/Suggest';
import Modal from './components/Modal';
import AnchorLink from './components/AnchorLink';

export default function ContentApp() {
  const { inputBox, inputBoxRef } = useInputBox();
  const kind = useContentStore((state) => state.phase.kind);

  // TODO: triggerKey should be customizable
  useTriggerInput(inputBox, '#');

  useEffect(() => {
    if (kind !== 'injecting') return;
    const { phase, resetFlow } = useContentStore.getState();
    if (inputBoxRef.current && phase.kind === 'injecting') injectPrompt(inputBoxRef.current, phase.prompt.content, '#');
    resetFlow();
  }, [kind]);

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full">
      {kind === 'suggestion' && <Suggest />}
      {kind === 'confirming' && <Modal />}
      {kind === 'anchored' && <AnchorLink />}
    </div>
  );
}
