import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Prompt Library',
    description: 'Prompt management tool — save, organize, and quickly insert your frequently used prompts.',
    version: '0.0.1',
    permissions: ['storage', 'tabs'],
  },
  hooks: {
    'vite:build:extendConfig': (eps, config) => {
      if (!eps.some((ep) => ep.type === 'content-script')) return;
      config.resolve = {
        ...config.resolve,
        alias: { ...config.resolve?.alias, react: 'preact/compat', 'react-dom': 'preact/compat' },
      };
    },
  },
  srcDir: 'src',
});
