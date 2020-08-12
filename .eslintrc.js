module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "preact",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  rules: {
    "react-hooks/rules-of-hooks": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
