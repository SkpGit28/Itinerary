'use client'

import * as React from 'react'
import { ProgressBar } from './ProgressBar'
import { SaveIndicator, type SaveStatus } from './SaveIndicator'

interface ProgressHeaderProps {
  /** e.g. "Section 3 of 9" or "Review". */
  stepLabel: string
  title: string
  /** 0–1 completion of required questions. */
  completion: number
  saveStatus: SaveStatus
}

export function ProgressHeader({
  stepLabel,
  title,
  completion,
  saveStatus,
}: ProgressHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--rc-border)] bg-[var(--rc-bg)]/92 backdrop-blur-md">
      <div className="mx-auto w-full max-w-2xl px-4 pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--rc-fg)]">{title}</p>
            <p className="mt-0.5 text-xs text-[var(--rc-fg-subtle)]">{stepLabel}</p>
          </div>
          <SaveIndicator status={saveStatus} />
        </div>
        <ProgressBar
          value={completion}
          label="Questionnaire progress"
          className="mt-2.5"
        />
      </div>
    </header>
  )
}
