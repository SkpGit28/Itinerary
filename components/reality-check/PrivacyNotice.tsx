'use client'

import * as React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrivacyNoticeProps {
  className?: string
  variant?: 'inline' | 'card'
}

const NOTICE =
  'Your answers are stored locally on this device unless you choose to export or share them.'

export function PrivacyNotice({ className, variant = 'inline' }: PrivacyNoticeProps) {
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface-muted)] p-4',
          className
        )}
      >
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rc-fg-subtle)]" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-[var(--rc-fg-muted)]">{NOTICE}</p>
      </div>
    )
  }

  return (
    <p
      className={cn(
        'flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-[var(--rc-fg-subtle)]',
        className
      )}
    >
      <Lock className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{NOTICE}</span>
    </p>
  )
}
