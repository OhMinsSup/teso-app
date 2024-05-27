import baseConfig from "@teso/eslint-config/base";
import reactConfig from "@teso/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
