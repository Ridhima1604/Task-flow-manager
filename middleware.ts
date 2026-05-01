import { NextResponse } from 'next/server'
import { auth } from './lib/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user

  const isAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register'
  const isProtected = ['/dashboard', '/projects', '/tasks', '/admin'].some((path) => nextUrl.pathname.startsWith(path))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (nextUrl.pathname.startsWith('/admin') && user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/tasks/:path*', '/admin/:path*', '/login', '/register'],
}
