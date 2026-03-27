import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import '../globals.css'
import TopNav from '@/components/nav/TopNav'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--mono',
  display: 'swap',
})

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  const fontClasses = `${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`

  return (
    <html lang={params.locale} className={fontClasses}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <TopNav />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
