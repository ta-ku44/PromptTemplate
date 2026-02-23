import { init } from './contentApp';

export default defineContentScript({
  matches: [
    'https://*.chatgpt.com/*'
  ],
  main(ctx) {
    init();
  },
});
