import { QUESTIONS, SECTIONS, labelForValue } from './questions'
import { isConditionMet } from './validation'
import type { Answers, AnswerValue, Question } from './types'

export const NOT_ANSWERED = '(jawab nahi diya)'

export const DISCLAIMER =
  'Ye jawab ek insaan ke apne experience hain, koi medical ya clinical diagnosis nahi hain.'

/**
 * Appended to the text export so the answers can be handed straight to an AI
 * for a fair, non-diagnostic reading.
 */
export const ANALYSIS_INSTRUCTION = `Analysis instruction:

Analyze these answers fairly. Separate:

1. Healthy relationship behaviour
2. Respondent's personal insecurity
3. Partner's potentially unhealthy behaviour
4. Communication problems
5. Control/restriction concerns
6. Trust problems
7. Compatibility problems
8. Positive relationship strengths
9. Areas requiring change
10. Serious concerns requiring professional support

Do not diagnose either person.
Do not automatically take either person's side.
Use specific answers as evidence.
Distinguish facts from feelings and interpretations.`

/** Plain-text rendering of one answer, without the question text. */
export function formatAnswer(question: Question, answer: AnswerValue | undefined): string {
  if (!answer) return NOT_ANSWERED

  switch (question.type) {
    case 'segmented':
    case 'scale':
    case 'single': {
      if (!answer.choice) return NOT_ANSWERED
      const label = labelForValue(question, answer.choice)
      const other = answer.otherText?.trim()
      return other ? `${label}, ${other}` : label
    }
    case 'rating': {
      if (typeof answer.number !== 'number') return NOT_ANSWERED
      const range = question.rating
      if (!range) return String(answer.number)
      return `${answer.number} / ${range.max} (${range.min} = ${range.minLabel}, ${range.max} = ${range.maxLabel})`
    }
    case 'multi': {
      const values = answer.values ?? []
      if (values.length === 0) return NOT_ANSWERED
      const labels = values.map((v) => labelForValue(question, v))
      const other = answer.otherText?.trim()
      const rendered = labels.join(', ')
      return other ? `${rendered}, ${other}` : rendered
    }
    case 'text':
    case 'shortText': {
      const text = answer.text?.trim()
      return text ? text : NOT_ANSWERED
    }
    default:
      return NOT_ANSWERED
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * AI-friendly plain-text export: every question in order with its full text
 * and the raw answer. Nothing is summarised or interpreted here.
 */
export function buildTextExport(answers: Answers, completedAt = new Date().toISOString()): string {
  const lines: string[] = []

  lines.push('RELATIONSHIP REALITY CHECK')
  lines.push(`Date: ${formatDate(completedAt)}`)
  lines.push('')
  lines.push(DISCLAIMER)
  lines.push('')
  lines.push('='.repeat(60))

  for (const section of SECTIONS) {
    const questions = QUESTIONS.filter(
      (q) => q.sectionId === section.id && isConditionMet(q, answers)
    )
    if (questions.length === 0) continue

    lines.push('')
    lines.push(`SECTION ${section.index}: ${section.title.toUpperCase()}`)
    lines.push(section.description)
    lines.push('-'.repeat(60))

    for (const question of questions) {
      lines.push('')
      lines.push(`Q${question.displayNumber}${question.required ? ' (zaroori)' : ' (optional)'}:`)
      lines.push(question.title)
      lines.push('')
      lines.push('Jawab:')
      lines.push(formatAnswer(question, answers[question.id]))
      lines.push('')
    }
    lines.push('='.repeat(60))
  }

  lines.push('')
  lines.push(DISCLAIMER)
  lines.push('')
  lines.push(ANALYSIS_INSTRUCTION)
  lines.push('')

  return lines.join('\n')
}

export interface JsonExportQuestion {
  id: string
  number: string
  section: string
  sectionIndex: number
  question: string
  required: boolean
  type: string
  answer: string | string[] | number | null
  answerLabels?: string[]
  otherDetails?: string
}

export interface JsonExport {
  title: string
  date: string
  disclaimer: string
  analysisInstruction: string
  responses: JsonExportQuestion[]
}

/** Structured export, same content as the text export, machine-readable. */
export function buildJsonExport(answers: Answers, completedAt = new Date().toISOString()): JsonExport {
  const responses: JsonExportQuestion[] = []

  for (const section of SECTIONS) {
    for (const question of QUESTIONS) {
      if (question.sectionId !== section.id) continue
      if (!isConditionMet(question, answers)) continue

      const answer = answers[question.id]
      let raw: string | string[] | number | null = null
      let answerLabels: string[] | undefined

      switch (question.type) {
        case 'segmented':
        case 'scale':
        case 'single':
          raw = answer?.choice ?? null
          if (answer?.choice) answerLabels = [labelForValue(question, answer.choice)]
          break
        case 'rating':
          raw = typeof answer?.number === 'number' ? answer.number : null
          break
        case 'multi':
          raw = answer?.values?.length ? answer.values : null
          if (answer?.values?.length) {
            answerLabels = answer.values.map((v) => labelForValue(question, v))
          }
          break
        default:
          raw = answer?.text?.trim() || null
      }

      responses.push({
        id: question.id,
        number: question.displayNumber,
        section: section.title,
        sectionIndex: section.index,
        question: question.title,
        required: question.required,
        type: question.type,
        answer: raw,
        ...(answerLabels ? { answerLabels } : {}),
        ...(answer?.otherText?.trim() ? { otherDetails: answer.otherText.trim() } : {}),
      })
    }
  }

  return {
    title: 'Relationship Reality Check',
    date: completedAt,
    disclaimer: DISCLAIMER,
    analysisInstruction: ANALYSIS_INSTRUCTION,
    responses,
  }
}

/** File-system friendly name, e.g. relationship-reality-check-2026-08-12.txt */
export function exportFileName(extension: 'txt' | 'json', date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10)
  return `relationship-reality-check-${stamp}.${extension}`
}
