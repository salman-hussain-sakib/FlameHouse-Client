'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HealthPage() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const controller = new AbortController();

    fetch('http://localhost:4000/health', { signal: controller.signal })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Failed')))
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0907] px-6 py-16 text-zinc-100 md:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-red-500/15 p-3 text-red-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-400">System health</p>
            <h1 className="text-3xl font-black">FlameHouse service status</h1>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            {status === 'online' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Activity className="h-4 w-4 text-amber-400" />}
            <span>{status === 'online' ? 'Server is responding' : status === 'offline' ? 'Server is unavailable' : 'Checking server connection...'}</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            This page confirms that the standalone server endpoint is live and ready for integration.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-red-300">
          Back to home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
