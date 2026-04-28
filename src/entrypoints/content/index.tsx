import { render } from 'preact';
import ContentApp from './ContentApp';
import '@/assets/tailwind.css';

export default defineContentScript({
  matches: [
    'https://*.chatgpt.com/*',
    'https://gemini.google.com/*',
    'https://claude.ai/*',
    'https://grok.com/*',
    'https://copilot.microsoft.com/*',
    'https://*.github.com/*',
    'https://*.deepseek.com/*',
  ],
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
