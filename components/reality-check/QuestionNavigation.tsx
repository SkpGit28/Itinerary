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
 * Sticky bottom bar. The Next button is never disabled — pressing it with
 * something missing explains what is missing instead of going quiet.
 */
export function QuestionNavigation({
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel,
  positionLabel,
  hideBack,
}: QuestionNavigationProps) {
  return (
    <nav
      aria-label="Questionnaire navigation"
      className="sticky bottom-0 z-30 border-t border-[var(--rc-border)] bg-[var(--rc-bg)]/92 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        {hideBack ? (
          <div className="w-[5.5rem] shrink-0" aria-hidden="true" />
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-[5.5rem] shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface)] text-[0.9375rem] font-medium text-[var(--rc-fg)] transition-colors hover:bg-[var(--rc-surface-muted)]"
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
          className="flex h-12 min-w-[7rem] shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-[var(--rc-accent)] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
