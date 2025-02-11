/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 120,
  proseWrap: 'never',
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        bracketSpacing: false,
        singleQuote: true,
        arrowParens: 'avoid',
        trailingComma: 'none',
      },
    },
  ],
};

export default config;
