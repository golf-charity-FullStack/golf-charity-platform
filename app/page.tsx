'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Using @ alias for cleaner imports

export default function LandingPage() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const getStats = async () => {
      // Fetching count from your profiles table
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!error) setUserCount(count || 0);
    };
    getStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500">
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black italic uppercase tracking-tighter">
          Digital <span className="text-fuchsia-500">Heroes</span>
        </div>
        <div className="flex gap-8 items-center text-[10px] font-black uppercase italic">
          <Link href="/login" className="hover:text-fuchsia-400">Sign In</Link>
          {/* This Link works ONLY if app/signup/page.tsx exists */}
          <Link href="/signup" className="bg-white text-black px-6 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Join Club
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
          Play Golf.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-amber-500">
            Change Lives.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-500 font-medium text-lg mb-12">
          The world&apos;s first subscription platform where your performance powers charity and massive prize pools.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link href="/pricing" className="bg-fuchsia-600 px-12 py-5 rounded-2xl font-black uppercase text-sm italic shadow-2xl hover:scale-105 transition-all">
            Start Now
          </Link>
          <div className="bg-zinc-900 border border-zinc-800 px-8 py-5 rounded-2xl font-black uppercase text-xs italic text-zinc-400">
            Live Pool: <span className="text-white ml-2">${(userCount * 19 * 0.5).toFixed(2)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}