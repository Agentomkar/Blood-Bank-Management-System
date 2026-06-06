import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createMissingDatabaseProxy() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("DATABASE_URL is required");
      },
    }
  ) as ReturnType<typeof drizzle>;
}

export const pool = databaseUrl
  ? globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    })
  : undefined;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = pool ? drizzle(pool) : createMissingDatabaseProxy();
