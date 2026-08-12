'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { QuestionInfoButton } from './QuestionInfoButton'
import { ValidationMessage } from './ValidationMessage'
import { YesNoQuestion } from './YesNoQuestion'
import { ScaleQuestion } from './ScaleQuestion'
import { RatingQuestion } from './RatingQuestion'
import { SingleChoiceQuestion } from './SingleChoiceQuestion'
import { MultiChoiceQuestion } from './MultiChoiceQuestion'
import { TextQuestion } from './TextQuestion'
import type { AnswerValue, Question } from '@/lib/reality-check/types'

interface QuestionCardProps {
  question: Question
  answer: AnswerValue | undefined
  onChange: (next: AnswerValue) => void
  /** Blocking message, shown only after the user has tried to continue. */
  error: string | null
  /** Non-blocking nudge, e.g. a very short open answer. */
  hint: string | null
  /** True when this question was revealed by a previous answer. */
  isFollowUp?: boolean
}

export function QuestionCard({
  question,
  answer,
  onChange,
  error,
  hint,
  isFollowUp,
}: QuestionCardProps) {
  const labelId = `${question.id}-label`
  const errorId = `${question.id}-error`
  const hintId = `${question.id}-hint`
  const helperId = `${question.id}-helper`

  const describedBy =
    [question.helper ? helperId : null, hint ? hintId : null, error ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined

  const inputProps = {
    question,
    answer,
    onChange,
    invalid: Boolean(error),
    describedBy,
    labelledBy: labelId,
  }

  return (
    <section
      data-question-id={question.id}
      aria-labelledby={labelId}
      className={cn(
        'scroll-mt-28 rounded-3xl border bg-[var(--rc-surface)] p-5 transition-colors sm:p-6',
        error ? 'border-[var(--rc-error-border)]' : 'border-[var(--rc-border)]',
        isFollowUp && 'ml-0 border-dashed sm:ml-6'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {question.displayNumber ? (
            <p className="mb-2 text-xs font-semibold tabular-nums tracking-[0.08em] text-[var(--rc-fg-subtle)]">
              {isFollowUp ? 'FOLLOW-UP' : question.displayNumber}
            </p>
          ) : null}
          <h3
            id={labelId}
            className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--rc-fg)] sm:text-lg"
          >
            {question.title}
            {question.required ? (
              <>
                {/* Non-breaking space keeps the marker from wrapping alone. */}
                <span aria-hidden="true" className="text-[var(--rc-accent)]">
                  {' *'}
                </span>
                <span className="rc-sr-only"> (required)</span>
              </>
            ) : (
              <span className="ml-2 align-middle text-xs font-normal text-[var(--rc-fg-subtle)]">
                Optional
              </span>
            )}
          </h3>
        </div>

        <QuestionInfoButton questionTitle={question.title} info={question.info} />
      </div>

      {question.helper ? (
        <p id={helperId} className="mt-2 text-sm leading-snug text-[var(--rc-fg-muted)]">
          {question.helper}
        </p>
      ) : null}

      <div className="mt-4">
        {question.type === 'segmented' ? <YesNoQuestion {...inputProps} /> : null}
        {question.type === 'scale' ? <ScaleQuestion {...inputProps} /> : null}
        {question.type === 'rating' ? <RatingQuestion {...inputProps} /> : null}
        {question.type === 'single' ? <SingleChoiceQuestion {...inputProps} /> : null}
        {question.type === 'multi' ? <MultiChoiceQuestion {...inputProps} /> : null}
        {question.type === 'text' || question.type === 'shortText' ? (
          <TextQuestion {...inputProps} />
        ) : null}
      </div>

      {error ? <ValidationMessage id={errorId} message={error} tone="error" /> : null}
      {!error && hint ? <ValidationMessage id={hintId} message={hint} tone="hint" /> : null}
    </section>
  )
}
