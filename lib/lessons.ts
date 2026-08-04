import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import type { Lesson, LessonMeta } from "./types"

const LESSONS_DIR = join(process.cwd(), "data", "lessons")

let _cache: Lesson[] | null = null

/**
 * Reads every JSON file in /data/lessons at build time.
 * Fully data-driven: add a new lessonNN.json file and it appears
 * automatically across the app with no code changes.
 */
export function getAllLessons(): Lesson[] {
  if (_cache) return _cache
  const files = readdirSync(LESSONS_DIR).filter((f) => f.endsWith(".json"))
  const lessons = files.map((f) => {
    const raw = readFileSync(join(LESSONS_DIR, f), "utf8")
    return JSON.parse(raw) as Lesson
  })
  lessons.sort((a, b) => a.lesson - b.lesson)
  _cache = lessons
  return lessons
}

export function getAllLessonMeta(): LessonMeta[] {
  return getAllLessons().map((l) => ({
    lesson: l.lesson,
    title: l.title,
    category: l.category,
    difficulty: l.difficulty,
    tags: l.tags,
    phraseCount: l.phrases.length,
    intro: l.intro,
  }))
}

export function getLesson(id: number): Lesson | undefined {
  return getAllLessons().find((l) => l.lesson === id)
}

export function getLessonCount(): number {
  return getAllLessons().length
}
