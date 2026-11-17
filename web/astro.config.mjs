// @ts-check
import { defineConfig } from 'astro/config';

// Static output (D-023). Image masters live in ../design so the
// Visual Director's files stay the single source of truth.
export default defineConfig({
  output: 'static',
  vite: {
    server: { fs: { allow: ['..'] } },
  },
});
