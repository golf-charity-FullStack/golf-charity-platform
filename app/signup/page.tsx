"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
      // Optionally redirect to pricing after a delay
      // setTimeout(() => router.push("/pricing"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        <h1 className="text-3xl font-bold text-center italic tracking-tighter">JOIN THE CLUB</h1>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        {message && <p className="text-sm text-center text-zinc-400">{message}</p>}

        <p className="text-center text-sm text-zinc-500">
          Already a member? <Link href="/login" className="text-white underline">Login</Link>
        </p>
      </div>
    </div>
  );
}