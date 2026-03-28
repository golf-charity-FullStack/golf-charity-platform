'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');

      const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', session.user.id).single();
      
      if (profile?.subscription_status !== 'active') {
        router.push('/pricing');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic uppercase">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-black italic uppercase">Welcome to the Club.</h1>
      {/* Rest of your dashboard content here */}
    </div>
  );
}