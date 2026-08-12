'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OtherField } from './OtherField'
import type { QuestionInputProps } from './YesNoQuestion'

/**
 * Radio cards for a list of mutually exclusive options that are too long or
 * too numerous for a segmented row. Never a dropdown, the spec calls for
 * options that are visible and directly tappable.
 */
export function SingleChoiceQuestion({
  question,
  answer,
  onChange,
  invalid,
  describedBy,
  labelledBy,
}: QuestionInputProps) {
  const options = question.options ?? []
  const selectedOption = options.find((o) => o.value === answer?.choice)
  const otherSelected = Boolean(selectedOption?.isOther)
  const otherText = answer?.otherText ?? ''
  const otherInvalid = Boolean(invalid) && otherSelected && otherText.replace(/\s/g, '').length < 2

  return (
    <div>
      <fieldset
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex flex-col gap-2',
          invalid &&
            'rounded-2xl outline outline-1 outline-offset-4 outline-[var(--rc-error-border)]'
        )}
      >
        {options.map((option) => {
          const selected = answer?.choice === option.value
          return (
            <label
              key={option.value}
              className={cn(
                'rc-option flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[0.9375rem] leading-snug transition-colors',
                selected
                  ? 'border-[var(--rc-accent)] bg-[var(--rc-accent-soft)] font-medium text-[var(--rc-accent)]'
                  : 'border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-fg)] hover:border-[var(--rc-border-strong)] hover:bg-[var(--rc-surface-muted)]'
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={selected}
                onChange={() =>
                  onChange({
                    choice: option.value,
                    // Drop stale detail text when moving off the "Other" option.
                    otherText: option.isOther ? otherText : undefined,
                  })
                }
                className="rc-sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  selected
                    ? 'border-[var(--rc-accent)] bg-[var(--rc-accent)] text-white'
                    : 'border-[var(--rc-border-strong)] bg-[var(--rc-surface)]'
                )}
              >
                {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
              </span>
              <span>{option.label}</span>
            </label>
          )
        })}
      </fieldset>

      {otherSelected ? (
        <OtherField
          id={`${question.id}-other`}
          value={otherText}
          onChange={(value) => onChange({ choice: answer?.choice, otherText: value })}
          invalid={otherInvalid}
          describedBy={describedBy}
        />
      ) : null}
    </div>
  )
}
