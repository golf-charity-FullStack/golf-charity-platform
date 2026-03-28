import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// createBrowserClient automatically syncs the session to browser cookies
// so the Middleware can actually see that you are logged in.
export const supabase = createBrowserClient(supabaseUrl, supabaseKey)