'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Section } from '@/lib/reality-check/types'

interface SectionIntroProps {
  section: Section
  questionCount: number
}

/**
 * Heading block at the top of each section. Emphasised sections get a little
 * more weight, a tinted rule and a serious line, without turning into a
 * warning banner.
 */
export function SectionIntro({ section, questionCount }: SectionIntroProps) {
  return (
    <header
      className={cn(
        'rounded-3xl border p-5 sm:p-6',
        section.emphasis
          ? 'border-[var(--rc-accent-border)] bg-[var(--rc-accent-soft)]'
          : 'border-[var(--rc-border)] bg-[var(--rc-surface)]'
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[0.9375rem] font-semibold tabular-nums',
            section.emphasis
              ? 'bg-[var(--rc-accent)] text-white'
              : 'bg-[var(--rc-accent-soft)] text-[var(--rc-accent)]'
          )}
        >
          {section.index}
        </span>
        {/* Header pehle hi "Section 1 / 9" dikha raha hai, isliye yahan sirf
            sawaalon ki ginti, warna teen jagah wahi cheez repeat hoti. */}
        <p className="text-xs font-medium tracking-[0.02em] text-[var(--rc-fg-subtle)]">
          Is section me {questionCount} sawaal
        </p>
      </div>
      <h2 className="mt-4 text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--rc-fg)] sm:text-2xl">
        {section.title}
      </h2>
      <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-[var(--rc-fg-muted)]">
        {section.description}
      </p>
    </header>
  )
}
