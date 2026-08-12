import { QUESTIONS, questionsForSection } from './questions'
import type { Answers, AnswerValue, Question, QuestionIssue } from './types'

/**
 * Minimum number of non-space characters an answered open question must have.
 * Deliberately low: the spec asks for "meaningful content" but also warns
 * against forcing unnecessarily long answers. Anything longer is encouraged
 * through a non-blocking hint (see `textHint`).
 */
export const MIN_MEANINGFUL_CHARS = 3

/** Minimum for a free-text field attached to an "Other" option. */
export const MIN_OTHER_CHARS = 2

export const MESSAGES = {
  unanswered: 'Please answer this question.',
  tooShort: 'Please write a little more so your answer is clear.',
  other: 'Please tell us a little more.',
  maxSelections: (n: number) => `Please choose no more than ${n}.`,
} as const

/** Characters that actually carry meaning — spaces do not count. */
export function meaningfulLength(value: string | undefined): number {
  if (!value) return 0
  return value.replace(/\s/g, '').length
}

export function isConditionMet(question: Question, answers: Answers): boolean {
  const condition = question.condition
  if (!condition) return true
  const parent = answers[condition.questionId]
  if (!parent) return false
  if (parent.choice !== undefined) return condition.anyOf.includes(parent.choice)
  if (parent.values) return parent.values.some((v) => condition.anyOf.includes(v))
  return false
}

/** Questions currently on screen for a section, after conditional logic. */
export function visibleQuestions(sectionId: string, answers: Answers): Question[] {
  return questionsForSection(sectionId).filter((q) => isConditionMet(q, answers))
}

/** True when the user has put something in this answer, regardless of validity. */
export function isAnswered(question: Question, answer: AnswerValue | undefined): boolean {
  if (!answer) return false
  switch (question.type) {
    case 'segmented':
    case 'scale':
    case 'single':
      return typeof answer.choice === 'string' && answer.choice.length > 0
    case 'rating':
      return typeof answer.number === 'number'
    case 'multi':
      return Array.isArray(answer.values) && answer.values.length > 0
    case 'text':
    case 'shortText':
      return meaningfulLength(answer.text) > 0
    default:
      return false
  }
}

/** Does the current selection include an option flagged `isOther`? */
export function hasOtherSelected(question: Question, answer: AnswerValue | undefined): boolean {
  if (!answer || !question.options) return false
  const others = question.options.filter((o) => o.isOther).map((o) => o.value)
  if (others.length === 0) return false
  if (answer.choice && others.includes(answer.choice)) return true
  return Boolean(answer.values?.some((v) => others.includes(v)))
}

/**
 * Blocking validation for a single question. Returns null when the answer may
 * pass. Optional questions only fail on rules that apply to what was entered
 * (an "Other" without detail, or too many selections).
 */
export function validateQuestion(question: Question, answers: Answers): string | null {
  const answer = answers[question.id]
  const answered = isAnswered(question, answer)

  if (question.required && !answered) return MESSAGES.unanswered

  if (
    answered &&
    (question.type === 'text' || question.type === 'shortText') &&
    meaningfulLength(answer?.text) < MIN_MEANINGFUL_CHARS
  ) {
    return MESSAGES.tooShort
  }

  if (
    question.type === 'multi' &&
    question.maxSelections &&
    (answer?.values?.length ?? 0) > question.maxSelections
  ) {
    return MESSAGES.maxSelections(question.maxSelections)
  }

  if (hasOtherSelected(question, answer) && meaningfulLength(answer?.otherText) < MIN_OTHER_CHARS) {
    return MESSAGES.other
  }

  return null
}

/**
 * Non-blocking nudge shown under open text that is answered but very brief.
 * Never prevents the user from continuing.
 */
export function textHint(question: Question, answer: AnswerValue | undefined): string | null {
  if (question.type !== 'text' && question.type !== 'shortText') return null
  if (!question.recommendedChars) return null
  const length = meaningfulLength(answer?.text)
  if (length === 0) return null
  if (length >= question.recommendedChars) return null
  if (length < MIN_MEANINGFUL_CHARS) return null
  return MESSAGES.tooShort
}

/** All blocking issues in one section, in question order. */
export function validateSection(sectionId: string, answers: Answers): QuestionIssue[] {
  return visibleQuestions(sectionId, answers).flatMap((q) => {
    const message = validateQuestion(q, answers)
    return message ? [{ questionId: q.id, message }] : []
  })
}

/** All blocking issues across the whole questionnaire, in question order. */
export function validateAll(answers: Answers): QuestionIssue[] {
  return QUESTIONS.filter((q) => isConditionMet(q, answers)).flatMap((q) => {
    const message = validateQuestion(q, answers)
    return message ? [{ questionId: q.id, message }] : []
  })
}

export interface SectionProgress {
  answered: number
  total: number
  /** Required questions still missing a valid answer. */
  missingRequired: number
}

export function sectionProgress(sectionId: string, answers: Answers): SectionProgress {
  const questions = visibleQuestions(sectionId, answers)
  let answered = 0
  let missingRequired = 0
  for (const q of questions) {
    if (isAnswered(q, answers[q.id])) answered += 1
    if (q.required && validateQuestion(q, answers)) missingRequired += 1
  }
  return { answered, total: questions.length, missingRequired }
}

/** Fraction of required questions completed, used for the progress bar. */
export function overallCompletion(answers: Answers): number {
  const required = QUESTIONS.filter((q) => q.required && isConditionMet(q, answers))
  if (required.length === 0) return 0
  const done = required.filter((q) => !validateQuestion(q, answers)).length
  return done / required.length
}
