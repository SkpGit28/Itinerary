'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OtherField } from './OtherField'
import type { QuestionInputProps } from './YesNoQuestion'

/**
 * Multi-select list. When a maximum applies, remaining options are disabled
 * once the limit is reached rather than silently ignoring the tap, and the
 * limit is stated in text above the options.
 */
export function MultiChoiceQuestion({
  question,
  answer,
  onChange,
  invalid,
  describedBy,
  labelledBy,
}: QuestionInputProps) {
  const options = question.options ?? []
  const selected = React.useMemo(() => answer?.values ?? [], [answer?.values])
  const max = question.maxSelections
  const atLimit = typeof max === 'number' && selected.length >= max

  const otherValues = options.filter((o) => o.isOther).map((o) => o.value)
  const otherSelected = selected.some((v) => otherValues.includes(v))
  const otherText = answer?.otherText ?? ''
  const otherInvalid = Boolean(invalid) && otherSelected && otherText.replace(/\s/g, '').length < 2

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]

    // Drop stale detail text once the "Other" option is no longer selected.
    const stillHasOther = next.some((v) => otherValues.includes(v))
    onChange({ values: next, otherText: stillHasOther ? otherText : undefined })
  }

  const limitId = `${question.id}-limit`

  return (
    <div>
      {typeof max === 'number' ? (
        <p id={limitId} className="mb-2.5 text-sm text-[var(--rc-fg-muted)]">
          Choose up to {max}.{' '}
          <span className="text-[var(--rc-fg-subtle)]">
            {selected.length} of {max} chosen
          </span>
        </p>
      ) : (
        <p className="mb-2.5 text-sm text-[var(--rc-fg-muted)]">You can choose more than one.</p>
      )}

      <fieldset
        aria-labelledby={labelledBy}
        aria-describedby={[typeof max === 'number' ? limitId : null, describedBy]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex flex-col gap-2',
          invalid &&
            'rounded-2xl outline outline-1 outline-offset-4 outline-[var(--rc-error-border)]'
        )}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          const disabled = atLimit && !isSelected
          return (
            <label
              key={option.value}
              className={cn(
                'rc-option flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[0.9375rem] leading-snug transition-colors',
                isSelected
                  ? 'border-[var(--rc-accent)] bg-[var(--rc-accent-soft)] font-medium text-[var(--rc-accent)]'
                  : 'border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-fg)]',
                !isSelected &&
                  !disabled &&
                  'hover:border-[var(--rc-border-strong)] hover:bg-[var(--rc-surface-muted)]'
              )}
            >
              <input
                type="checkbox"
                name={question.id}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggle(option.value)}
                className="rc-sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                  isSelected
                    ? 'border-[var(--rc-accent)] bg-[var(--rc-accent)] text-white'
                    : 'border-[var(--rc-border-strong)] bg-[var(--rc-surface)]'
                )}
              >
                {isSelected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
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
          onChange={(value) => onChange({ values: selected, otherText: value })}
          invalid={otherInvalid}
          describedBy={describedBy}
        />
      ) : null}
    </div>
  )
}
