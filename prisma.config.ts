// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    // Tell Prisma 7 to use tsx to run our seed file
    seed: "npx tsx prisma/seed.ts", 
  },
});