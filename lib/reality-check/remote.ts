import { buildJsonExport, buildTextExport } from './export'
import { QUESTIONS } from './questions'
import { isAnswered, isConditionMet } from './validation'
import type { Answers } from './types'

/**
 * Submit hone pe jawab Supabase me chale jaate hain, taaki phone kho jaye ya
 * browser data saaf ho jaye tab bhi jawab bache rahein.
 *
 * Bhejne ka kaam server route se hota hai (`/api/reality-check`), isliye key
 * browser bundle me nahi jaati. Table pe RLS lagi hai: anon sirf insert kar
 * sakta hai, padh nahi sakta.
 */

export interface RemotePayload {
  submitted_at: string
  respondent: string
  /** Bilkul wahi shape jo localStorage me hai, na summarise na score. */
  answers: Answers
  /** Har sawaal ka poora record, taaki sawaal badalne pe bhi purana padha ja sake. */
  responses: unknown
  /** Wahi plain text jo copy aur download button dete hain. */
  export_text: string
  answered_count: number
  total_count: number
}

export function buildRemotePayload(answers: Answers, submittedAt: string): RemotePayload {
  const visible = QUESTIONS.filter((q) => isConditionMet(q, answers))
  return {
    submitted_at: submittedAt,
    respondent: 'nainu',
    answers,
    responses: buildJsonExport(answers, submittedAt).responses,
    export_text: buildTextExport(answers, submittedAt),
    answered_count: visible.filter((q) => isAnswered(q, answers[q.id])).length,
    total_count: visible.length,
  }
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
      body: JSON.stringify(buildRemotePayload(answers, submittedAt)),
    })
    if (response.ok) return { ok: true }
    const detail = await response.text().catch(() => '')
    return { ok: false, reason: detail.slice(0, 200) || `HTTP ${response.status}` }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
