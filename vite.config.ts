import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed as a GitHub Pages project site at https://clique-imnu.github.io/Website/
// so all asset/route URLs are served from the /Website/ base. For a custom domain
// served from the root, change this back to '/'.
export default defineConfig({
  base: '/Website/',
  plugins: [react()],
});
