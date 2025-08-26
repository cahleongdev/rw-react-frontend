import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@components', './src/components'],
            ['@containers', './src/containers'],
            ['@helpers', './src/helpers'],
            ['@hooks', './src/hooks'],
            ['@utils', './src/utils'],
            ['@api', './src/api'],
            ['@store', './src/store'],
            ['@constants', './src/constants'],
            ['@theme', './src/theme'],
            ['@layouts', './src/layouts'],
            ['@pages', './src/pages'],
            ['@services', './src/services'],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@/semi': ['error', 'always'],
      '@/quotes': ['error', 'single'],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
