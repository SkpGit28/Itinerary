'use client'

import * as React from 'react'
import { Settings } from 'lucide-react'

/**
 * Shown for a beat between sections. It gives the jump somewhere to land
 * instead of the list snapping to a new set of questions, and carries a
 * warm line so the questionnaire feels less like a form.
 *
 * One line per section boundary, in order, so the same message never
 * repeats in a single run.
 */
export const TRANSITION_LINES = [
  'Jhooth mat bolna bilkul bhi 😄',
  'Nainu I love you yrr ❤️',
  'Sach sach batana, promise? 🤞',
  'Aadha ho gaya Nainu, shabash 🌸',
  'Koi jaldi nahi, aaram se ✨',
  'Ye wala section mera favourite hai 🥹',
  'Thoda mushkil tha na? Proud of you 🤍',
  'Bas thode se sawaal aur, meri jaan 💫',
  'Ho gaya Nainu, thank you seriously 🙏',
]

export function lineForSection(index: number): string {
  return TRANSITION_LINES[index] ?? TRANSITION_LINES[TRANSITION_LINES.length - 1]
}

interface SectionTransitionProps {
  line: string
}

export function SectionTransition({ line }: SectionTransitionProps) {
  return (
    <div
      // Decorative pause, not a dialog — it takes no focus and traps nothing.
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-[var(--rc-bg)]/95 px-8 backdrop-blur-sm"
    >
      <Settings
        aria-hidden="true"
        strokeWidth={1.5}
        className="rc-gear h-9 w-9 text-[var(--rc-accent)]"
      />
      <p className="rc-line text-center text-lg font-medium leading-snug tracking-[-0.01em] text-[var(--rc-fg)]">
        {line}
      </p>
      {/* Announce the move politely rather than reading the whole overlay. */}
      <p aria-live="polite" className="rc-sr-only">
        Saving this section. {line}
      </p>
    </div>
  )
}
