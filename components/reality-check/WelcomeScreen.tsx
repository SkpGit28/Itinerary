'use client'

import * as React from 'react'
import { ArrowRight, Clock, RotateCcw } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'
import { PrivacyNotice } from './PrivacyNotice'

interface WelcomeScreenProps {
  onStart: () => void
  onResume: () => void
  onStartOver: () => void
  /** A saved, unfinished questionnaire exists on this device. */
  hasSavedProgress: boolean
  /** Percentage of required questions already completed, 0–100. */
  savedCompletion: number
}

const GROUND_RULES = [
  'There are no right or wrong answers',
  'Take your time',
  'Answer from your real experience',
  "You don't need to protect anyone's feelings",
  'You can skip optional questions',
  'Your answers will not be judged',
]

export function WelcomeScreen({
  onStart,
  onResume,
  onStartOver,
  hasSavedProgress,
  savedCompletion,
}: WelcomeScreenProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--rc-fg)] sm:text-4xl">
        Tell the truth about your relationship.
      </h1>
      <p className="mt-3.5 text-[1.0625rem] leading-relaxed text-[var(--rc-fg-muted)] sm:text-lg">
        This questionnaire is designed to understand what being in this relationship actually feels
        like for you.
      </p>

      {hasSavedProgress ? (
        <div className="mt-7 rounded-3xl border border-[var(--rc-accent-border)] bg-[var(--rc-accent-soft)] p-5">
          <h2 className="text-base font-semibold text-[var(--rc-fg)]">Welcome back.</h2>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
            You have an unfinished questionnaire on this device
            {savedCompletion > 0 ? ` — about ${savedCompletion}% of the required questions are done` : ''}
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onResume}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--rc-accent)] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]"
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--rc-border-strong)] bg-[var(--rc-surface)] px-5 text-[0.9375rem] font-medium text-[var(--rc-fg)] transition-colors hover:bg-[var(--rc-surface-muted)]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Start over
            </button>
          </div>
        </div>
      ) : null}

      <ul className="mt-8 space-y-2.5">
        {GROUND_RULES.map((rule) => (
          <li
            key={rule}
            className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-[var(--rc-fg)]"
          >
            <span
              aria-hidden="true"
              className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rc-accent)]"
            />
            {rule}
          </li>
        ))}
      </ul>

      <div className="mt-7 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface)] p-4 sm:p-5">
        <p className="text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
          Some questions may feel uncomfortable. That&apos;s okay. Honest answers are more useful
          than perfect answers.
        </p>
      </div>

      {!hasSavedProgress ? (
        <button
          type="button"
          onClick={onStart}
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--rc-accent)] text-base font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]"
        >
          Start Questionnaire
          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      ) : null}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-[var(--rc-fg-subtle)]">
        <Clock className="h-4 w-4" aria-hidden="true" />
        How long will this take? About 10–15 minutes
      </p>

      <PrivacyNotice className="mt-6" />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Are you sure?"
        description="Your saved answers will be deleted from this device. This cannot be undone."
        confirmLabel="Delete and start over"
        cancelLabel="Keep my answers"
        destructive
        onConfirm={onStartOver}
      />
    </div>
  )
}
