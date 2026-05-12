import { defineConfig } from "eslint/config";
import tseslint from 'typescript-eslint';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSecurity from 'eslint-plugin-security';

export default defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': eslintPluginUnusedImports,
      'simple-import-sort': eslintPluginSimpleImportSort,
      'security': eslintPluginSecurity,
    },
    rules: {

      // Security plugin rules
      ...eslintPluginSecurity.configs.recommended.rules,

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Unused imports cleanup
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import sorting
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // Code style
      'arrow-body-style': ['warn', 'as-needed'],
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single', { "avoidEscape": true }],
      "object-curly-spacing": ["warn", "always"],
          // Require consistent indentation of 4 spaces 
      "indent": ["warn", 4, { "SwitchCase": 1 }],
      "linebreak-style": ["warn", "unix"],
      "comma-dangle": ["warn", "always-multiline"],
      "keyword-spacing": ["warn", { "before": true, "after": true }],
      "comma-spacing": ["warn", { "before": false, "after": true }],
      "space-before-blocks": ["warn", "always"],
      "space-before-function-paren": ["warn", { "anonymous": "never", "named": "never", "asyncArrow": "always" }],
      
    },
  },
]);
