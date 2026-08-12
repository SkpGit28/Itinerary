'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface QuestionnaireShellProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  /** Changing this key replays the section transition. */
  transitionKey?: string
  /** Rendered above everything inside the shell, e.g. the section interstitial. */
  overlay?: React.ReactNode
  className?: string
}

/** The id of the scrolling region, so callers can drive it directly. */
export const SCROLL_REGION_ID = 'rc-main'

/**
 * Page frame. The viewport is locked to exactly one screen and only the
 * question list scrolls, so the progress header and the Back/Next bar stay
 * visible and reachable at all times on a phone.
 */
export function QuestionnaireShell({
  header,
  footer,
  children,
  transitionKey,
  overlay,
  className,
}: QuestionnaireShellProps) {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[var(--rc-bg)]">
      <a href={`#${SCROLL_REGION_ID}`} className="rc-skip-link">
        Seedha sawaalon pe jao
      </a>

      {header ? <div className="shrink-0">{header}</div> : null}

      <main
        id={SCROLL_REGION_ID}
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
        data-rc-scroll
      >
        <div
          key={transitionKey}
          className={cn('rc-step mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8', className)}
        >
          {children}
        </div>
      </main>

      {footer ? <div className="shrink-0">{footer}</div> : null}

      {overlay}
    </div>
  )
}
