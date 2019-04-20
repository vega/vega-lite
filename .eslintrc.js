module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    // "prettier/@typescript-eslint",  TODO: do we need this?
    "plugin:prettier/recommended"
  ],
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    project: "tsconfig.json",
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": "error",
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-use-before-define": "off",
    // "@typescript-eslint/prefer-for-of": 1,  wait for release
    "@typescript-eslint/no-for-in-array": 1,
    "@typescript-eslint/no-require-imports": 1,
    "@typescript-eslint/no-parameter-properties": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false
      }
    ],
    "@typescript-eslint/no-object-literal-type-assertion": [
      "error",
      {
        allowAsParameter: true
      }
    ],
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    // https://eslint.org/docs/rules/
    "linebreak-style": ["error", "unix"],
    "no-alert": 1,
    "no-undef": 0, // typescript takes care of this for us
    "no-console": 0
  }
};
