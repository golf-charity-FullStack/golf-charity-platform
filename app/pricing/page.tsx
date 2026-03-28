import Link from 'next/link';

// Inside your Pricing Component's return:
<div className="flex flex-col items-center bg-zinc-900 p-12 rounded-3xl border border-zinc-800">
  <span className="text-fuchsia-500 font-black italic text-xs mb-4 uppercase">Step 2: Activation</span>
  <h2 className="text-6xl font-black italic mb-8">$19/MO</h2>
  
  <Link href="/dashboard" className="w-full">
    <button className="w-full bg-white text-black font-black italic py-4 rounded-xl uppercase hover:bg-zinc-200 transition-all">
      Activate & Enter Dashboard
    </button>
  </Link>
</div>