import type { Metadata, Viewport } from 'next'
import { Caveat } from 'next/font/google'
import './reality-check.css'

/** Handwriting accent, sirf ek do lines ke liye, poore text ke liye nahi. */
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--rc-font-hand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Relationship Reality Check',
  description:
    'Ek private questionnaire, sirf ye samajhne ke liye ki rishta asli me kaisa lagta hai. Jawab isi phone me rehte hain.',
  // These answers are personal; keep the page out of search indexes.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#fdeef2',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RealityCheckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`rc-root ${caveat.variable} min-h-[100dvh] bg-[var(--rc-bg)] text-[var(--rc-fg)]`}
    >
      {children}
    </div>
  )
}
