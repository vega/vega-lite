module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.ts']
    }
  ],
  rules: {
    'prettier/prettier': 'warn',
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true
      }
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/ban-ts-comment': 'off', // we need it in a few places
    'jest/no-conditional-expect': 'off',
    // https://eslint.org/docs/rules/
    'linebreak-style': ['error', 'unix'],
    'no-irregular-whitespace': ['error', {skipComments: true}],
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-return-assign': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    // "prefer-template": "error",  // we can do this later
    'no-console': 'off', // we use console
    'no-undef': 'off', // typescript takes care of this for us
    'no-unreachable': 'off' // typescript takes care of this for us
  }
};
