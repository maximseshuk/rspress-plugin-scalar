import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'react', 'import', 'unicorn', 'oxc'],
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
    pedantic: 'off',
    style: 'off',
    restriction: 'off',
    nursery: 'off',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-default-export': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-underscore-dangle': ['warn', { allow: ['__dirname', '__filename'] }],
  },
  ignorePatterns: ['dist', 'node_modules', 'docs'],
})
