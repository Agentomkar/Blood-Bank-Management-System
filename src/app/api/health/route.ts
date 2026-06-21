import { db } from "@/db";
import { sql } from "drizzle-orm";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, any> = {
    status: "ok",
    database: {
      connected: false,
      configured: !!process.env.DATABASE_URL,
      driver: process.env.DATABASE_URL ? "postgresql" : "pglite",
    },
    googleAI: {
      configured: !!process.env.GOOGLE_API_KEY,
      model: process.env.GOOGLE_AI_MODEL || "gemini-2.0-flash",
    },
    supabase: {
      configured: isSupabaseConfigured(),
      env: {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await db.execute(sql`select 1`);
    checks.database.connected = true;
  } catch (err) {
    checks.database.connected = false;
    checks.database.error = err instanceof Error ? err.message : "Unknown error";
    if (!process.env.DATABASE_URL) {
      checks.database.error = "DATABASE_URL is not set in the environment.";
    }
    checks.status = "degraded";
  }

  const statusCode = checks.status === "ok" ? 200 : 503;
  return Response.json(checks, { status: statusCode });
}