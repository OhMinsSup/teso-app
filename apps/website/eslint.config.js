import baseConfig, { restrictEnvAccess } from "@veloss/eslint-config/base";
import nextjsConfig from "@veloss/eslint-config/nextjs";
import reactConfig from "@veloss/eslint-config/react";

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
