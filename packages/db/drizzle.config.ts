import type { Config } from "drizzle-kit";

import { env } from "./env";

const nonPoolingUrl = env.DATABASE_URL;

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  tablesFilter: ["teso_*"],
} satisfies Config;
