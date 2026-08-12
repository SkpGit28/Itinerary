'use client'

import * as React from 'react'
import { ArrowRight, Clock, RotateCcw } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'
import { PrivacyNotice } from './PrivacyNotice'

interface WelcomeScreenProps {
  onStart: () => void
  onResume: () => void
  onStartOver: () => void
  /** Isi phone me adhoora questionnaire pada hai. */
  hasSavedProgress: boolean
  /** Kitne percent zaroori sawaal ho chuke hain, 0 se 100. */
  savedCompletion: number
}

const GROUND_RULES = [
  'Koi jawab sahi ya galat nahi hai',
  'Aaram se, koi jaldi nahi',
  'Jo sach me hota hai wahi likhna',
  'Kisi ka dil bachane ki zaroorat nahi, mera bhi nahi',
  'Optional wale sawaal chhod sakti ho',
  'Yahan koi judge nahi kar raha',
]

export function WelcomeScreen({
  onStart,
  onResume,
  onStartOver,
  hasSavedProgress,
  savedCompletion,
}: WelcomeScreenProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--rc-fg)] sm:text-4xl">
        Nainu, sach sach bata do.
      </h1>
      <p className="mt-3.5 text-[1.0625rem] leading-relaxed text-[var(--rc-fg-muted)] sm:text-lg">
        Ye sawaal sirf ye samajhne ke liye hain ki Sush ke saath rehna tumhe asli me kaisa lagta
        hai. Acchi baatein bhi, mushkil bhi.
      </p>

      {hasSavedProgress ? (
        <div className="mt-7 rounded-3xl border border-[var(--rc-accent-border)] bg-[var(--rc-accent-soft)] p-5">
          <h2 className="text-base font-semibold text-[var(--rc-fg)]">Arre, wapas aa gayi!</h2>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
            Isi phone me tumhara adhoora questionnaire pada hai
            {savedCompletion > 0 ? `, lagbhag ${savedCompletion}% zaroori sawaal ho chuke hain` : ''}
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onResume}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--rc-accent)] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]"
            >
              Aage badho
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--rc-border-strong)] bg-[var(--rc-surface)] px-5 text-[0.9375rem] font-medium text-[var(--rc-fg)] transition-colors hover:bg-[var(--rc-surface-muted)]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Dobara shuru
            </button>
          </div>
        </div>
      ) : null}

      <ul className="mt-8 space-y-2.5">
        {GROUND_RULES.map((rule) => (
          <li
            key={rule}
            className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-[var(--rc-fg)]"
          >
            <span
              aria-hidden="true"
              className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rc-accent)]"
            />
            {rule}
          </li>
        ))}
      </ul>

      <div className="mt-7 rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface)] p-4 sm:p-5">
        <p className="text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
          Kuch sawaal thode chubh sakte hain. Koi baat nahi. Sachha jawab hamesha perfect jawab se
          zyada kaam ka hota hai. Jhooth mat bolna bilkul bhi 🙂
        </p>
      </div>

      {!hasSavedProgress ? (
        <button
          type="button"
          onClick={onStart}
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--rc-accent)] text-base font-semibold text-white transition-colors hover:bg-[var(--rc-accent-hover)]"
        >
          Chalo shuru karte hain
          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      ) : null}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-[var(--rc-fg-subtle)]">
        <Clock className="h-4 w-4" aria-hidden="true" />
        Bas 10 minute lagenge
      </p>

      <PrivacyNotice className="mt-6" />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Pakka?"
        description="Purane saare jawab is phone se mit jayenge. Wapas nahi aayenge."
        confirmLabel="Haan, mita do"
        cancelLabel="Nahi, rehne do"
        destructive
        onConfirm={onStartOver}
      />
    </div>
  )
}
