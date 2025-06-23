import react from '@vitejs/plugin-react-swc';
import { defineConfig  } from 'vitest/config';
import svgr from "vite-plugin-svgr";
export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    include: ['**/*.test.tsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8'
    },
  },
});
