'use client'

import * as React from 'react'
import { AlertCircle, ChevronDown, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReviewAnswer } from './ReviewAnswer'
import type { Answers, Question, Section } from '@/lib/reality-check/types'
import type { SectionProgress } from '@/lib/reality-check/validation'

interface ReviewSectionProps {
  section: Section
  questions: Question[]
  answers: Answers
  progress: SectionProgress
  onEdit: () => void
  /** Opened automatically when the section still has a missing required answer. */
  defaultOpen?: boolean
}

export function ReviewSection({
  section,
  questions,
  answers,
  progress,
  onEdit,
  defaultOpen = false,
}: ReviewSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const panelId = `review-panel-${section.id}`
  const headingId = `review-heading-${section.id}`

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <div className="flex items-stretch">
        <button
          type="button"
          id={headingId}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[4.5rem] flex-1 items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--rc-surface-muted)]"
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'h-4 w-4 shrink-0 text-[var(--rc-fg-subtle)] transition-transform',
              open && 'rotate-180'
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-semibold leading-snug text-[var(--rc-fg)]">
              {section.title}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--rc-fg-subtle)]">
              <span className="tabular-nums">
                {progress.answered}/{progress.total} ho gaye
              </span>
              {progress.missingRequired > 0 ? (
                <span className="flex items-center gap-1 text-[var(--rc-error)]">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {progress.missingRequired} zaroori baaki
                </span>
              ) : null}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 border-l border-[var(--rc-border)] text-xs font-medium text-[var(--rc-accent)] transition-colors hover:bg-[var(--rc-accent-soft)]"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Badlo
          <span className="rc-sr-only">{section.title}</span>
        </button>
      </div>

      <div id={panelId} role="region" aria-labelledby={headingId} hidden={!open}>
        <div className="border-t border-[var(--rc-border)] bg-[var(--rc-surface-muted)]">
          {questions.map((question) => (
            <ReviewAnswer key={question.id} question={question} answer={answers[question.id]} />
          ))}
        </div>
      </div>
    </div>
  )
}
