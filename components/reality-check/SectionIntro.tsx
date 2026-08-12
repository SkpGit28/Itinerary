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
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.1em]',
          section.emphasis ? 'text-[var(--rc-accent)]' : 'text-[var(--rc-fg-subtle)]'
        )}
      >
        Section {section.index} / 9
      </p>
      <h2 className="mt-2 text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--rc-fg)] sm:text-2xl">
        {section.title}
      </h2>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--rc-fg-muted)]">
        {section.description}
      </p>
      <p className="mt-3 text-xs text-[var(--rc-fg-subtle)]">
        Is section me {questionCount} sawaal
      </p>
    </header>
  )
}
