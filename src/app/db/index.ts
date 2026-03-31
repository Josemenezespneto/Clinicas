import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/app/db/schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
