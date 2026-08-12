'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { meaningfulLength } from '@/lib/reality-check/validation'
import type { QuestionInputProps } from './YesNoQuestion'

/**
 * Open-ended answer. Long answers use a textarea, short ones a single-line
 * input. The character counter only appears once the user starts writing, so
 * an empty field never feels like a word-count test.
 */
export function TextQuestion({
  question,
  answer,
  onChange,
  invalid,
  describedBy,
  labelledBy,
}: QuestionInputProps) {
  const value = answer?.text ?? ''
  const length = meaningfulLength(value)
  const recommended = question.recommendedChars
  const showCounter = Boolean(recommended) && length > 0 && length < (recommended ?? 0)

  const shared = cn(
    'w-full rounded-2xl border px-4 py-3 text-[0.9375rem] leading-relaxed text-[var(--rc-fg)] transition-colors placeholder:text-[var(--rc-fg-subtle)]',
    invalid
      ? 'border-[var(--rc-error-border)] bg-[var(--rc-error-soft)]'
      : 'border-[var(--rc-border)] bg-[var(--rc-surface)] hover:border-[var(--rc-border-strong)]'
  )

  return (
    <div>
      {question.type === 'shortText' ? (
        <input
          id={question.id}
          type="text"
          value={value}
          onChange={(event) => onChange({ text: event.target.value })}
          placeholder={question.placeholder}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          autoComplete="off"
          className={cn(shared, 'min-h-[3rem]')}
        />
      ) : (
        <textarea
          id={question.id}
          value={value}
          onChange={(event) => onChange({ text: event.target.value })}
          placeholder={question.placeholder}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          rows={question.large ? 6 : 4}
          className={cn(shared, question.large ? 'min-h-[9rem]' : 'min-h-[6.5rem]')}
        />
      )}

      {showCounter ? (
        <p className="mt-1.5 text-right text-xs text-[var(--rc-fg-subtle)]" aria-hidden="true">
          {length} / {recommended}
        </p>
      ) : null}
    </div>
  )
}
