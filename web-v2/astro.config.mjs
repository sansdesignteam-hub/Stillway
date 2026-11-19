// @ts-check
import { defineConfig } from 'astro/config';

// Stillway Home V2 (D-059). Static output, same as V1 (D-023).
// `..` is allowed so image masters can be read straight from ../design later,
// keeping the Visual Director's files the single source of truth.
export default defineConfig({
  output: 'static',
  vite: {
    server: { fs: { allow: ['..'] } },
  },
});
