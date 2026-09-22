import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-bootstrap') || id.includes('node_modules/@restart') || id.includes('node_modules/@popperjs')) return 'ui';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler') || id.includes('node_modules/@remix-run')) return 'react';
        },
      },
    },
  },
  ssr: { noExternal: true },
});
