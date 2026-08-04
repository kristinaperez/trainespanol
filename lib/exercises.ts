import type { Exercise, ExerciseType, Phrase } from "./types"

/** Normalize a string for forgiving answer comparison. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[¿?¡!.,;:'"()]/g, "")
    .replace(/\s+/g, " ")
}

export function answersMatch(a: string, b: string): boolean {
  return normalize(a) === normalize(b)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct: string, pool: string[], n: number): string[] {
  const options = new Set<string>()
  const candidates = shuffle(pool.filter((p) => normalize(p) !== normalize(correct)))
  for (const c of candidates) {
    if (options.size >= n) break
    options.add(c)
  }
  return [...options]
}

function tokenize(sentence: string): string[] {
  return sentence.split(/\s+/).filter(Boolean)
}

/** Build a single exercise of a given type for a phrase. */
function makeExercise(
  type: ExerciseType,
  phrase: Phrase,
  translationPool: string[],
  spanishPool: string[],
  idx: number,
): Exercise {
  const base = {
    id: `${phrase.id}-${type}-${idx}`,
    phraseId: phrase.id,
    spanish: phrase.spanish,
    translation: phrase.translation,
    example: phrase.example,
    notes: phrase.notes,
  }

  switch (type) {
    case "flashcard":
      return { ...base, type, prompt: phrase.spanish, answer: phrase.translation }
    case "reverse-flashcard":
      return { ...base, type, prompt: phrase.translation, answer: phrase.spanish }
    case "multiple-choice": {
      const distractors = pickDistractors(phrase.translation, translationPool, 3)
      const options = shuffle([phrase.translation, ...distractors])
      return { ...base, type, prompt: phrase.spanish, answer: phrase.translation, options }
    }
    case "true-false": {
      const isTrue = Math.random() > 0.5
      const shown = isTrue ? phrase.translation : pickDistractors(phrase.translation, translationPool, 1)[0] ?? phrase.translation
      return {
        ...base,
        type,
        prompt: `${phrase.spanish} = ${shown}`,
        answer: isTrue ? "true" : "false",
        isTrue,
        options: ["true", "false"],
      }
    }
    case "fill-blank": {
      const tokens = tokenize(phrase.example || phrase.spanish)
      // blank out the last meaningful word (>2 chars) preferably
      let blankIdx = tokens.length - 1
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].replace(/[^\p{L}]/gu, "").length > 2) {
          blankIdx = i
          break
        }
      }
      const answer = tokens[blankIdx].replace(/[.,;:!?¿¡]/g, "")
      const prompt = tokens.map((t, i) => (i === blankIdx ? "______" : t)).join(" ")
      return { ...base, type, prompt, answer }
    }
    case "build-sentence": {
      const tokens = tokenize(phrase.spanish)
      return { ...base, type, prompt: phrase.translation, answer: phrase.spanish, tokens: shuffle(tokens) }
    }
    case "translation":
      return { ...base, type, prompt: phrase.translation, answer: phrase.spanish }
  }
}

const PRACTICE_TYPES: ExerciseType[] = [
  "multiple-choice",
  "true-false",
  "fill-blank",
  "build-sentence",
  "reverse-flashcard",
  "translation",
]

export interface BuildOptions {
  /** include a flashcard learning pass before practice */
  includeFlashcards?: boolean
  /** exercise types allowed for the practice pass */
  practiceTypes?: ExerciseType[]
}

/**
 * Generate a lesson's exercise sequence from its phrases.
 * Data-driven: works with any set of phrases.
 */
export function buildLessonExercises(
  phrases: Phrase[],
  distractorPhrases: Phrase[] = phrases,
  options: BuildOptions = {},
): Exercise[] {
  const { includeFlashcards = true, practiceTypes = PRACTICE_TYPES } = options
  const translationPool = distractorPhrases.map((p) => p.translation)
  const spanishPool = distractorPhrases.map((p) => p.spanish)

  const exercises: Exercise[] = []

  if (includeFlashcards) {
    phrases.forEach((p, i) => {
      exercises.push(makeExercise("flashcard", p, translationPool, spanishPool, i))
    })
  }

  // Practice pass: assign a rotating exercise type per phrase.
  phrases.forEach((p, i) => {
    // build-sentence only makes sense for multi-word phrases
    let type = practiceTypes[i % practiceTypes.length]
    if (type === "build-sentence" && tokenize(p.spanish).length < 2) {
      type = "multiple-choice"
    }
    exercises.push(makeExercise(type, p, translationPool, spanishPool, i + 100))
  })

  return exercises
}

/**
 * Generate a quiz of `count` questions (10–20) from a set of phrases.
 * Uses varied choice-based types so it can be auto-scored.
 */
export function buildQuiz(phrases: Phrase[], distractorPhrases: Phrase[], count = 10): Exercise[] {
  const translationPool = distractorPhrases.map((p) => p.translation)
  const spanishPool = distractorPhrases.map((p) => p.spanish)
  const quizTypes: ExerciseType[] = ["multiple-choice", "true-false", "fill-blank", "build-sentence", "translation"]
  const pool = shuffle(phrases)
  const n = Math.min(Math.max(count, 1), Math.max(pool.length, 1))
  const chosen: Phrase[] = []
  // repeat phrases if fewer than requested
  for (let i = 0; i < count; i++) chosen.push(pool[i % pool.length])
  return chosen.slice(0, Math.max(n, count > pool.length ? count : n)).map((p, i) => {
    let type = quizTypes[i % quizTypes.length]
    if (type === "build-sentence" && tokenize(p.spanish).length < 2) type = "multiple-choice"
    return makeExercise(type, p, translationPool, spanishPool, i)
  })
}

export function exerciseTypeLabel(type: ExerciseType): string {
  const map: Record<ExerciseType, string> = {
    flashcard: "Карточка",
    "reverse-flashcard": "Обратная карточка",
    "multiple-choice": "Выбор перевода",
    "fill-blank": "Вставь слово",
    "build-sentence": "Собери фразу",
    "true-false": "Верно или нет",
    translation: "Перевод",
  }
  return map[type]
}
