'use client'

import * as React from 'react'
import { Info } from 'lucide-react'
import { InfoBottomSheet } from './InfoBottomSheet'
import type { QuestionInfo } from '@/lib/reality-check/types'

interface QuestionInfoButtonProps {
  questionTitle: string
  info: QuestionInfo
}

/**
 * The "i" affordance on every question card. Sized well above the 44px
 * minimum touch target rather than relying on a small hover tooltip.
 */
export function QuestionInfoButton({ questionTitle, info }: QuestionInfoButtonProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="What does this question mean?"
        className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--rc-fg-subtle)] transition-colors hover:bg-[var(--rc-surface-muted)] hover:text-[var(--rc-accent)]"
      >
        <Info className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      <InfoBottomSheet
        open={open}
        onOpenChange={setOpen}
        questionTitle={questionTitle}
        info={info}
      />
    </>
  )
}
