'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Flame, ShieldAlert, KeyRound, Mail, User, CheckCircle2 } from 'lucide-react';

function RegisterFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user } = useAuth();

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const success = await register(name, email, password);
    setSubmitting(false);

    if (success) {
      setSuccessMsg('Account registered successfully! Redirecting to menu...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } else {
      setFormError('This email is already registered. Try signing in instead!');
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
          <h2 className="text-xl md:text-2xl font-black text-white">Create An Account</h2>
          <p className="text-xs text-zinc-400">Join our club to save custom recipes and place order tracks.</p>
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
            <label className="text-xs font-bold text-zinc-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Smith"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

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
                placeholder="alex@example.com"
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
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
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
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href={`/login?redirect=${redirectPath}`} className="text-red-500 hover:text-red-400 font-bold hover:underline transition-all">
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-[#0f0907] min-h-[80vh] flex items-center justify-center">
        <span className="text-sm text-zinc-400 animate-pulse">Loading registration fields...</span>
      </div>
    }>
      <RegisterFormClient />
    </Suspense>
  );
}
