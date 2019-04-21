module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    // project: "tsconfig.json", // makes things slow, see https://github.com/typescript-eslint/typescript-eslint/issues/389
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": "warn",
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-use-before-define": "off",
    // "@typescript-eslint/prefer-for-of": 1, // wait for release
    // "@typescript-eslint/no-for-in-array": 1, // requires type information
    "@typescript-eslint/no-require-imports": 1,
    "@typescript-eslint/no-parameter-properties": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true
      }
    ],
    "@typescript-eslint/no-object-literal-type-assertion": [
      "error",
      {
        allowAsParameter: true
      }
    ],
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/no-namespace": 0, // we can do this later
    // https://eslint.org/docs/rules/
    "linebreak-style": ["error", "unix"],
    "no-irregular-whitespace": ["error", { skipComments: true }],
    "no-alert": 1,
    "prefer-const": 1,
    "no-return-assign": 1,
    "no-useless-call": 1,
    "no-shadow": 1,
    "no-useless-concat": 1,
    // "prefer-template": 1,  // we can do this later
    "no-console": 0, // we use console
    "no-undef": 0, // typescript takes care of this for us
    "no-unreachable": 0 // typescript takes care of this for us
  }
};
