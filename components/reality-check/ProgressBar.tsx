'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  /** 0–1. */
  value: number
  label: string
  className?: string
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100)

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-[var(--rc-border)]', className)}
    >
      <div
        className="rc-progress-fill h-full rounded-full bg-[var(--rc-accent)]"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
