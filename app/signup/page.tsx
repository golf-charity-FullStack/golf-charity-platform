"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md p-10 space-y-8 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
        <h1 className="text-4xl font-black text-center italic tracking-tighter uppercase">JOIN THE CLUB</h1>
        
        <form onSubmit={handleSignup} className="space-y-4">
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
            className="w-full p-4 bg-white text-black font-black italic rounded-xl hover:bg-fuchsia-600 hover:text-white transition-all uppercase tracking-widest"
          >
            {loading ? "CREATING..." : "SIGN UP"}
          </button>
        </form>

        {message && <p className="text-xs text-center text-fuchsia-500 font-bold uppercase tracking-tight">{message}</p>}

        <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest">
          Already a member? <Link href="/login" className="text-white hover:text-fuchsia-500 underline underline-offset-4">Login</Link>
        </p>
      </div>
    </div>
  );
}