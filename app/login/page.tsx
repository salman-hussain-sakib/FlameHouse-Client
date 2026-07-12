'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Flame, ShieldAlert, KeyRound, Mail, User, CheckCircle2 } from 'lucide-react';

function LoginFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, demoLogin, user } = useAuth();

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  
  const redirectPath = searchParams.get('redirect') || '/';

  
  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      setSuccessMsg('Successfully signed in! Redirecting...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } else {
      setFormError('Invalid email or password. Try the demo buttons below!');
    }
  };

  
  const handleDemoTrigger = async (role: 'user' | 'admin') => {
    setFormError('');
    setSuccessMsg('');
    setSubmitting(true);
    const success = await demoLogin(role);
    setSubmitting(false);

    if (success) {
      setSuccessMsg(`Logged in as ${role === 'admin' ? 'Chef Admin' : 'Alex Customer'}! Redirecting...`);
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } else {
      setFormError('Demo login failed. Check your credentials or MongoDB connection.');
    }
  };

  return (
    <div className="w-full bg-[#0f0907] min-h-[80vh] py-12 px-6 flex items-center justify-center relative overflow-hidden">
      {}
      <div className="absolute top-[20%] left-[-20%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-20%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      {}
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-white/5 relative z-10">
        
        {}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <Flame className="h-7 w-7 text-red-500 animate-pulse" />
            <span className="text-xl font-bold tracking-wider text-white">
              FLAME<span className="text-orange-500">HOUSE</span>
            </span>
          </Link>
          <h2 className="text-xl md:text-2xl font-black text-white">Sign In To Your Account</h2>
          <p className="text-xs text-zinc-400">Unlock easy tracking, orders history, and recipe additions.</p>
        </div>

        {}
        {formError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs mb-5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs mb-5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {}
          <button
            type="submit"
            disabled={submitting}
            className="btn-jelly w-full py-3.5 text-xs font-bold uppercase tracking-wider mt-2 cursor-pointer"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
          <span className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-bold">Or Instant Demo Access</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoTrigger('user')}
              className="glass-panel-light hover:bg-white/10 border border-white/10 rounded-xl py-3 px-3 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-orange-500" /> Demo User
            </button>
            <button
              onClick={() => handleDemoTrigger('admin')}
              className="glass-panel-light hover:bg-white/10 border border-white/10 rounded-xl py-3 px-3 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-red-500" /> Demo Admin
            </button>
          </div>
          <div className="text-[10px] text-center text-zinc-500 flex flex-col gap-1 leading-normal">
            <span>User: user@flamehouse.com (password123)</span>
            <span>Admin: admin@flamehouse.com (admin123)</span>
          </div>
        </div>

        {}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link href={`/register?redirect=${redirectPath}`} className="text-red-500 hover:text-red-400 font-bold hover:underline transition-all">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading login credentials...</span>
      </div>
    }>
      <LoginFormClient />
    </Suspense>
  );
}
