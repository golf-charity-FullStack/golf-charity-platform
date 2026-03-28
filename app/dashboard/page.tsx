'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// --- Precise Interfaces (No 'any') ---
interface Score { id: string; score: number; date_played: string; }
interface WonDraw { id: string; title: string; matches: number; }
interface DrawRes { draw_id: string; winning_numbers: number[]; draws: { title: string } | null; }

export default function Dashboard() {
  const router = useRouter();
  
  // FIXED: Lines 11 & 13 (Proper Typing)
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [wonDraw, setWonDraw] = useState<WonDraw | null>(null);
  
  const [isRejected, setIsRejected] = useState(false);
  const [scoreIn, setScoreIn] = useState('');
  const [dateIn, setDateIn] = useState('');
  const [proof, setProof] = useState('');

  const fetchDash = async (uid: string) => {
    // 1. Rolling 5 Logic
    const { data: s } = await supabase.from('scores').select('*').eq('user_id', uid).order('date_played', { ascending: false }).limit(5);
    setScores((s as Score[]) || []);

    // 2. Winner Detection
    const { data: c } = await supabase.from('winner_verifications').select('draw_id, status').eq('user_id', uid);
    const approved = c?.filter(i => i.status === 'approved').map(i => i.draw_id) || [];
    const pending = c?.filter(i => i.status === 'pending').map(i => i.draw_id) || [];
    const rejected = c?.filter(i => i.status === 'rejected').map(i => i.draw_id) || [];

    const { data: r } = await supabase.from('draw_results').select('draw_id, winning_numbers, draws(title)');
    if (r) {
      let foundWin: WonDraw | null = null;
      (r as unknown as DrawRes[]).forEach(res => {
        if (!approved.includes(res.draw_id) && !pending.includes(res.draw_id)) {
          const matches = res.winning_numbers.filter(n => (s || []).map(sc => sc.score).includes(n)).length;
          if (matches >= 3) {
            foundWin = { id: res.draw_id, title: res.draws?.title || 'Draw', matches };
            if (rejected.includes(res.draw_id)) setIsRejected(true);
          }
        }
      });
      setWonDraw(foundWin);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      const { data: p } = await supabase.from('profiles').select('subscription_status').eq('id', session.user.id).single();
      if (p?.subscription_status !== 'active') return router.push('/pricing');
      setUser(session.user);
      fetchDash(session.user.id);
    };
    init();
  }, [router]);

  // FIXED: Line 56 (Strict Event Typing)
  const addScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(scoreIn);
    if (!user || val < 1 || val > 45) return;

    await supabase.from('scores').insert([{ user_id: user.id, score: val, date_played: dateIn }]);
    
    // ENFORCE 5-SCORE LIMIT
    const { data: all } = await supabase.from('scores').select('id').eq('user_id', user.id).order('date_played', { ascending: false });
    if (all && all.length > 5) {
      await supabase.from('scores').delete().in('id', all.slice(5).map(i => i.id));
    }
    
    setScoreIn(''); setDateIn(''); fetchDash(user.id);
  };

  const submitClaim = async () => {
    if (!proof || !wonDraw || !user) return;
    await supabase.from('winner_verifications').upsert([{ 
      draw_id: wonDraw.id, 
      user_id: user.id, 
      proof_url: proof, 
      status: 'pending' 
    }], { onConflict: 'draw_id,user_id' });
    setWonDraw(null);
    fetchDash(user.id);
  };

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center font-black italic text-zinc-900">CHECKING...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-12 border-b border-zinc-900 pb-10">Dashboard</h1>
        
        {wonDraw && (
          <div className={`mb-12 p-12 bg-gradient-to-br ${isRejected ? 'from-red-600 to-black' : 'from-fuchsia-600 to-amber-600'} rounded-[4rem] border-2 border-white/20 animate-pulse`}>
            <span className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 block w-fit">Tier {wonDraw.matches === 5 ? '1' : wonDraw.matches === 4 ? '2' : '3'} Winner</span>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-6">{isRejected ? 'RE-UPLOAD PROOF' : 'YOU WON!'}</h2>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <input value={proof} onChange={e => setProof(e.target.value)} placeholder="Proof Link..." className="flex-1 bg-black/40 border border-white/20 p-5 rounded-3xl text-sm focus:outline-none" />
              <button onClick={submitClaim} className="bg-white text-black font-black px-12 py-5 rounded-3xl uppercase text-xs">Claim</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-zinc-900/40 p-12 rounded-[3.5rem] border border-zinc-800">
            <h2 className="text-2xl font-black italic uppercase mb-10">Log Score</h2>
            <form onSubmit={addScore} className="space-y-6">
              <input type="number" placeholder="Score (1-45)" required value={scoreIn} onChange={e => setScoreIn(e.target.value)} className="w-full p-6 bg-black border border-zinc-800 rounded-3xl text-xl font-bold" />
              <input type="date" required value={dateIn} onChange={e => setDateIn(e.target.value)} className="w-full p-6 bg-black border border-zinc-800 rounded-3xl" />
              <button type="submit" className="w-full bg-blue-600 py-6 rounded-[2rem] font-black uppercase text-sm">Save</button>
            </form>
          </div>
          <div className="bg-zinc-900/40 p-12 rounded-[3.5rem] border border-zinc-800">
            <h2 className="text-2xl font-black italic uppercase mb-10">Latest 5 History</h2>
            {scores.map(s => <div key={s.id} className="w-full flex justify-between p-4 border-b border-zinc-800 font-bold italic text-zinc-400"><span>{s.date_played}</span><span className="text-fuchsia-500 font-black">{s.score}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}