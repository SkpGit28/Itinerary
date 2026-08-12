'use client'

import * as React from 'react'
import { AlertCircle, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValidationMessageProps {
  id?: string
  message: string
  /** `hint` is guidance, not a failure — it never blocks the user. */
  tone?: 'error' | 'hint'
  className?: string
}

/**
 * Validation feedback. Colour is never the only signal: each tone also
 * carries its own icon and wording.
 */
export function ValidationMessage({
  id,
  message,
  tone = 'error',
  className,
}: ValidationMessageProps) {
  const isError = tone === 'error'
  const Icon = isError ? AlertCircle : PenLine

  return (
    <p
      id={id}
      className={cn(
        'mt-3 flex items-start gap-2 text-sm leading-snug',
        isError ? 'text-[var(--rc-error)]' : 'text-[var(--rc-fg-subtle)]',
        className
      )}
    >
      <Icon className="mt-[1px] h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}
