'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export default function LangSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    const next = locale === 'en' ? 'zh' : 'en'
    // pathname starts with /en or /zh — swap the prefix
    const newPath = pathname.replace(/^\/(en|zh)/, `/${next}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggle}
      className="btn-hover"
      style={{
        background: 'none',
        border: '1px solid rgba(212,175,110,0.35)',
        borderRadius: '980px',
        padding: '4px 14px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--ember)',
        cursor: 'pointer',
        letterSpacing: '-0.1px',
      }}
    >
      {locale === 'en' ? '中' : 'EN'}
    </button>
  )
}
