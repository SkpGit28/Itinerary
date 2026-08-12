/**
 * Relationship Reality Check, data model.
 *
 * Question content is kept fully separate from rendering logic so that
 * questions can be reordered, reworded or extended without touching any
 * component. Answers are stored under stable question ids.
 */

export type SectionId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9'

export interface Section {
  id: SectionId
  /** 1-based position, used for "Section 3 of 9". */
  index: number
  title: string
  description: string
  /** Section 8 gets extra visual weight without turning into a warning screen. */
  emphasis?: boolean
}

export type QuestionType =
  /** 2–3 short options shown as a segmented row (Yes / Sometimes / No). */
  | 'segmented'
  /** Ordered 5-point scale shown as a vertical list of options. */
  | 'scale'
  /** 0–10 numeric rating. */
  | 'rating'
  /** Single choice, radio cards. */
  | 'single'
  /** Multiple select, with optional maximum. */
  | 'multi'
  /** Long open answer. */
  | 'text'
  /** Single-line open answer. */
  | 'shortText'

export interface QuestionOption {
  value: string
  label: string
  /** Selecting this reveals a free-text field that then becomes required. */
  isOther?: boolean
}

export interface QuestionInfo {
  /** Plain-English explanation of what the question is asking. */
  what: string
  /** A neutral situation that does not imply which answer is "correct". */
  example?: string
  /** Overrides the shared default tip. */
  tip?: string
}

export interface RatingConfig {
  min: number
  max: number
  minLabel: string
  maxLabel: string
}

/** A follow-up question is shown only when its parent holds one of these values. */
export interface QuestionCondition {
  questionId: string
  anyOf: string[]
}

export interface Question {
  id: string
  sectionId: SectionId
  /** Shown on the card, e.g. "12" or "22a". Empty string hides the badge. */
  displayNumber: string
  title: string
  required: boolean
  type: QuestionType
  options?: QuestionOption[]
  rating?: RatingConfig
  /** Maximum selections for `multi`. */
  maxSelections?: number
  placeholder?: string
  /** Calm guidance shown under the input, never an error. */
  helper?: string
  info: QuestionInfo
  /** Recommended (not enforced) length for open text, in non-space characters. */
  recommendedChars?: number
  condition?: QuestionCondition
  /** Renders a taller textarea. */
  large?: boolean
}

/**
 * One answer. Only the field matching the question type is populated, which
 * keeps persisted JSON small and readable while staying easy to render.
 */
export interface AnswerValue {
  /** segmented | scale | single */
  choice?: string
  /** multi */
  values?: string[]
  /** rating */
  number?: number
  /** text | shortText */
  text?: string
  /** Free text attached to an "Other" selection. */
  otherText?: string
}

export type Answers = Record<string, AnswerValue>

export interface QuestionIssue {
  questionId: string
  message: string
}
