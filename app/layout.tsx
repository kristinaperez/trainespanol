import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const SITE_URL = 'https://espanol-real.example'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Español Real — Learn Real Spanish Spoken in Spain',
    template: '%s · Español Real',
  },
  description:
    'Master real-life Spanish phrases used in Spain instead of memorizing grammar. Interactive lessons, flashcards, spaced repetition and a Spain adaptation map.',
  applicationName: 'Español Real',
  keywords: ['Spanish', 'español', 'learn Spanish', 'Spain', 'phrases', 'flashcards', 'language learning'],
  authors: [{ name: 'Español Real' }],
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    title: 'Español Real — Learn Real Spanish Spoken in Spain',
    description:
      'Master real-life Spanish phrases used in Spain instead of memorizing grammar.',
    siteName: 'Español Real',
    url: SITE_URL,
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Español Real',
    description: 'Learn real Spanish spoken in Spain.',
  },
  robots: { index: true, follow: true },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbf5' },
    { media: '(prefers-color-scheme: dark)', color: '#2a231f' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const themeScript = `(function(){try{var raw=localStorage.getItem('espanol-real:v1');var t='system';if(raw){var s=JSON.parse(raw);if(s&&s.theme)t=s.theme;}var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var c=document.documentElement.classList;dark?c.add('dark'):c.remove('dark');}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${nunito.variable} bg-background`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
