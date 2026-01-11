import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],

  srcDir: 'src',

  manifest: {
    name: 'Katalon Recorder',
    description: 'AI-powered test automation recorder',
    version: '7.0.0',

    permissions: ['activeTab', 'tabs', 'storage', 'contextMenus', 'downloads', 'notifications'],

    host_permissions: ['<all_urls>'],

    commands: {
      'toggle-recording': {
        suggested_key: {
          default: 'Alt+Shift+R',
          mac: 'Alt+Shift+R',
        },
        description: 'Start/stop recording',
      },
      'open-panel': {
        suggested_key: {
          default: 'Alt+Shift+K',
          mac: 'Alt+Shift+K',
        },
        description: 'Open Katalon Recorder panel',
      },
    },

    icons: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png',
    },
  },

  // Build for both Chrome MV3 and Firefox MV2
  browser: (process.env.BROWSER as 'chrome' | 'firefox') || 'chrome',
  manifestVersion: process.env.BROWSER === 'firefox' ? 2 : 3,

  // Vite configuration
  vite: () => ({
    css: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
  }),
});
