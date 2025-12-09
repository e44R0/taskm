import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      // Базовый алиас для всех путей с @
      '@': path.resolve(__dirname, './src'),
      // Или если нужно точное соответствие:
      '@/db': path.resolve(__dirname, './src/db'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  test: {
    // your vitest options
    globals: true,
    environment: 'node',
  },
});
