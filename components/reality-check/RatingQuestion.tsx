'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { QuestionInputProps } from './YesNoQuestion'

/**
 * A 0–10 rating. Rendered as discrete radios rather than a slider: a slider
 * has no clear "unanswered" state and is hard to set precisely on a phone.
 */
export function RatingQuestion({
  question,
  answer,
  onChange,
  invalid,
  describedBy,
  labelledBy,
}: QuestionInputProps) {
  const range = question.rating ?? { min: 0, max: 10, minLabel: '', maxLabel: '' }
  const values = React.useMemo(() => {
    const list: number[] = []
    for (let v = range.min; v <= range.max; v += 1) list.push(v)
    return list
  }, [range.min, range.max])

  return (
    <fieldset
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cn(
        invalid && 'rounded-2xl outline outline-1 outline-offset-4 outline-[var(--rc-error-border)]'
      )}
    >
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
        {values.map((value) => {
          const selected = answer?.number === value
          return (
            <label
              key={value}
              className={cn(
                'rc-option flex min-h-[2.875rem] cursor-pointer items-center justify-center rounded-xl border text-[0.9375rem] font-medium tabular-nums transition-colors',
                selected
                  ? 'border-[var(--rc-accent)] bg-[var(--rc-accent)] text-white'
                  : 'border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-fg)] hover:border-[var(--rc-border-strong)] hover:bg-[var(--rc-surface-muted)]'
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={value}
                checked={selected}
                onChange={() => onChange({ number: value })}
                className="rc-sr-only"
              />
              {/* The bare number is meaningless to a screen reader on its own. */}
              <span aria-hidden="true">{value}</span>
              <span className="rc-sr-only">
                {value === range.min
                  ? `${value} — ${range.minLabel}`
                  : value === range.max
                    ? `${value} — ${range.maxLabel}`
                    : String(value)}
              </span>
            </label>
          )
        })}
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-4 text-xs leading-snug text-[var(--rc-fg-subtle)]">
        <span className="max-w-[45%]">
          {range.min} — {range.minLabel}
        </span>
        <span className="max-w-[45%] text-right">
          {range.max} — {range.maxLabel}
        </span>
      </div>
    </fieldset>
  )
}
