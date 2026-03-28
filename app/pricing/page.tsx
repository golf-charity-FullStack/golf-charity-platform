'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function PricingPage() {
  const router = useRouter();

  const activate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');

    const { error } = await supabase.from('profiles').update({ subscription_status: 'active' }).eq('id', session.user.id);
    
    if (!error) {
      router.push('/dashboard');
      router.refresh();
    } else {
      alert("Error activating. Make sure you are logged in.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-800 text-center max-w-sm">
        <h2 className="text-fuchsia-500 font-black mb-2 uppercase text-xs">Step 2: Activation</h2>
        <h1 className="text-5xl font-black italic mb-8">$19/MO</h1>
        <button onClick={activate} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase italic hover:bg-fuchsia-400">Activate & Enter Dashboard</button>
      </div>
    </div>
  );
}