'use client'

import * as React from 'react'
import { ArrowRight, Clock, Heart, MessageSquareText, PenLine, RotateCcw } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'
import { HandHeart } from './HandHeart'
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
  {
    icon: Heart,
    title: 'Sach bolna.',
    body: 'Kisi baat ko asli se accha dikhane ki zaroorat nahi hai.',
  },
  {
    icon: MessageSquareText,
    title: 'Apne experience se batana.',
    body: 'Soch ke likhna ki hum dono ke beech asli me hota kya hai.',
  },
  {
    icon: PenLine,
    title: 'Jo nahi likhna, chhod dena.',
    body: 'Optional wale sawaal aaram se skip kar sakti ho.',
  },
]

export function WelcomeScreen({
  onStart,
  onResume,
  onStartOver,
  hasSavedProgress,
  savedCompletion,
}: WelcomeScreenProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  /*
   * Wapas aane pe wo saara intro dobara padhne ka koi matlab nahi. Us waqt
   * sirf heading aur resume wala card dikhta hai, taaki seedha aage badha ja
   * sake. Pehli baar aane pe hi poora intro dikhta hai.
   */
  const confirmDialog = (
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
  )

  const heading = (
    <h1 className="text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--rc-fg)] sm:text-[2.5rem]">
      Nainu, please help me, sab sach batana.{' '}
      <HandHeart className="inline-block h-[0.8em] w-[0.8em] align-baseline text-[var(--rc-accent)]" />
    </h1>
  )

  if (hasSavedProgress) {
    return (
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center px-5 py-12 sm:px-6 sm:py-16">
        {heading}

        <div className="mt-9 rounded-3xl border border-[var(--rc-accent-border)] bg-[var(--rc-accent-soft)] p-6 sm:p-7">
          <h2 className="text-lg font-semibold leading-snug text-[var(--rc-fg)]">
            Arre, wapas aa gayi!
          </h2>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
            Isi phone me tumhara adhoora questionnaire pada hai
            {savedCompletion > 0 ? `, lagbhag ${savedCompletion}% zaroori sawaal ho chuke hain` : ''}
            .
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={onResume}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--rc-cta)] px-6 text-base font-semibold text-white transition-colors hover:bg-[var(--rc-cta-hover)]"
            >
              Aage badho
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--rc-border-strong)] bg-[var(--rc-surface)] px-6 text-base font-medium text-[var(--rc-fg)] transition-colors hover:bg-[var(--rc-surface-muted)]"
            >
              <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
              Dobara shuru
            </button>
          </div>
        </div>

        {confirmDialog}
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center px-5 py-12 sm:px-6 sm:py-16">
      {heading}

      <ul className="mt-8 overflow-hidden rounded-3xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
        {GROUND_RULES.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex items-start gap-4 border-t border-[var(--rc-border)] px-5 py-5 first:border-t-0"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--rc-accent-soft)]"
            >
              <Icon className="h-[18px] w-[18px] text-[var(--rc-accent)]" strokeWidth={1.9} />
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block text-[0.9375rem] font-semibold leading-snug text-[var(--rc-fg)]">
                {title}
              </span>
              <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/*
        Ye card CTA ke bilkul upar hai, isliye page se saaf alag dikhna
        chahiye. Surface-muted page ke background jaisa hi lag raha tha,
        isliye ab brand ka halka pink tint aur uske hisaab ka border.
      */}
      <figure className="mt-5 flex gap-3.5 rounded-3xl border border-[var(--rc-accent-border)] bg-[var(--rc-accent-soft)] px-5 py-5">
        <span
          aria-hidden="true"
          className="rc-hand shrink-0 text-[2rem] leading-[0.8] text-[var(--rc-accent)] opacity-60"
        >
          &ldquo;
        </span>
        <blockquote className="min-w-0">
          <p className="text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
            Kuch sawaal thode chubh sakte hain. Koi baat nahi. Perfect jawab ki zaroorat nahi hai,
            bas sachhe jawab chahiye.
          </p>
          <p className="rc-hand mt-2.5 text-[1.35rem] leading-snug text-[var(--rc-accent-text)]">
            Jo genuinely feel hota hai, wahi likhna. 🙂
          </p>
        </blockquote>
      </figure>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--rc-cta)] text-base font-semibold text-white transition-colors hover:bg-[var(--rc-cta-hover)]"
      >
        Chalo shuru karte hain
        <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-sm text-[var(--rc-fg-subtle)]">
        <Clock className="h-4 w-4" aria-hidden="true" />
        Bas 10 minute lagenge
      </p>

      <PrivacyNotice className="mt-7" />

      {confirmDialog}
    </div>
  )
}
