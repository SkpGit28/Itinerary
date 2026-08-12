'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { AnswerValue, Question } from '@/lib/reality-check/types'

export interface QuestionInputProps {
  question: Question
  answer: AnswerValue | undefined
  onChange: (next: AnswerValue) => void
  invalid?: boolean
  /** ids of the error / hint elements to announce with the control. */
  describedBy?: string
  /** id of the element holding the question text. */
  labelledBy: string
}

/**
 * Two or three short options shown side by side, e.g. Yes / Sometimes / No.
 * Backed by native radios so arrow-key navigation works for free.
 */
export function YesNoQuestion({
  question,
  answer,
  onChange,
  invalid,
  describedBy,
  labelledBy,
}: QuestionInputProps) {
  const options = question.options ?? []

  return (
    <fieldset
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cn(
        'grid gap-2',
        options.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
        invalid && 'rounded-2xl outline outline-1 outline-offset-4 outline-[var(--rc-error-border)]'
      )}
    >
      {options.map((option) => {
        const selected = answer?.choice === option.value
        return (
          <label
            key={option.value}
            className={cn(
              'rc-option flex min-h-[3rem] cursor-pointer items-center justify-center rounded-2xl border px-2 py-2.5 text-center text-[0.9375rem] font-medium leading-tight transition-colors',
              selected
                ? 'border-[var(--rc-accent)] bg-[var(--rc-accent-soft)] text-[var(--rc-accent)]'
                : 'border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-fg)] hover:border-[var(--rc-border-strong)] hover:bg-[var(--rc-surface-muted)]'
            )}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={selected}
              onChange={() => onChange({ choice: option.value })}
              className="rc-sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </fieldset>
  )
}
