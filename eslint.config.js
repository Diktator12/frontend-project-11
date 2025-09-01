import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig({
  files: ['**/*.{js,mjs,cjs}'],
  languageOptions: {
    globals: globals.browser,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: { js },
  extends: ['js/recommended'],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'no-extra-semi': 'error',
    'arrow-parens': ['error', 'as-needed']
  }
})
