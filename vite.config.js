import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ghPages from 'vite-plugin-gh-pages';

// Replace 'your-repo-name' with the actual GitHub repository name
export default defineConfig({
  plugins: [react(), ghPages()],
  base: '/viteapp/', 
});
