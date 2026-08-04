export type Difficulty = "A1" | "A2" | "B1"

export interface Phrase {
  id: string
  spanish: string
  translation: string
  example?: string
  exampleTranslation?: string
  notes?: string
  difficulty: Difficulty
  tags: string[]
}

export interface Lesson {
  lesson: number
  title: string
  category: string
  difficulty: Difficulty
  tags: string[]
  intro?: string
  authorComment?: string
  phrases: Phrase[]
}

/** Lightweight metadata used across list/dashboard views. */
export interface LessonMeta {
  lesson: number
  title: string
  category: string
  difficulty: Difficulty
  tags: string[]
  phraseCount: number
  intro?: string
}

export type ExerciseType =
  | "flashcard"
  | "reverse-flashcard"
  | "multiple-choice"
  | "fill-blank"
  | "build-sentence"
  | "true-false"
  | "translation"

export interface Exercise {
  id: string
  type: ExerciseType
  phraseId: string
  prompt: string
  /** the phrase being tested, for reference */
  spanish: string
  translation: string
  example?: string
  /** correct answer (normalized comparison target) */
  answer: string
  /** options for multiple-choice / true-false */
  options?: string[]
  /** for build-sentence: shuffled tokens */
  tokens?: string[]
  /** for true-false: whether the shown pairing is correct */
  isTrue?: boolean
  notes?: string
}
