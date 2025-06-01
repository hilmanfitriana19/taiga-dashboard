import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/taiga-dashboard/", // Menyesuaikan base path
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
