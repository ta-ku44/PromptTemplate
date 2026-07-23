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

  // TODO: トリガーキーを設定から取得するようにする
  useTriggerInput(inputBox, '#');

  useEffect(() => {
    if (kind !== 'injecting') return;
    const { phase, resetFlow } = useContentStore.getState();
    if (inputBoxRef.current && phase.kind === 'injecting') injectPrompt(inputBoxRef.current, phase.text, '#');
    resetFlow();
  }, [kind]);

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full">
      <Suggest />
      <Modal />
      <AnchorLink />
    </div>
  );
}
