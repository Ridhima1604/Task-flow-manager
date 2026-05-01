import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register'
  const isProtected = ['/dashboard', '/projects', '/tasks', '/admin'].some((path) => nextUrl.pathname.startsWith(path))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (nextUrl.pathname.startsWith('/admin') && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/tasks/:path*', '/admin/:path*', '/login', '/register'],
}
