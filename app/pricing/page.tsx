'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function PricingPage() {
  const router = useRouter();
  const activate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/signup');
    await supabase.from('profiles').update({ subscription_status: 'active' }).eq('id', session.user.id);
    router.push('/dashboard');
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-sm w-full bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 text-center">
        <p className="text-fuchsia-500 text-[10px] font-black uppercase tracking-widest mb-4">Standard Membership</p>
        <h1 className="text-6xl font-black italic mb-10">$19<span className="text-xl text-zinc-700">/mo</span></h1>
        <button onClick={activate} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase text-xs italic hover:bg-fuchsia-400 transition-colors">Activate Plan</button>
      </div>
    </div>
  );
}