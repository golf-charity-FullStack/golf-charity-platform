"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
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
            className="w-full p-4 bg-fuchsia-600 text-white font-black italic rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        {error && <p className="text-[10px] text-center text-red-500 font-black uppercase tracking-tighter">{error}</p>}

        <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest">
          New here? <Link href="/signup" className="text-white hover:text-fuchsia-500 underline underline-offset-4">Join the Club</Link>
        </p>
      </div>
    </div>
  );
}