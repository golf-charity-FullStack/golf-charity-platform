import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create the initial response using the modern Next.js request passing
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Create the Supabase client using the NEW getAll/setAll methods
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update the request cookies
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Update the response cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Fetch the user safely
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Handle Routing
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'

  if (!user && isDashboard) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}