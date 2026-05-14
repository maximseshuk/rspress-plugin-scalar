import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'
import { pluginPublint } from 'rsbuild-plugin-publint'

export default defineConfig({
  source: {
    entry: {
      index: ['./src/index.ts'],
      'runtime/index': ['./src/runtime/index.tsx'],
    },
  },
  lib: [
    {
      format: 'esm',
      dts: true,
      bundle: true,
      syntax: 'es2022',
      autoExternal: true,
    },
  ],
  output: {
    target: 'node',
    distPath: { root: './dist' },
    copy: [{ from: './src/theme.css', to: './theme.css' }],
    externals: [/^virtual-/],
  },
  plugins: [pluginReact(), pluginPublint()],
})
