import { drizzle as localDrizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";

const queryClient = postgres(process.env.POSTGRES_URL!);

export const db = localDrizzle(queryClient);
