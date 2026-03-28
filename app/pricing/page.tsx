"use client";

import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const handleActivate = () => {
    console.log("Navigation initiated...");
    
    // First attempt: Standard Next.js navigation
    router.push('/dashboard');

    // Second attempt: Fallback force-navigation if router is stuck
    setTimeout(() => {
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-12 rounded-3xl border border-zinc-800 text-center shadow-2xl">
        <span className="text-fuchsia-500 font-black italic text-xs mb-4 uppercase tracking-widest block">
          Step 2: Activation
        </span>
        
        <h2 className="text-7xl font-black italic mb-8 tracking-tighter">$19/MO</h2>
        
        <button 
          onClick={handleActivate}
          className="w-full bg-fuchsia-600 text-white font-black italic py-5 rounded-2xl uppercase hover:bg-white hover:text-black transition-all transform hover:scale-105 active:scale-95 shadow-2xl border-2 border-fuchsia-600"
        >
          Activate & Enter Dashboard
        </button>
        
        <p className="mt-6 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
          Bypassing Database Checks...
        </p>
      </div>
    </div>
  );
}