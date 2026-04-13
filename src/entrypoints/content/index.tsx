/* @jsxImportSource preact */
import { render } from 'preact';
import ContentApp from './contentApp';
import '@/assets/tailwind.css';

export default defineContentScript({
  matches: [
    'https://*.chatgpt.com/*',
    'https://gemini.google.com/*',
    'https://claude.ai/*',
    'https://grok.com/*',
  ],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'prompt-library',
      position: 'inline',
      anchor: 'body',
      onMount(container, shadow) {
        const root = document.createElement('div');
        container.append(root);
        const portalTarget = shadow.querySelector('body')!;
        render(<ContentApp portalTarget={portalTarget} />, root);
        return root;
      },
      onRemove(root) {
        render(null, root!);
      },
    });
    ui.mount();
  },
});
