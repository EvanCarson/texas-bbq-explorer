'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import LangSwitcher from './LangSwitcher'

export default function TopNav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: `/${locale}`, label: t('overview') },
    { href: `/${locale}/days`, label: t('days') },
    { href: `/${locale}/places`, label: t('places') },
    { href: `/${locale}/blog`, label: t('blog') },
  ]

  function isActive(href: string) {
    return href === `/${locale}`
      ? pathname === `/${locale}` || pathname === `/${locale}/`
      : pathname.startsWith(href)
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(14,16,21,0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(212,175,110,0.12)',
    }}>
      {/* Main bar */}
      <div className="safe-nav" style={{
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
          <span style={{ fontSize: 18 }}>✈️</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.2px',
            color: 'var(--ink)',
            lineHeight: 1,
          }}>
            AI Trip
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-hover"
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isActive(link.href) ? 600 : 400,
                letterSpacing: isActive(link.href) ? '0' : '0.01em',
                color: isActive(link.href) ? 'var(--ember)' : 'var(--smoke)',
                textDecoration: 'none',
                background: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <LangSwitcher />

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-mobile-link${isActive(link.href) ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ padding: '12px 24px' }}>
          <LangSwitcher />
        </div>
      </div>
    </nav>
  )
}
