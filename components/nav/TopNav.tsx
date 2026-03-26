'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import LangSwitcher from './LangSwitcher'

export default function TopNav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  const links = [
    { href: `/${locale}`, label: t('overview') },
    { href: `/${locale}/days`, label: t('days') },
    { href: `/${locale}/places`, label: t('places') },
    { href: `/${locale}/blog`, label: t('blog') },
  ]

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(247,242,232,0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--bark)',
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        height: 56,
        gap: 0,
      }}>
        {/* Brand */}
        <Link href={`/${locale}`} style={{ marginRight: 36, display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <span style={{ fontSize: 18 }}>🍖</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.2px',
            color: 'var(--ink)',
            lineHeight: 1,
          }}>
            TX BBQ
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {links.map(link => {
            const isActive = link.href === `/${locale}`
              ? pathname === `/${locale}` || pathname === `/${locale}/`
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: isActive ? '0' : '0.01em',
                  color: isActive ? 'var(--ember)' : 'var(--smoke)',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(196,56,12,0.08)' : 'transparent',
                  transition: 'color 0.15s, background 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <LangSwitcher />
      </div>
    </nav>
  )
}
