'use client'

import * as React from 'react'
import { QuestionnaireShell } from '@/components/reality-check/QuestionnaireShell'
import { ProgressHeader } from '@/components/reality-check/ProgressHeader'
import { QuestionNavigation } from '@/components/reality-check/QuestionNavigation'
import { SectionIntro } from '@/components/reality-check/SectionIntro'
import { QuestionCard } from '@/components/reality-check/QuestionCard'
import { WelcomeScreen } from '@/components/reality-check/WelcomeScreen'
import { ReviewScreen } from '@/components/reality-check/ReviewScreen'
import { CompletionScreen } from '@/components/reality-check/CompletionScreen'
import { PrivacyNotice } from '@/components/reality-check/PrivacyNotice'
import type { SaveStatus } from '@/components/reality-check/SaveIndicator'
import { SECTIONS } from '@/lib/reality-check/questions'
import {
  overallCompletion,
  textHint,
  validateAll,
  validateQuestion,
  validateSection,
  visibleQuestions,
} from '@/lib/reality-check/validation'
import {
  clearState,
  createEmptyState,
  hasProgress,
  loadState,
  saveState,
  type StoredState,
} from '@/lib/reality-check/storage'
import type { AnswerValue } from '@/lib/reality-check/types'

const SAVE_DEBOUNCE_MS = 400

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function RealityCheckPage() {
  const [mounted, setMounted] = React.useState(false)
  const [state, setState] = React.useState<StoredState>(createEmptyState)
  const [savedExists, setSavedExists] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('idle')

  /** Sections where the user has pressed Next — errors only appear after that. */
  const [attempted, setAttempted] = React.useState<Record<string, boolean>>({})
  const [showSubmitErrors, setShowSubmitErrors] = React.useState(false)
  const [pendingFocus, setPendingFocus] = React.useState<string | null>(null)
  /**
   * True when the current section was opened from the review screen, so
   * finishing it returns straight there instead of walking forward through
   * every remaining section.
   */
  const [editingFromReview, setEditingFromReview] = React.useState(false)

  // ── Load any saved session ────────────────────────────────────────────────
  React.useEffect(() => {
    const stored = loadState()
    if (stored) {
      setSavedExists(hasProgress(stored))
      // A finished questionnaire returns straight to its completion screen;
      // an unfinished one goes through the "Welcome back" recovery state.
      setState(stored.stage === 'done' ? stored : { ...stored, stage: 'welcome' })
    }
    setMounted(true)
  }, [])

  // ── Autosave ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!mounted) return
    setSaveStatus('saving')
    const timer = window.setTimeout(() => {
      const ok = saveState({ ...state, updatedAt: new Date().toISOString() })
      setSaveStatus(ok ? 'saved' : 'unavailable')
    }, SAVE_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [state, mounted])

  // ── Scroll / focus management ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!pendingFocus) return
    const frame = window.requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(`[data-question-id="${pendingFocus}"]`)
      if (card) {
        card.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'center',
        })
        const control = card.querySelector<HTMLElement>('input, textarea, select')
        control?.focus({ preventScroll: true })
      }
      setPendingFocus(null)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pendingFocus])

  const { stage, sectionIndex, answers } = state
  const section = sectionIndex >= 0 ? SECTIONS[sectionIndex] : undefined

  React.useEffect(() => {
    if (pendingFocus) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [stage, sectionIndex, pendingFocus])

  // ── Derived values ────────────────────────────────────────────────────────
  const completion = React.useMemo(() => overallCompletion(answers), [answers])
  const allIssues = React.useMemo(() => validateAll(answers), [answers])

  // "Saved" only means something once there is an answer to save.
  const visibleSaveStatus: SaveStatus =
    Object.keys(answers).length > 0 ? saveStatus : 'idle'

  const sectionQuestions = React.useMemo(
    () => (section ? visibleQuestions(section.id, answers) : []),
    [section, answers]
  )

  // ── State updates ─────────────────────────────────────────────────────────
  const setAnswer = React.useCallback((questionId: string, next: AnswerValue) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [questionId]: next } }))
  }, [])

  function goToSection(index: number, fromReview = false) {
    setEditingFromReview(fromReview)
    setState((prev) => ({ ...prev, stage: 'section', sectionIndex: index }))
  }

  function goToReview() {
    setEditingFromReview(false)
    setState((prev) => ({ ...prev, stage: 'review' }))
  }

  function handleStart() {
    setState((prev) => ({ ...prev, stage: 'section', sectionIndex: 0 }))
  }

  function handleResume() {
    // Resume on the first section that still has a required answer missing,
    // falling back to wherever the user left off.
    const firstIncomplete = SECTIONS.findIndex((s) => validateSection(s.id, answers).length > 0)
    const target = firstIncomplete >= 0 ? firstIncomplete : Math.max(0, state.sectionIndex)
    if (firstIncomplete < 0 && state.sectionIndex < 0) {
      setState((prev) => ({ ...prev, stage: 'review' }))
      return
    }
    goToSection(target)
  }

  function handleStartOver() {
    clearState()
    setSavedExists(false)
    setAttempted({})
    setShowSubmitErrors(false)
    setState(createEmptyState())
  }

  function handleNext() {
    if (!section) return
    const issues = validateSection(section.id, answers)
    setAttempted((prev) => ({ ...prev, [section.id]: true }))

    if (issues.length > 0) {
      setPendingFocus(issues[0].questionId)
      return
    }

    if (editingFromReview || sectionIndex >= SECTIONS.length - 1) {
      goToReview()
    } else {
      goToSection(sectionIndex + 1)
    }
  }

  function handleBack() {
    if (stage === 'review') {
      goToSection(SECTIONS.length - 1)
      return
    }
    if (editingFromReview) {
      goToReview()
      return
    }
    if (sectionIndex <= 0) {
      setState((prev) => ({ ...prev, stage: 'welcome', sectionIndex: -1 }))
      return
    }
    goToSection(sectionIndex - 1)
  }

  function handleJumpToQuestion(questionId: string) {
    const targetIndex = SECTIONS.findIndex((s) =>
      visibleQuestions(s.id, answers).some((q) => q.id === questionId)
    )
    if (targetIndex < 0) return
    setAttempted((prev) => ({ ...prev, [SECTIONS[targetIndex].id]: true }))
    goToSection(targetIndex, true)
    setPendingFocus(questionId)
  }

  function handleSubmit() {
    if (allIssues.length > 0 || !state.honestyConfirmed) {
      setShowSubmitErrors(true)
      // Reveal inline errors in every section too, so Edit lands on a
      // section that already shows what is missing.
      setAttempted(Object.fromEntries(SECTIONS.map((s) => [s.id, true])))
      return
    }
    setState((prev) => ({
      ...prev,
      stage: 'done',
      submittedAt: new Date().toISOString(),
    }))
  }

  // ── Render ────────────────────────────────────────────────────────────────

  // Nothing is rendered from storage until after mount, so the server and
  // client markup always agree.
  if (!mounted) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-6">
        <p className="text-sm text-[var(--rc-fg-subtle)]">Loading…</p>
      </div>
    )
  }

  if (stage === 'done') {
    return (
      <CompletionScreen
        answers={answers}
        completedAt={state.submittedAt ?? new Date().toISOString()}
        onStartAgain={handleStartOver}
      />
    )
  }

  if (stage === 'welcome') {
    return (
      <WelcomeScreen
        onStart={handleStart}
        onResume={handleResume}
        onStartOver={handleStartOver}
        hasSavedProgress={savedExists}
        savedCompletion={Math.round(completion * 100)}
      />
    )
  }

  if (stage === 'review') {
    return (
      <QuestionnaireShell
        transitionKey="review"
        header={
          <ProgressHeader
            stepLabel="Last step"
            title="Review & submit"
            completion={completion}
            saveStatus={visibleSaveStatus}
          />
        }
        footer={
          <QuestionNavigation
            onBack={handleBack}
            onNext={handleSubmit}
            nextLabel="Submit"
            positionLabel="Review"
          />
        }
      >
        <ReviewScreen
          answers={answers}
          issues={allIssues}
          honestyConfirmed={state.honestyConfirmed}
          onHonestyChange={(value) =>
            setState((prev) => ({ ...prev, honestyConfirmed: value }))
          }
          onEditSection={(index) => goToSection(index, true)}
          onJumpToQuestion={handleJumpToQuestion}
          onSubmit={handleSubmit}
          showSubmitErrors={showSubmitErrors}
        />
      </QuestionnaireShell>
    )
  }

  if (!section) return null

  const showErrors = Boolean(attempted[section.id])
  const isLastSection = sectionIndex >= SECTIONS.length - 1

  return (
    <QuestionnaireShell
      transitionKey={section.id}
      header={
        <ProgressHeader
          stepLabel={`Section ${section.index} of ${SECTIONS.length}`}
          title={section.title}
          completion={completion}
          saveStatus={visibleSaveStatus}
        />
      }
      footer={
        <QuestionNavigation
          onBack={handleBack}
          onNext={handleNext}
          backLabel={editingFromReview ? 'Review' : 'Back'}
          nextLabel={editingFromReview ? 'Done' : isLastSection ? 'Review' : 'Next'}
          positionLabel={
            editingFromReview
              ? `Editing section ${section.index}`
              : `${section.index} of ${SECTIONS.length}`
          }
        />
      }
    >
      <div className="space-y-3.5">
        <SectionIntro section={section} questionCount={sectionQuestions.length} />

        {sectionQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onChange={(next) => setAnswer(question.id, next)}
            error={showErrors ? validateQuestion(question, answers) : null}
            hint={textHint(question, answers[question.id])}
            isFollowUp={Boolean(question.condition)}
          />
        ))}

        <PrivacyNotice className="pt-3" />
      </div>
    </QuestionnaireShell>
  )
}
