import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/viteapp/', // Replace <repository-name> with your repo name
  plugins: [react()],
});
