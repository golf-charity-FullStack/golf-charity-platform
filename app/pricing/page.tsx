import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-center bg-zinc-900 p-12 rounded-3xl border border-zinc-800">
        <span className="text-fuchsia-500 font-black italic text-xs mb-4 uppercase tracking-widest">
          Step 2: Activation
        </span>
        
        <h2 className="text-7xl font-black italic mb-8 tracking-tighter">$19/MO</h2>
        
        <Link href="/dashboard" className="w-full">
          <button className="w-full bg-white text-black font-black italic py-5 rounded-2xl uppercase hover:bg-fuchsia-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
            Activate & Enter Dashboard
          </button>
        </Link>
        
        <p className="mt-6 text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">
          Cancel anytime • Secure payment
        </p>
      </div>
    </div>
  );
}