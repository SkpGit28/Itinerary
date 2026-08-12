'use client'

import * as React from 'react'
import { Check, Copy, Download, FileJson, Printer, RotateCcw, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from './ConfirmDialog'
import { PrivacyNotice } from './PrivacyNotice'
import {
  buildJsonExport,
  buildTextExport,
  DISCLAIMER,
  exportFileName,
} from '@/lib/reality-check/export'
import type { Answers } from '@/lib/reality-check/types'

interface CompletionScreenProps {
  answers: Answers
  completedAt: string
  onStartAgain: () => void
}

type ActionState = 'idle' | 'done' | 'failed'

function downloadBlob(contents: string, fileName: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  // Give the browser a tick to start the download before releasing the URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path below.
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

export function CompletionScreen({ answers, completedAt, onStartAgain }: CompletionScreenProps) {
  const [copyState, setCopyState] = React.useState<ActionState>('idle')
  const [shareSupported, setShareSupported] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  // Feature detection happens after mount so server and client markup match.
  React.useEffect(() => {
    setShareSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const text = React.useMemo(
    () => buildTextExport(answers, completedAt),
    [answers, completedAt]
  )

  React.useEffect(() => {
    if (copyState === 'idle') return
    const timer = window.setTimeout(() => setCopyState('idle'), 2500)
    return () => window.clearTimeout(timer)
  }, [copyState])

  async function handleCopy() {
    setCopyState((await copyText(text)) ? 'done' : 'failed')
  }

  function handleDownloadText() {
    downloadBlob(text, exportFileName('txt'), 'text/plain;charset=utf-8')
  }

  function handleDownloadJson() {
    const json = JSON.stringify(buildJsonExport(answers, completedAt), null, 2)
    downloadBlob(json, exportFileName('json'), 'application/json')
  }

  async function handleShare() {
    try {
      await navigator.share({ title: 'Relationship Reality Check', text })
    } catch {
      // Cancelled or unsupported, nothing to report.
    }
  }

  const secondaryButton =
    'flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 text-[0.9375rem] font-medium text-[var(--rc-fg)] transition-colors hover:bg-[var(--rc-surface-muted)]'

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rc-no-print">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rc-accent-soft)]"
        >
          <Check className="h-5 w-5 text-[var(--rc-accent)]" strokeWidth={2.5} />
        </div>

        <h1 className="mt-5 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--rc-fg)] sm:text-3xl">
          Thank you Nainu, sach bolne ke liye. ❤️
        </h1>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-[var(--rc-fg-muted)]">
          Sab jawab mil gaye. Sachhe jawab hamesha perfect jawab se zyada kaam ke hote hain.
        </p>

        <div className="mt-8 grid gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl text-base font-semibold text-white transition-colors',
              copyState === 'failed'
                ? 'bg-[var(--rc-error)]'
                : 'bg-[var(--rc-accent)] hover:bg-[var(--rc-accent-hover)]'
            )}
          >
            {copyState === 'done' ? (
              <>
                <Check className="h-[18px] w-[18px]" aria-hidden="true" />
                Copy ho gaya
              </>
            ) : copyState === 'failed' ? (
              'Copy nahi hua, download kar lo'
            ) : (
              <>
                <Copy className="h-[18px] w-[18px]" aria-hidden="true" />
                Saare jawab copy karo
              </>
            )}
          </button>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <button type="button" onClick={handleDownloadText} className={secondaryButton}>
              <Download className="h-[18px] w-[18px]" aria-hidden="true" />
              .txt download karo
            </button>
            <button type="button" onClick={handleDownloadJson} className={secondaryButton}>
              <FileJson className="h-[18px] w-[18px]" aria-hidden="true" />
              .json download karo
            </button>
            <button type="button" onClick={() => window.print()} className={secondaryButton}>
              <Printer className="h-[18px] w-[18px]" aria-hidden="true" />
              Print ya PDF banao
            </button>
            {shareSupported ? (
              <button type="button" onClick={handleShare} className={secondaryButton}>
                <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
                Jawab share karo
              </button>
            ) : null}
          </div>
        </div>

        <p aria-live="polite" className="rc-sr-only">
          {copyState === 'done'
            ? 'Jawab copy ho gaye.'
            : copyState === 'failed'
              ? 'Copy nahi hua. Download kar lo.'
              : ''}
        </p>

        <div className="mt-8 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface-muted)] p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-[var(--rc-fg)]">Ye kya hai, aur kya nahi hai</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--rc-fg-muted)]">
            {DISCLAIMER} Ye questionnaire tumhare rishte ko na koi score deta hai, na koi rating,
            na koi matlab nikaalta hai. Export file me tumhare jawab bilkul waise hi rehte hain
            jaise tumne likhe, saath me ek note bhi jo padhne wale se kehta hai ki dono ko barabar
            tarazu me tolna.
          </p>
        </div>

        <PrivacyNotice className="mt-6" />

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="mx-auto mt-8 flex min-h-[2.75rem] items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium text-[var(--rc-fg-muted)] transition-colors hover:bg-[var(--rc-surface-muted)] hover:text-[var(--rc-fg)]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Dobara shuru karo
        </button>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
  title="Pakka?"
  description="Saare jawab is phone se mit jayenge. Rakhne hain toh pehle copy ya download kar lo."
  confirmLabel="Haan, mita do"
  cancelLabel="Nahi, rehne do"
          destructive
          onConfirm={onStartAgain}
        />
      </div>

      {/* Printed / saved-as-PDF output. Hidden on screen. */}
      <pre className="rc-print-only whitespace-pre-wrap font-sans text-[11pt] leading-relaxed text-black">
        {text}
      </pre>
    </div>
  )
}
