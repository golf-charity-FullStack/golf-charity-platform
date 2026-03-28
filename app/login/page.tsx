'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (type: 'login' | 'signup') => {
    setMsg('Processing...');
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMsg(error.message);
    } else {
      if (type === 'login') {
        router.push('/dashboard');
        router.refresh();
      } else {
        setMsg("Check your email to verify!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-bold italic uppercase">
      <div className="bg-zinc-900 p-12 rounded-[3rem] border border-zinc-800 w-full max-w-md shadow-2xl">
        <h1 className="text-4xl mb-10 tracking-tighter">Digital Heroes</h1>
        <div className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 bg-black border border-zinc-800 rounded-3xl" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-5 bg-black border border-zinc-800 rounded-3xl" />
          <button onClick={() => handleAuth('login')} className="w-full bg-blue-600 py-5 rounded-3xl tracking-tighter shadow-lg">Log In</button>
          <button onClick={() => handleAuth('signup')} className="w-full bg-zinc-800 py-5 rounded-3xl text-[10px] tracking-widest">Create Account</button>
          {msg && <p className="text-center text-fuchsia-400 text-[10px] mt-4">{msg}</p>}
        </div>
      </div>
    </div>
  );
}