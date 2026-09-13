// https://docs.expo.dev/guides/using-eslint/
// ESLint flat config — Expo SDK 57 / ESLint 9
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Global ignores — must be a standalone entry in ESLint 9 flat config
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.expo/**',
      // macOS sidecar files, created because the drive is not HFS+
      '**/._*',
      // Pre-existing boilerplate — not modified in Phase 1
      'src/hooks/use-color-scheme.web.ts',
      'src/hooks/use-color-scheme.ts',
    ],
  },
  expoConfig,
  {
    rules: {
      // No implicit any — matches 24_AI_BUILD_GUIDE.md §14
      '@typescript-eslint/no-explicit-any': 'warn',
      // No console.log in production code — matches 24_AI_BUILD_GUIDE.md §29
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);
