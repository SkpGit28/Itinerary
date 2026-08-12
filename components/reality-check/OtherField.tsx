'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface OtherFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  describedBy?: string
}

/**
 * Revealed underneath a choice list when an "Other" option is selected.
 * Its content becomes required once that option is chosen.
 */
export function OtherField({ id, value, onChange, invalid, describedBy }: OtherFieldProps) {
  return (
    <div className="mt-2.5">
      <label htmlFor={id} className="mb-1.5 block text-sm text-[var(--rc-fg-muted)]">
        Thoda aur bata do…
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        className={cn(
          'min-h-[3rem] w-full rounded-2xl border bg-[var(--rc-surface)] px-4 py-3 text-[0.9375rem] leading-snug text-[var(--rc-fg)] transition-colors placeholder:text-[var(--rc-fg-subtle)]',
          invalid
            ? 'border-[var(--rc-error-border)] bg-[var(--rc-error-soft)]'
            : 'border-[var(--rc-border)] hover:border-[var(--rc-border-strong)]'
        )}
        placeholder="Apne shabdon me…"
      />
    </div>
  )
}
