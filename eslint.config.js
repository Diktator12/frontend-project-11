import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

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
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'eol-last': ['error', 'always'],
  },
});
