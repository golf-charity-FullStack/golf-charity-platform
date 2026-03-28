"use client";

import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const handleActivate = () => {
    console.log("Button clicked!");
    // We navigate immediately, ignoring the background errors for now
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-12 rounded-3xl border border-zinc-800 text-center max-w-sm">
        <span className="text-fuchsia-500 font-black italic text-xs mb-4 uppercase">Step 2: Activation</span>
        <h2 className="text-6xl font-black italic mb-8">$19/MO</h2>
        
        <button 
          onClick={handleActivate}
          className="w-full bg-white text-black font-black italic py-4 rounded-xl uppercase hover:bg-fuchsia-500 hover:text-white transition-all shadow-2xl"
        >
          Activate & Enter Dashboard
        </button>
        
        <p className="mt-4 text-[10px] text-zinc-600 uppercase font-black">
          If navigation fails, check browser console
        </p>
      </div>
    </div>
  );
}