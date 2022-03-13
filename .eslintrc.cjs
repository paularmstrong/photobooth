'use strict';

module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'preact'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/**', '**/dist/**'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'react-hooks/exhaustive-deps': 'off',
    'jest/valid-expect': 'off',
    'no-duplicate-imports': 'off',
  },
  overrides: [
    {
      files: ['*.cjs'],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
        impliedStrict: false,
      },
      rules: {
        strict: 'off',
      },
    },
  ],
  settings: {
    jest: {
      version: '26',
    },
  },
};
