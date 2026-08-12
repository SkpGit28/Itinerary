'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface QuestionnaireShellProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  /** Changing this key replays the section transition. */
  transitionKey?: string
  className?: string
}

/**
 * Page frame: sticky header, a comfortable centred reading column, and a
 * sticky navigation bar. The column is capped well short of full width on
 * desktop so questions stay easy to read.
 */
export function QuestionnaireShell({
  header,
  footer,
  children,
  transitionKey,
  className,
}: QuestionnaireShellProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--rc-bg)]">
      <a href="#rc-main" className="rc-skip-link">
        Skip to questions
      </a>
      {header}
      <main
        id="rc-main"
        tabIndex={-1}
        className="flex-1 focus-visible:outline-none"
        data-rc-scroll
      >
        <div
          key={transitionKey}
          className={cn('rc-step mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8', className)}
        >
          {children}
        </div>
      </main>
      {footer}
    </div>
  )
}
