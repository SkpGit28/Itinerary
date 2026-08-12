'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  /** Uses the error colour for genuinely destructive confirmations. */
  destructive?: boolean
  onConfirm: () => void
}

/**
 * Focus-trapped confirmation for actions that would delete answers.
 * Cancel is the default focus so a stray Enter never clears anything.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
}: ConfirmDialogProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="rc-overlay fixed inset-0 z-50 bg-[#191917]/40 backdrop-blur-[2px]" />
        <Dialog.Content
          role="alertdialog"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            cancelRef.current?.focus()
          }}
          className="rc-sheet rc-root fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border border-[var(--rc-border)] bg-[var(--rc-surface)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-8px_40px_rgba(25,25,23,0.14)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(26rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:px-6 sm:pb-6"
        >
          <Dialog.Title className="text-lg font-semibold tracking-[-0.01em] text-[var(--rc-fg)]">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              className="flex h-12 flex-1 items-center justify-center rounded-2xl px-4 text-[0.9375rem] font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: destructive ? 'var(--rc-error)' : 'var(--rc-cta)',
              }}
            >
              {confirmLabel}
            </button>
            <Dialog.Close asChild>
              <button
                ref={cancelRef}
                type="button"
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 text-[0.9375rem] font-medium text-[var(--rc-fg)] transition-colors hover:bg-[var(--rc-surface-muted)]"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
