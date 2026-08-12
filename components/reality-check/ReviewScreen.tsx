'use client'

import * as React from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReviewSection } from './ReviewSection'
import { PrivacyNotice } from './PrivacyNotice'
import { SECTIONS } from '@/lib/reality-check/questions'
import { sectionProgress, visibleQuestions } from '@/lib/reality-check/validation'
import type { Answers, QuestionIssue } from '@/lib/reality-check/types'

interface ReviewScreenProps {
  answers: Answers
  issues: QuestionIssue[]
  honestyConfirmed: boolean
  onHonestyChange: (value: boolean) => void
  onEditSection: (sectionIndex: number) => void
  onJumpToQuestion: (questionId: string) => void
  onSubmit: () => void
  /** Set once Submit has been pressed with something outstanding. */
  showSubmitErrors: boolean
}

export function ReviewScreen({
  answers,
  issues,
  honestyConfirmed,
  onHonestyChange,
  onEditSection,
  onJumpToQuestion,
  onSubmit,
  showSubmitErrors,
}: ReviewScreenProps) {
  const summaryRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (showSubmitErrors && issues.length > 0) {
      summaryRef.current?.focus()
    }
  }, [showSubmitErrors, issues.length])

  const missingHonesty = showSubmitErrors && !honestyConfirmed

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--rc-fg)] sm:text-2xl">
          Apne jawab ek baar dekh lo
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
          Kisi bhi section ko khol ke padh lo. Bhejne se pehle kuch bhi badal sakti ho.
        </p>
      </header>

      {showSubmitErrors && issues.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border border-[var(--rc-error-border)] bg-[var(--rc-error-soft)] p-4"
        >
          <p className="flex items-start gap-2 text-[0.9375rem] font-medium leading-snug text-[var(--rc-error)]">
            <AlertCircle className="mt-[2px] h-4 w-4 shrink-0" aria-hidden="true" />
            {issues.length} zaroori sawaal abhi baaki hain.
          </p>
          <button
            type="button"
            onClick={() => onJumpToQuestion(issues[0].questionId)}
            className="mt-2.5 min-h-[2.75rem] rounded-xl bg-[var(--rc-error)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Pehle wale pe le chalo
          </button>
        </div>
      ) : null}

      <div className="space-y-2.5">
        {SECTIONS.map((section) => {
          const progress = sectionProgress(section.id, answers)
          return (
            <ReviewSection
              key={section.id}
              section={section}
              questions={visibleQuestions(section.id, answers)}
              answers={answers}
              progress={progress}
              defaultOpen={showSubmitErrors && progress.missingRequired > 0}
              onEdit={() => onEditSection(section.index - 1)}
            />
          )
        })}
      </div>

      <label
        className={cn(
          'rc-checkbox flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
          honestyConfirmed
            ? 'border-[var(--rc-accent)] bg-[var(--rc-accent-soft)]'
            : missingHonesty
              ? 'border-[var(--rc-error-border)] bg-[var(--rc-error-soft)]'
              : 'border-[var(--rc-border)] bg-[var(--rc-surface)]'
        )}
      >
        <input
          type="checkbox"
          checked={honestyConfirmed}
          onChange={(event) => onHonestyChange(event.target.checked)}
          aria-describedby={missingHonesty ? 'honesty-error' : undefined}
          className="rc-sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
            honestyConfirmed
              ? 'border-[var(--rc-accent)] bg-[var(--rc-accent)] text-white'
              : 'border-[var(--rc-border-strong)] bg-[var(--rc-surface)]'
          )}
        >
          {honestyConfirmed ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
        </span>
        <span className="text-[0.9375rem] leading-snug text-[var(--rc-fg)]">
          Maine sab sach sach likha hai, kasam se.
        </span>
      </label>

      {missingHonesty ? (
        <p
          id="honesty-error"
          className="flex items-start gap-2 text-sm text-[var(--rc-error)]"
          role="alert"
        >
          <AlertCircle className="mt-[1px] h-4 w-4 shrink-0" aria-hidden="true" />
          Ye tick kar do phir bhejte hain.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        className="flex min-h-[3.5rem] w-full items-center justify-center rounded-2xl bg-[var(--rc-cta)] text-base font-semibold text-white transition-colors hover:bg-[var(--rc-cta-hover)]"
      >
        Bhej do
      </button>

      <PrivacyNotice className="pt-2" />
    </div>
  )
}
