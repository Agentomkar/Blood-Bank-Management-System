"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  timestamp: string;
  database: {
    connected: boolean;
    configured: boolean;
    driver?: string;
    error?: string;
  };
  googleAI: {
    configured: boolean;
    model: string;
  };
  supabase: {
    configured: boolean;
    env: {
      NEXT_PUBLIC_SUPABASE_URL: boolean;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
    };
  };
};

export default function HealthPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(
            data?.database?.error || data?.message || `Request failed with ${res.status}`
          );
          setHealth(data);
        } else {
          const data = (await res.json()) as HealthResponse;
          setHealth(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">Deployment Health Check</h1>

      {loading && <p>Loading health data...</p>}

      {error && (
        <div className="rounded-xl border border-red-500 bg-red-900/20 p-4 mb-6">
          <h2 className="text-xl font-semibold text-red-300">Error</h2>
          <p>{error}</p>
        </div>
      )}

      {health && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-600 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold">Overall</h2>
            <p>Status: <strong>{health.status}</strong></p>
            <p>Timestamp: {new Date(health.timestamp).toLocaleString()}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-600 bg-slate-950/70 p-5">
              <h3 className="text-lg font-semibold">Database</h3>
              <p>Configured: {health.database.configured ? "Yes" : "No"}</p>
              <p>Connected: {health.database.connected ? "Yes" : "No"}</p>
              {health.database.driver && <p>Driver: {health.database.driver}</p>}
              {health.database.error && <p className="text-red-300">Error: {health.database.error}</p>}
            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-950/70 p-5">
              <h3 className="text-lg font-semibold">Google AI</h3>
              <p>Configured: {health.googleAI.configured ? "Yes" : "No"}</p>
              <p>Model: {health.googleAI.model}</p>
            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-950/70 p-5 sm:col-span-2">
              <h3 className="text-lg font-semibold">Supabase</h3>
              <p>Configured: {health.supabase.configured ? "Yes" : "No"}</p>
              <p>NEXT_PUBLIC_SUPABASE_URL: {health.supabase.env.NEXT_PUBLIC_SUPABASE_URL ? "Yes" : "No"}</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {health.supabase.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
