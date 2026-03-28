'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// --- Interfaces (Fixes the "any" red lines) ---
interface Score {
  id: string;
  score: number;
  date_played: string;
}

interface Profile {
  subscription_status: string;
  is_admin: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Proper typing instead of <any>
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [scoreIn, setScoreIn] = useState('');
  const [dateIn, setDateIn] = useState('');

  const fetchDash = async (uid: string) => {
    // PRD Section 05: Only fetch the latest 5 scores
    const { data: s, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', uid)
      .order('date_played', { ascending: false })
      .limit(5);

    if (!error) setScores(s || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return router.push('/login');
      }

      // Check subscription status (PRD Section 04/10)
      const { data: p } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single();

      if (p?.subscription_status !== 'active') {
        return router.push('/pricing');
      }

      setUser(session.user);
      fetchDash(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const addScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const val = parseInt(scoreIn);
    
    // PRD Section 05: Score range 1-45
    if (val < 1 || val > 45) {
      alert("Score must be between 1 and 45");
      return;
    }

    await supabase.from('scores').insert([
      { user_id: user.id, score: val, date_played: dateIn }
    ]);
    
    // Rolling logic: ensure only latest 5 are kept
    const { data: all } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .order('date_played', { ascending: false });

    if (all && all.length > 5) {
      const toDelete = all.slice(5).map(i => i.id);
      await supabase.from('scores').delete().in('id', toDelete);
    }
    
    setScoreIn('');
    setDateIn('');
    fetchDash(user.id);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic uppercase">
      Accessing Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase mb-12 tracking-tighter">
          Welcome to the Club.
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800">
            <h2 className="text-2xl font-black italic uppercase mb-8">Log New Score</h2>
            <form onSubmit={addScore} className="space-y-6">
              <input 
                type="number" 
                placeholder="Stableford Score (1-45)" 
                required 
                value={scoreIn} 
                onChange={e => setScoreIn(e.target.value)} 
                className="w-full p-5 bg-black border border-zinc-800 rounded-2xl text-xl font-bold italic" 
              />
              <input 
                type="date" 
                required 
                value={dateIn} 
                onChange={e => setDateIn(e.target.value)} 
                className="w-full p-5 bg-black border border-zinc-800 rounded-2xl" 
              />
              <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase text-sm shadow-xl hover:bg-blue-500 transition-all">
                Save Performance
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800">
            <h2 className="text-2xl font-black italic uppercase mb-8 text-zinc-500">
              Latest 5 History
            </h2>
            <div className="space-y-4">
              {scores.length === 0 ? <p className="italic text-zinc-700">No rounds logged yet.</p> : null}
              {scores.map((s) => (
                <div key={s.id} className="bg-black p-6 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-fuchsia-500 transition-all">
                  <p className="text-3xl font-black italic group-hover:text-fuchsia-500">{s.score}</p>
                  <p className="font-bold text-zinc-600 uppercase text-xs tracking-widest">{s.date_played}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}