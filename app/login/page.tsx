"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log("DEBUG: Login button clicked for", email);

    try {
      // 1. Attempt the actual sign in
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("DEBUG: Supabase returned an error:", authError.message);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        console.log("DEBUG: Session found! Token exists.");
        console.log("DEBUG: Forcing hard redirect to /dashboard...");
        
        // 2. Force the browser to jump to the dashboard immediately
        window.location.assign('/dashboard');
      } else {
        console.error("DEBUG: No error, but no session returned either.");
        setError("Session failed to initialize. Try again.");
        setLoading(false);
      }

    } catch (err) {
      console.error("DEBUG: The code crashed entirely:", err);
      setError("Network or Code Crash. Check Console (F12).");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md p-10 space-y-8 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
        <h1 className="text-4xl font-black text-center italic tracking-tighter uppercase">Welcome Back</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 transition-colors text-sm font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full p-4 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-fuchsia-500 transition-colors text-sm font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-fuchsia-600 text-white font-black italic rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "CHECKING CREDENTIALS..." : "SIGN IN"}
          </button>
        </form>

        {error && (
          <p className="text-[10px] text-center text-red-500 font-black uppercase bg-red-500/10 p-2 rounded border border-red-500/20">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest">
          New here? <Link href="/signup" className="text-white hover:text-fuchsia-500 underline underline-offset-4">Join the Club</Link>
        </p>
      </div>
    </div>
  );
}