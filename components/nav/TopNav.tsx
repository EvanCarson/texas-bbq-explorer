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
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--bark)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        height: 52,
      }}>
        <span style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--cream)',
          letterSpacing: '-0.5px',
          marginRight: 8,
          whiteSpace: 'nowrap',
        }}>
          🍖 TX BBQ
        </span>

        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
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
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--ember)' : 'var(--ash)',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(0,113,227,0.08)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
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
