'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Draw { id: string; title: string; draw_date: string; status: string; }
interface Verification { id: string; status: string; proof_url: string; user_id: string; draws: { title: string } | null; }

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, scores: 0 });
  const [drawsList, setDrawsList] = useState<Draw[]>([]);
  const [queue, setQueue] = useState<Verification[]>([]);
  
  const pool = (stats.users * 19) * 0.5;

  const fetchData = async () => {
    const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: s } = await supabase.from('scores').select('*', { count: 'exact', head: true });
    setStats({ users: u || 0, scores: s || 0 });
    
    const { data: d } = await supabase.from('draws').select('*').order('draw_date', { ascending: false });
    setDrawsList((d as Draw[]) || []);

    const { data: v } = await supabase.from('winner_verifications').select('id, status, proof_url, user_id, draws(title)');
    if (v) setQueue(v as unknown as Verification[]);
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      const { data: p } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
      if (!p?.is_admin) router.push('/dashboard'); else fetchData();
    };
    check();
  }, [router]);

  const runDraw = async (id: string) => {
    const winners = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);
    await supabase.from('draw_results').insert([{ draw_id: id, winning_numbers: winners }]);
    await supabase.from('draws').update({ status: 'completed' }).eq('id', id);
    alert(`Winning Numbers: ${winners.join(', ')}`); fetchData();
  };

  const processClaim = async (id: string, s: string) => {
    await supabase.from('winner_verifications').update({ status: s }).eq('id', id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black italic uppercase text-fuchsia-500 mb-12 border-b border-zinc-900 pb-8">Admin Control</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800"><p className="text-zinc-600 text-[10px] font-black uppercase mb-1">Pool Revenue</p><p className="text-3xl font-black italic">${pool.toFixed(2)}</p></div>
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 border-t-4 border-emerald-500"><p className="text-emerald-500 text-[10px] font-black uppercase mb-1">Tier 1 (40%)</p><p className="text-3xl font-black italic">${(pool * 0.4).toFixed(2)}</p></div>
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 border-t-4 border-purple-500"><p className="text-purple-500 text-[10px] font-black uppercase mb-1">Tier 2 (35%)</p><p className="text-3xl font-black italic">${(pool * 0.35).toFixed(2)}</p></div>
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 border-t-4 border-amber-500"><p className="text-amber-500 text-[10px] font-black uppercase mb-1">Tier 3 (25%)</p><p className="text-3xl font-black italic">${(pool * 0.25).toFixed(2)}</p></div>
        </div>
        <div className="bg-zinc-900/30 p-12 rounded-[3rem] border border-zinc-800 mb-12">
          <h2 className="font-black italic uppercase mb-8 tracking-widest text-zinc-500">Lottery Management</h2>
          {drawsList.map(d => (
            <div key={d.id} className="flex justify-between items-center p-4 border-b border-zinc-800 font-bold text-xs">
              <span className="italic uppercase">{d.title}</span>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase">{d.status}</span>
                {d.status !== 'completed' && <button onClick={() => runDraw(d.id)} className="bg-white text-black px-4 py-2 rounded-xl italic font-black uppercase">Execute</button>}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900/30 p-12 rounded-[3rem] border border-zinc-800">
          <h2 className="font-black italic uppercase mb-8 tracking-widest text-zinc-500">Claims Queue</h2>
          {queue.filter(q => q.status === 'pending').map(q => (
            <div key={q.id} className="flex justify-between items-center p-4 border-b border-zinc-800 italic">
              <span>{q.draws?.title}</span>
              <div className="flex gap-2">
                <button onClick={() => processClaim(q.id, 'approved')} className="bg-emerald-600 px-4 py-2 rounded-xl uppercase text-[10px] font-black italic">Approve</button>
                <button onClick={() => processClaim(q.id, 'rejected')} className="bg-red-600 px-4 py-2 rounded-xl uppercase text-[10px] font-black italic">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}