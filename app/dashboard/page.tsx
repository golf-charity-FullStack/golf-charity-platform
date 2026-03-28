"use client";

import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-12">
        <div className="text-2xl font-black italic uppercase tracking-tighter">
          Hero <span className="text-fuchsia-500">Dashboard</span>
        </div>
        <Link href="/" className="text-xs font-bold uppercase text-zinc-500 hover:text-white">
          Back to Home
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-zinc-500 text-xs font-black uppercase mb-2">Account Status</h3>
            <p className="text-2xl font-black italic text-fuchsia-500">ACTIVE</p>
          </div>

          {/* Points Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-zinc-500 text-xs font-black uppercase mb-2">Current Points</h3>
            <p className="text-2xl font-black italic">0.00</p>
          </div>

          {/* Prize Pool Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-zinc-500 text-xs font-black uppercase mb-2">Live Pool Share</h3>
            <p className="text-2xl font-black italic">$19.00</p>
          </div>
        </div>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center">
          <h2 className="text-4xl font-black italic uppercase mb-4">Welcome to the Club</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            You have successfully bypassed the routing errors. Your dashboard is now live.
          </p>
        </section>
      </main>
    </div>
  );
}