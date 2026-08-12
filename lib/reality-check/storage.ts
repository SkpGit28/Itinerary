import type { Answers } from './types'

/**
 * Client-side persistence. Answers never leave the device: nothing here
 * touches the network, the URL, analytics or the console.
 */

export const STORAGE_KEY = 'rrc:v1'
export const STORAGE_VERSION = 1

export interface StoredState {
  version: number
  answers: Answers
  /** 0-based index into SECTIONS; -1 means the welcome screen. */
  sectionIndex: number
  stage: 'welcome' | 'section' | 'review' | 'done'
  honestyConfirmed: boolean
  startedAt: string
  updatedAt: string
  submittedAt?: string
}

export function createEmptyState(): StoredState {
  const now = new Date().toISOString()
  return {
    version: STORAGE_VERSION,
    answers: {},
    sectionIndex: -1,
    stage: 'welcome',
    honestyConfirmed: false,
    startedAt: now,
    updatedAt: now,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Defensive parse, a corrupt or foreign payload is treated as "no saved data". */
function parseState(raw: string): StoredState | null {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!isRecord(data)) return null
  if (data.version !== STORAGE_VERSION) return null
  if (!isRecord(data.answers)) return null

  const stage = data.stage
  const validStage =
    stage === 'welcome' || stage === 'section' || stage === 'review' || stage === 'done'

  const base = createEmptyState()
  return {
    version: STORAGE_VERSION,
    answers: data.answers as Answers,
    sectionIndex: typeof data.sectionIndex === 'number' ? data.sectionIndex : -1,
    stage: validStage ? stage : 'welcome',
    honestyConfirmed: data.honestyConfirmed === true,
    startedAt: typeof data.startedAt === 'string' ? data.startedAt : base.startedAt,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : base.updatedAt,
    submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : undefined,
  }
}

export function loadState(): StoredState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return parseState(raw)
  } catch {
    // Private browsing, disabled storage, quota, fall back to a fresh session.
    return null
  }
}

export function saveState(state: StoredState): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing useful to do, the in-memory reset still happens.
  }
}

/** True when a stored session has anything worth resuming. */
export function hasProgress(state: StoredState | null): boolean {
  if (!state) return false
  return Object.keys(state.answers).length > 0
}
