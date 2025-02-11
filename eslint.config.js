import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import vitest from 'eslint-plugin-vitest';

delete globals.browser['AudioWorkletGlobalScope '];

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    ignores: ['build/**', 'coverage/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ['src/**/*.ts'],
    plugins: {
      vitest
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser
      }
    },
    settings: {
      vitest: {
        typecheck: true
      }
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'prettier/prettier': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-duplicate-type-constituents': 'warn',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'linebreak-style': ['error', 'unix'],
      'no-irregular-whitespace': ['error', {skipComments: true}],
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-return-assign': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'prefer-template': 'error',
      'no-unused-vars': 'off',
      // "no-undef": "off", // typescript takes care of this for us
      'no-unreachable': 'off' // typescript takes care of this for us
    }
  },
  prettierConfig,
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      'prefer-template': 'warn'
    }
  }
];
