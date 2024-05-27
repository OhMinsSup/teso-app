import baseConfig, { restrictEnvAccess } from "@teso/eslint-config/base";
import nextjsConfig from "@teso/eslint-config/nextjs";
import reactConfig from "@teso/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
