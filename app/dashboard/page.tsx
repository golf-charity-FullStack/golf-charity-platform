"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // If no session found, middleware should handle this, 
        // but this is a safe fallback.
        router.push('/login');
      } else {
        setUserEmail(user.email ?? 'Member');
      }
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-12">
        <div className="text-2xl font-black italic uppercase tracking-tighter">
          Hero <span className="text-fuchsia-500">Dashboard</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white tracking-widest transition-colors">
            Home
          </Link>
          <button 
            onClick={handleSignOut}
            className="text-[10px] font-black uppercase bg-zinc-800 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            Welcome back, <br />
            <span className="text-fuchsia-500 lowercase">{userEmail || '...'}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-colors">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Account Status</h3>
            <p className="text-3xl font-black italic text-fuchsia-500">ACTIVE</p>
          </div>

          {/* Points Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-colors">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Current Points</h3>
            <p className="text-3xl font-black italic">0.00</p>
          </div>

          {/* Prize Pool Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-colors">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Live Pool Share</h3>
            <p className="text-3xl font-black italic">$19.00</p>
          </div>
        </div>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 p-16 rounded-[40px] text-center relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
          
          <h2 className="text-5xl font-black italic uppercase mb-4 tracking-tighter relative z-10">You are in the game</h2>
          <p className="text-zinc-500 max-w-md mx-auto font-medium relative z-10">
            Your subscription is live. Every shot you track from here on out powers charity and your climb up the leaderboard.
          </p>
        </section>
      </main>
    </div>
  );
}