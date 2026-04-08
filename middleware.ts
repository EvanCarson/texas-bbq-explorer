import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TRIPS } from '@/lib/trips'

const LOCALES = ['en', 'zh']
const DEFAULT_LOCALE = 'en'
const DEFAULT_TRIP = 'houston'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root → default trip + locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_TRIP}/${DEFAULT_LOCALE}`, request.url))
  }

  const segments = pathname.split('/').filter(Boolean)
  const [seg0, seg1, ...rest] = segments

  const tripValid   = seg0 && seg0 in TRIPS
  const localeValid = seg1 && LOCALES.includes(seg1)

  // Redirect to valid trip/locale if either segment is wrong
  if (!tripValid || !localeValid) {
    const trip   = tripValid   ? seg0 : DEFAULT_TRIP
    const locale = localeValid ? seg1 : DEFAULT_LOCALE
    const tail   = rest.length ? `/${rest.join('/')}` : ''
    return NextResponse.redirect(new URL(`/${trip}/${locale}${tail}`, request.url))
  }

  // Pass locale to next-intl server functions via header
  const response = NextResponse.next()
  response.headers.set('x-next-intl-locale', seg1)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
