"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

type ScoreRecord = { id: string; score: number; played_date: string; };
type CharityRecord = { id: string; name: string; };
type ProfileRecord = { subscription_status: string; charity_id: string | null; };

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [charities, setCharities] = useState<CharityRecord[]>([]);
  const [profile, setProfile] = useState<ProfileRecord>({ subscription_status: 'inactive', charity_id: null });
  
  const [newScore, setNewScore] = useState("");
  const [scoreDate, setScoreDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const fetchData = useCallback(async (uid: string, email: string) => {
    // Fetch Scores
    const { data: scoreData } = await supabase.from('scores').select('*').eq('user_id', uid).order('played_date', { ascending: false }).limit(5);
    if (scoreData) setScores(scoreData as ScoreRecord[]);

    // Fetch Charities
    const { data: charityData } = await supabase.from('charities').select('*');
    if (charityData) setCharities(charityData as CharityRecord[]);

    // Fetch or Create Profile
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (profileData) {
      setProfile(profileData as ProfileRecord);
    } else {
      await supabase.from('profiles').insert([{ id: uid, email: email, subscription_status: 'inactive' }]);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? 'Member');
        setUserId(user.id);
        fetchData(user.id, user.email || '');
      } else {
        router.push('/login');
      }
    };
    init();
  }, [router, fetchData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const activateSubscription = async () => {
    if (!userId) return;
    await supabase.from('profiles').update({ subscription_status: 'active' }).eq('id', userId);
    setProfile({ ...profile, subscription_status: 'active' });
    setMessage("Subscription Activated! You can now log scores.");
    setTimeout(() => setMessage(""), 3000);
  };

  const selectCharity = async (charityId: string) => {
    if (!userId) return;
    await supabase.from('profiles').update({ charity_id: charityId }).eq('id', userId);
    setProfile({ ...profile, charity_id: charityId });
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || profile.subscription_status !== 'active') return;
    
    const scoreNum = parseInt(newScore);
    if (scoreNum < 1 || scoreNum > 45) return setMessage("Score must be 1-45.");

    setIsSubmitting(true);
    setMessage("");

    const { error: insertError } = await supabase.from('scores').insert([{ user_id: userId, score: scoreNum, played_date: scoreDate }]);
    if (insertError) {
      setMessage(`ERROR: ${insertError.message}`);
      setIsSubmitting(false);
      return;
    }

    const { data: allScores } = await supabase.from('scores').select('id').eq('user_id', userId).order('played_date', { ascending: false });
    if (allScores && allScores.length > 5) {
      const idsToDelete = allScores.slice(5).map(s => s.id);
      await supabase.from('scores').delete().in('id', idsToDelete);
    }

    setNewScore(""); setScoreDate("");
    setMessage("Score logged successfully!");
    fetchData(userId, userEmail || '');
    setIsSubmitting(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <nav className="flex justify-between items-center max-w-5xl mx-auto mb-12 border-b border-zinc-900 pb-6">
        <div className="text-2xl font-black italic uppercase tracking-tighter">Hero <span className="text-fuchsia-500">Dashboard</span></div>
        <button onClick={handleSignOut} className="text-[10px] font-black uppercase bg-zinc-900 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors tracking-widest">Sign Out</button>
      </nav>

      <main className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
            Welcome back, <br /><span className="text-fuchsia-500 lowercase">{userEmail || '...'}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Account Status</h3>
            <p className={`text-2xl font-black italic ${profile.subscription_status === 'active' ? 'text-green-400' : 'text-red-500 uppercase'}`}>{profile.subscription_status}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Selected Charity</h3>
            <select 
              className="bg-black text-white border border-zinc-700 p-2 rounded w-full text-xs font-bold"
              value={profile.charity_id || ''}
              onChange={(e) => selectCharity(e.target.value)}
            >
              <option value="" disabled>Select a Charity (10% Donation)</option>
              {charities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Draw Entries</h3>
            <p className="text-2xl font-black italic text-white">{scores.length > 0 ? '1' : '0'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Action Column */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px]">
            {profile.subscription_status !== 'active' ? (
              <div className="text-center py-10 space-y-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tight text-fuchsia-500">Subscription Required</h2>
                <p className="text-sm text-zinc-400">You must be an active member to log scores and enter the draw.</p>
                <button onClick={activateSubscription} className="w-full py-4 bg-white text-black font-black italic rounded-xl hover:bg-fuchsia-600 hover:text-white transition-all uppercase tracking-widest mt-4">
                  Simulate Payment ($19/mo)
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black italic uppercase mb-6 tracking-tight">Log a Score</h2>
                <form onSubmit={handleScoreSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Stableford Score (1-45)</label>
                    <input type="number" min="1" max="45" required value={newScore} onChange={(e) => setNewScore(e.target.value)} className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:border-fuchsia-500 transition-colors font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Date Played</label>
                    <input type="date" required value={scoreDate} onChange={(e) => setScoreDate(e.target.value)} className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:border-fuchsia-500 transition-colors font-bold text-zinc-300" />
                  </div>
                  <button type="submit" disabled={isSubmitting || !profile.charity_id} className="w-full py-4 bg-fuchsia-600 text-white font-black italic rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest disabled:opacity-50 mt-4">
                    {!profile.charity_id ? "SELECT CHARITY FIRST" : isSubmitting ? "LOGGING..." : "SUBMIT SCORE"}
                  </button>
                  {message && <p className="text-center text-xs font-bold uppercase tracking-widest mt-4 text-fuchsia-400">{message}</p>}
                </form>
              </>
            )}
          </div>

          {/* History Column */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[32px] flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Rolling 5</h2>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Latest Scores</span>
            </div>
            <div className="flex-1">
              {scores.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8">
                  <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest text-center">No scores logged</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {scores.map((score, index) => (
                    <li key={score.id} className="flex justify-between items-center bg-black border border-zinc-800 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-600 font-black text-sm w-4">{index + 1}.</span>
                        <span className="font-black text-lg text-white">{score.score}</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">{new Date(score.played_date).toLocaleDateString()}</span>
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