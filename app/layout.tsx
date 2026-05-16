import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="beforeInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1021868103456971"
        crossOrigin="anonymous"
      />
      {children}
    </>
  )
}
