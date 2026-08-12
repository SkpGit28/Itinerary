import type { Metadata, Viewport } from 'next'
import './reality-check.css'

export const metadata: Metadata = {
  title: 'Relationship Reality Check',
  description:
    'A private questionnaire for describing what a relationship actually feels like. Answers stay on your device.',
  // These answers are personal; keep the page out of search indexes.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#f6f5f2',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RealityCheckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rc-root min-h-[100dvh] bg-[var(--rc-bg)] text-[var(--rc-fg)]">{children}</div>
  )
}
