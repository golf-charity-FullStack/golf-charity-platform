"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugMsg("Attempting login...");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setDebugMsg(`AUTH ERROR: ${authError.message}`);
        setLoading(false);
      } else if (data?.session) {
        setDebugMsg("SUCCESS! Entering dashboard...");
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setDebugMsg(`CRASH: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans">
      <div className="w-full max-w-md p-10 space-y-8 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
        <h1 className="text-4xl font-black text-center italic tracking-tighter uppercase leading-none">
          Digital <span className="text-fuchsia-500">Heroes</span>
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-fuchsia-600 text-white font-black italic rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "SIGN IN"}
          </button>
        </form>

        {debugMsg && (
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
            <p className="text-[10px] text-center text-fuchsia-400 font-black uppercase tracking-widest leading-tight">
              {debugMsg}
            </p>
          </div>
        )}

        <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest">
          New here? <Link href="/signup" className="text-white hover:text-fuchsia-500 underline underline-offset-4">Join Club</Link>
        </p>
      </div>
    </div>
  );
}