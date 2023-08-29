import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from '@rollup/plugin-terser';

import typescript2 from "rollup-plugin-typescript2";

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  input: "./index.ts", // 表示以哪个文件作为打包的入口
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs", // 表示统一模块规范 esm,cjs,iife, umd(统一模块规范 cjs+amd)
      sourcemap: true, // 将es6转化为es5后的源码调试 (希望可以调试)
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript2({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      useTsconfigDeclarationDir: true,
    }),
    terser(),
  ],
});