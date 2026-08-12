import { buildJsonExport, buildTextExport, formatAnswer } from './export'
import { getSection, QUESTIONS } from './questions'
import { isAnswered, isConditionMet } from './validation'
import type { Answers } from './types'

/**
 * Submit hone pe jawab bahar bhi save hote hain, taaki phone kho jaye ya
 * browser data saaf ho jaye tab bhi jawab bache rahein.
 *
 * Bhejne ka kaam server route (`/api/reality-check`) karta hai, isliye koi
 * key ya URL browser bundle me nahi jaati. Wahi route decide karta hai ki
 * Google Sheet me daalna hai ya Supabase me.
 */

export interface RemotePayload {
  submitted_at: string
  submission_id: string
  respondent: string
  /** Bilkul wahi shape jo localStorage me hai, na summarise na score. */
  answers: Answers
  /** Har sawaal ka poora record, taaki sawaal badalne pe bhi purana padha ja sake. */
  responses: unknown
  /** Wahi plain text jo copy aur download button dete hain. */
  export_text: string
  answered_count: number
  total_count: number
  /** Google Sheet ke liye taiyaar rows, ek sawaal ki ek line. */
  rows: string[][]
}

/**
 * Sheet ke liye seedha seedha rows. Har sawaal ki apni ek line, taaki phone
 * pe padhne me aasan rahe: 62 columns ke bajaye 62 rows, jinme sawaal aur
 * uska jawab aamne saamne hote hain.
 */
export function buildSheetRows(
  answers: Answers,
  submittedAt: string,
  submissionId: string
): string[][] {
  return QUESTIONS.filter((q) => isConditionMet(q, answers)).map((q) => [
    submittedAt,
    submissionId,
    getSection(q.sectionId)?.title ?? q.sectionId,
    q.displayNumber,
    q.title,
    formatAnswer(q, answers[q.id]),
    q.required ? 'zaroori' : 'optional',
  ])
}

export function buildRemotePayload(
  answers: Answers,
  submittedAt: string,
  submissionId: string
): RemotePayload {
  const visible = QUESTIONS.filter((q) => isConditionMet(q, answers))
  return {
    submitted_at: submittedAt,
    submission_id: submissionId,
    respondent: 'nainu',
    answers,
    responses: buildJsonExport(answers, submittedAt).responses,
    export_text: buildTextExport(answers, submittedAt),
    answered_count: visible.filter((q) => isAnswered(q, answers[q.id])).length,
    total_count: visible.length,
    rows: buildSheetRows(answers, submittedAt, submissionId),
  }
}

/** Har submit ka apna id, taaki sheet me ek run ki lines saath dikhein. */
function newSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

export type SaveResult = { ok: true } | { ok: false; reason: string }

/**
 * Jawab server route ko bhejta hai. Fail hone pe bhi kuch phenkta nahi, sirf
 * batata hai, kyunki jawab phone me toh already save hain aur export bhi ho
 * sakte hain. Yahan se koi jawab console me print nahi hota.
 */
export async function saveResponsesRemotely(
  answers: Answers,
  submittedAt: string
): Promise<SaveResult> {
  try {
    const response = await fetch('/api/reality-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRemotePayload(answers, submittedAt, newSubmissionId())),
    })
    if (response.ok) return { ok: true }
    const detail = await response.text().catch(() => '')
    return { ok: false, reason: detail.slice(0, 200) || `HTTP ${response.status}` }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
