import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const authPaths = ['/login', '/register', '/forgot-password']
const adminPaths = ['/dashboard']
const userPaths = ['/']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const access_token = request.cookies.get('access_token')?.value
  const refresh_token = request.cookies.get('refresh_token')?.value

  // Kiểm tra xem người dùng có token hay không
  const hasToken = access_token && refresh_token

  // Kiểm tra nếu đường dẫn là adminPaths và không có token
  if (adminPaths.some((path) => pathname.startsWith(path)) && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Kiểm tra nếu đường dẫn là authPaths và có token
  if (authPaths.some((path) => pathname.startsWith(path)) && hasToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
