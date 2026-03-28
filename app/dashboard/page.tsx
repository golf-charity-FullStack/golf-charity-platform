"use client";

import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-12">
        <div className="text-2xl font-black italic uppercase tracking-tighter">
          Hero <span className="text-fuchsia-500">Dashboard</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white tracking-widest">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Account Status</h3>
            <p className="text-3xl font-black italic text-fuchsia-500">ACTIVE</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Current Points</h3>
            <p className="text-3xl font-black italic">0.00</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Live Pool Share</h3>
            <p className="text-3xl font-black italic">$19.00</p>
          </div>
        </div>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 p-16 rounded-[40px] text-center">
          <h2 className="text-5xl font-black italic uppercase mb-4 tracking-tighter">Welcome to the Club</h2>
          <p className="text-zinc-500 max-w-md mx-auto font-medium">
            Your profile is currently running in bypass mode. All systems are green.
          </p>
        </section>
      </main>
    </div>
  );
}