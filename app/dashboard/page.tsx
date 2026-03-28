"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

// 1. This completely removes the "any" red line
type ScoreRecord = {
  id: string;
  score: number;
  played_date: string;
};

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // Using the new type here instead of any[]
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  
  // Form State
  const [newScore, setNewScore] = useState("");
  const [scoreDate, setScoreDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndScores = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email ?? 'Member');
        setUserId(user.id);
        fetchScores(user.id);
      } else {
        router.push('/login');
      }
    };

    fetchUserAndScores();
  }, [router]);

  const fetchScores = async (uid: string) => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', uid)
      .order('played_date', { ascending: false })
      .limit(5);

    if (!error && data) {
      setScores(data as ScoreRecord[]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    const scoreNum = parseInt(newScore);
    if (scoreNum < 1 || scoreNum > 45) {
      setMessage("Score must be between 1 and 45.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const { error: insertError } = await supabase
        .from('scores')
        .insert([{ user_id: userId, score: scoreNum, played_date: scoreDate }]);

      if (insertError) throw insertError;

      const { data: allScores } = await supabase
        .from('scores')
        .select('id')
        .eq('user_id', userId)
        .order('played_date', { ascending: false });

      if (allScores && allScores.length > 5) {
        const idsToDelete = allScores.slice(5).map(s => s.id);
        await supabase
          .from('scores')
          .delete()
          .in('id', idsToDelete);
      }

      setNewScore("");
      setScoreDate("");
      setMessage("Score logged successfully!");
      fetchScores(userId);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save score.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <nav className="flex justify-between items-center max-w-5xl mx-auto mb-12 border-b border-zinc-900 pb-6">
        <div className="text-2xl font-black italic uppercase tracking-tighter">
          Hero <span className="text-fuchsia-500">Dashboard</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white tracking-widest transition-colors">
            Home
          </Link>
          <button 
            onClick={handleSignOut}
            className="text-[10px] font-black uppercase bg-zinc-900 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
            Welcome back, <br />
            <span className="text-fuchsia-500 lowercase">{userEmail || '...'}</span>
          </h1>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Account Status</h3>
            <p className="text-2xl font-black italic text-fuchsia-500">ACTIVE</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Draw Entries</h3>
            <p className="text-2xl font-black italic text-white">1</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Live Pool Share</h3>
            <p className="text-2xl font-black italic text-white">$19.00</p>
          </div>
        </div>

        {/* Score Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Left Column: Input Form */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px]">
            <h2 className="text-2xl font-black italic uppercase mb-6 tracking-tight">Log a Score</h2>
            <form onSubmit={handleScoreSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Stableford Score (1-45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 transition-colors font-bold"
                  placeholder="e.g. 36"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Date Played</label>
                <input
                  type="date"
                  required
                  value={scoreDate}
                  onChange={(e) => setScoreDate(e.target.value)}
                  className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 transition-colors font-bold text-zinc-300"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-fuchsia-600 text-white font-black italic rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest disabled:opacity-50 mt-4"
              >
                {isSubmitting ? "LOGGING..." : "SUBMIT SCORE"}
              </button>

              {message && (
                <p className={`text-center text-xs font-bold uppercase tracking-widest mt-4 ${message.includes("success") ? "text-green-400" : "text-red-500"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Right Column: Score History */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Rolling 5</h2>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Latest Scores Only</span>
            </div>

            <div className="flex-1">
              {scores.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8">
                  <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest text-center">No scores logged yet</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {scores.map((score, index) => (
                    <li key={score.id} className="flex justify-between items-center bg-black border border-zinc-800 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-600 font-black text-sm w-4">{index + 1}.</span>
                        <span className="font-black text-lg text-white">{score.score}</span>
                        <span className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest ml-2">PTS</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">
                        {new Date(score.played_date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}