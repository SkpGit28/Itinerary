'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface QuestionNavigationProps {
  onBack: () => void
  onNext: () => void
  backLabel?: string
  nextLabel: string
  /** Centre text, e.g. "3 of 9". */
  positionLabel: string
  hideBack?: boolean
}

/**
 * Sticky bottom bar. The Next button is never disabled, pressing it with
 * something missing explains what is missing instead of going quiet.
 */
export function QuestionNavigation({
  onBack,
  onNext,
  backLabel = 'Peeche',
  nextLabel,
  positionLabel,
  hideBack,
}: QuestionNavigationProps) {
  return (
    <nav
      aria-label="Aage peeche jaane ke buttons"
      className="z-30 border-t border-[var(--rc-border)] bg-[var(--rc-bg)]"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        {hideBack ? (
          <div className="w-[6.5rem] shrink-0" aria-hidden="true" />
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface)] px-5 text-[0.9375rem] font-medium text-[var(--rc-fg)] shadow-[0_1px_2px_rgba(25,25,23,0.04)] transition-colors hover:border-[var(--rc-border-strong)] hover:bg-[var(--rc-surface-muted)] active:bg-[var(--rc-surface-muted)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </button>
        )}

        <p className="flex-1 text-center text-xs tabular-nums text-[var(--rc-fg-subtle)]">
          {positionLabel}
        </p>

        <button
          type="button"
          onClick={onNext}
          className="flex h-12 min-w-[7rem] shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--rc-accent)] px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
