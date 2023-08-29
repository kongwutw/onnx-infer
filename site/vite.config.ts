import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
const mdPlugin = require("vite-plugin-markdown");

import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const base = process.env.PUBLIC_PATH || '/';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const alias: any = command === 'serve' ? 
    { 
      '@onnx-infer/core': path.resolve(__dirname, '../packages/core'),
      '@onnx-infer/webgl': path.resolve(__dirname, '../packages/webgl'),
      '@onnx-infer/utils': path.resolve(__dirname, '../packages/utils'),
      "util": false,
      "os": false,
      "buffer": false,
    }
    : {};
  return {
    base,
    build: {
      minify: true,
      outDir: path.resolve(__dirname, '../dist')
    },
    plugins: [
      vue(), 
      ReactivityTransform(),
      mdPlugin.plugin({
        mode: ["html", "vue"],
      }),
    ],
    resolve: {
      alias,
    },
    server: {
      open: true,
      host: '0.0.0.0',
      port: 9000,
      proxy: {
        '/api': {
          target: 'xxx',
          changeOrigin: true,
        },
      },
    },
  };
});