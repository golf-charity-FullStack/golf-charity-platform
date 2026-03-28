'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Sign up successful! You can now log in.');
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Logged in successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="p-8 bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-800">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Digital Heroes Platform</h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          
          <div className="pt-4 flex flex-col gap-3">
            <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-semibold p-4 rounded-xl hover:bg-blue-500 transition-colors">
              Log In
            </button>
            <button onClick={handleSignUp} className="w-full bg-transparent text-zinc-300 font-semibold p-4 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-700">
              Create Account
            </button>
          </div>
        </div>
        
        {message && <p className="mt-6 text-center text-sm font-medium text-emerald-400">{message}</p>}
      </div>
    </div>
  );
}