'use client'

import * as React from 'react'
import { Check, CloudOff, Loader2 } from 'lucide-react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unavailable'

interface SaveIndicatorProps {
  status: SaveStatus
}

/**
 * Quiet confirmation that answers are being kept on this device.
 * Announced politely so a screen reader is not interrupted mid-answer.
 */
export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') {
    return <span aria-live="polite" className="rc-sr-only" />
  }

  if (status === 'unavailable') {
    return (
      <span
        aria-live="polite"
        className="flex items-center gap-1.5 text-xs text-[var(--rc-fg-subtle)]"
      >
        <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />
        Is phone me save nahi hua
      </span>
    )
  }

  return (
    <span
      aria-live="polite"
      className="flex items-center gap-1.5 text-xs text-[var(--rc-fg-subtle)]"
    >
      {status === 'saving' ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Save ho raha hai
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Save ho gaya
        </>
      )}
    </span>
  )
}
