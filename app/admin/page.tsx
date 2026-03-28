"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    active: 0,
    scores: 0,
    pool: 0,
  });

  const router = useRouter();

  // ✅ FIX: define function BEFORE using it
  const loadStats = async () => {
    try {
      const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: activeCount, error: activeError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "active");

      const { count: scoreCount, error: scoreError } = await supabase
        .from("scores")
        .select("*", { count: "exact", head: true });

      if (userError || activeError || scoreError) {
        console.error("Error loading stats:", {
          userError,
          activeError,
          scoreError,
        });
        return;
      }

      setStats({
        users: userCount || 0,
        active: activeCount || 0,
        scores: scoreCount || 0,
        pool: (activeCount || 0) * 19 * 0.5,
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Auth error:", error);
          router.push("/dashboard");
          return;
        }

        // ⚠️ NOTE: This is not secure for production (can be spoofed)
        if (user?.email === "admin@digitalheroes.co.in") {
          setIsAdmin(true);
          await loadStats();
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        router.push("/dashboard");
      }
    };

    verifyAdmin();
  }, [router]);

  const simulateDraw = () => {
    alert(
      "Draw Simulated! Winners have been calculated based on the 5-Number match algorithm."
    );
  };

  if (!isAdmin)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking credentials...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-zinc-800 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-red-500">
              Admin Control
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">
              System Overview & Draw Management
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs font-bold uppercase bg-zinc-800 px-4 py-2 rounded"
          >
            Exit Admin
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-black italic">{stats.users}</p>
          </div>

          <div className="bg-black border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2">
              Active Subs
            </h3>
            <p className="text-3xl font-black italic text-green-500">
              {stats.active}
            </p>
          </div>

          <div className="bg-black border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-2">
              Scores Logged
            </h3>
            <p className="text-3xl font-black italic">{stats.scores}</p>
          </div>

          <div className="bg-black border border-red-900/30 p-6 rounded-2xl">
            <h3 className="text-red-400 text-[10px] font-black uppercase mb-2">
              Prize Pool Size
            </h3>
            <p className="text-3xl font-black italic text-red-500">
              ${stats.pool.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-10 rounded-3xl text-center">
          <h2 className="text-2xl font-black italic uppercase mb-4">
            Monthly Draw Engine
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Trigger the algorithmic draw for the current month. This will lock
            entries, calculate matches, and distribute the prize pool.
          </p>

          <button
            onClick={simulateDraw}
            className="bg-red-600 text-white px-10 py-4 rounded-xl font-black italic uppercase tracking-widest hover:bg-red-500 transition-colors"
          >
            Execute Draw Now
          </button>
        </div>
      </div>
    </div>
  );
}