import baseConfig from "@veloss/eslint-config/base";
import reactConfig from "@veloss/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
