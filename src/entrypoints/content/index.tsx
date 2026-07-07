import { render } from 'preact';
import ContentApp from './ContentApp';
import { SUPPORTED_LLM_MATCHES } from '@/utils/constants';
import '@/assets/tailwind.css';

export default defineContentScript({
  matches: SUPPORTED_LLM_MATCHES,
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'prompt-library',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const root = document.createElement('div');
        container.append(root);
        render(<ContentApp />, root);
        return root;
      },
      onRemove(root) {
        render(null, root!);
      },
    });
    ui.mount();
  },
});
