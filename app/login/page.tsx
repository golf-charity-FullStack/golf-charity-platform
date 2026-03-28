'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true);
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      if (type === 'login') {
        router.push('/dashboard');
        router.refresh(); // Forces Next.js to check the new auth state
      } else {
        alert("Check your email for the confirmation link!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 w-full max-w-md">
        <h1 className="text-3xl font-black italic uppercase text-white mb-8">Digital Heroes</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white mb-4" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white mb-6" />
        <button disabled={loading} onClick={() => handleAuth('login')} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white uppercase mb-3">{loading ? '...' : 'Log In'}</button>
        <button disabled={loading} onClick={() => handleAuth('signup')} className="w-full bg-zinc-800 py-4 rounded-2xl font-black text-white uppercase text-xs">Create Account</button>
      </div>
    </div>
  );
}