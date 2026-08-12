'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { DEFAULT_TIP } from '@/lib/reality-check/questions'
import type { QuestionInfo } from '@/lib/reality-check/types'

interface InfoBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The question the sheet explains, shown above the explanation. */
  questionTitle: string
  info: QuestionInfo
}

/**
 * Explanation panel for a single question. Slides up from the bottom on
 * phones and becomes a centered dialog from `sm` up. Closing it never
 * changes the answer, it is purely informational.
 */
export function InfoBottomSheet({
  open,
  onOpenChange,
  questionTitle,
  info,
}: InfoBottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="rc-overlay fixed inset-0 z-50 bg-[#191917]/40 backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="rc-sheet rc-root fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border border-[var(--rc-border)] bg-[var(--rc-surface)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_40px_rgba(25,25,23,0.14)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(30rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:px-6 sm:pb-6 sm:pt-5 sm:shadow-[0_24px_60px_rgba(25,25,23,0.18)]"
          data-rc-scroll
        >
          {/* Drag affordance, decorative, mobile only. */}
          <div
            aria-hidden="true"
            className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--rc-border-strong)] sm:hidden"
          />

          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold tracking-[-0.01em] text-[var(--rc-fg)]">
              Iska matlab kya hai?
            </Dialog.Title>
            <Dialog.Close
              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--rc-fg-muted)] transition-colors hover:bg-[var(--rc-surface-muted)] hover:text-[var(--rc-fg)]"
              aria-label="Band karo"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <p className="mt-3 rounded-xl bg-[var(--rc-surface-muted)] px-3.5 py-3 text-sm leading-relaxed text-[var(--rc-fg-muted)]">
            {questionTitle}
          </p>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--rc-fg)]">{info.what}</p>

          {info.example ? (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--rc-fg-subtle)]">
                Jaise ki
              </h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--rc-fg)]">
                {info.example}
              </p>
            </div>
          ) : null}

          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--rc-fg-subtle)]">
              Tip
            </h3>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--rc-fg)]">
              {info.tip ?? DEFAULT_TIP}
            </p>
          </div>

          <Dialog.Close className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--rc-accent)] text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]">
            Samajh gayi
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
