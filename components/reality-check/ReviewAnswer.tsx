'use client'

import * as React from 'react'
import { formatAnswer, NOT_ANSWERED } from '@/lib/reality-check/export'
import { isAnswered } from '@/lib/reality-check/validation'
import type { AnswerValue, Question } from '@/lib/reality-check/types'

interface ReviewAnswerProps {
  question: Question
  answer: AnswerValue | undefined
}

export function ReviewAnswer({ question, answer }: ReviewAnswerProps) {
  const answered = isAnswered(question, answer)
  const value = answered ? formatAnswer(question, answer) : NOT_ANSWERED
  const missing = !answered && question.required

  return (
    <div className="border-t border-[var(--rc-border)] px-5 py-4 first:border-t-0">
      <p className="text-xs font-semibold tabular-nums tracking-[0.06em] text-[var(--rc-fg-subtle)]">
        {question.displayNumber}
        {question.required ? (
          <>
            <span aria-hidden="true"> *</span>
            <span className="rc-sr-only"> (required)</span>
          </>
        ) : null}
      </p>
      <p className="mt-1 text-[0.9375rem] font-medium leading-snug text-[var(--rc-fg)]">
        {question.title}
      </p>
      <p
        className="mt-2 whitespace-pre-wrap text-[0.9375rem] leading-relaxed"
        style={{
          color: answered
            ? 'var(--rc-fg-muted)'
            : missing
              ? 'var(--rc-error)'
              : 'var(--rc-fg-subtle)',
        }}
      >
        {missing ? 'Not answered yet' : value}
      </p>
    </div>
  )
}
