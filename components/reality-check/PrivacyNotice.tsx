'use client'

import * as React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrivacyNoticeProps {
  className?: string
  variant?: 'inline' | 'card'
}

/**
 * Ab jawab sirf phone me nahi rehte, submit karne pe server pe bhi jaate
 * hain. Isliye ye line badalni zaroori thi. Mazaak wahi hai, par baat sach
 * honi chahiye, warna ye poore questionnaire ke bharose ko todta.
 */
const NOTICE =
  'Likhte waqt sab kuch tumhare hi phone me rehta hai. Submit karogi tabhi jawab mere paas aayenge, aur kahin nahi. Promise.'

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
