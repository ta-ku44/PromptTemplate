import { defineConfig, type WxtViteConfig } from 'wxt';
import type { Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Automatically inject the Preact JSX runtime into JSX files within the content script directory
function preactForContentScripts(): Plugin {
  return {
    name: 'preact-content-scripts',
    transform(code, id) {
      if (!/[\\/]content[\\/]/.test(id) || !/\.[jt]sx$/.test(id)) return null;
      return { code: `/* @jsxImportSource preact */\n${code}`, map: null };
    },
  };
}

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  vite: (): WxtViteConfig => ({
    plugins: [tailwindcss(), preactForContentScripts()],
  }),
  manifest: {
    name: 'Prompt Library',
    description: 'Prompt management tool — save, organize, and quickly insert your frequently used prompts.',
    version: '0.0.1',
    permissions: ['storage', 'tabs'],
  },
  srcDir: 'src',
});
