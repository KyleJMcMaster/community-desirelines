// vite.config.js or similar
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('pkey.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
  },
build: {
    sourcemap: true,
  }
});