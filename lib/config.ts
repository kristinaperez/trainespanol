// Central, configurable gamification + course config.
// Everything here is data-driven so the course can grow to 500+ lessons.

export const SITE = {
  name: "Español Real",
  tagline: "Learn Real Spanish Spoken in Spain",
  price: "49 €",
  trialLessons: 7,
  trialDays: 7,
}

// ---- XP rewards ----
export const XP = {
  flashcard: 2,
  correct: 5,
  perfectLesson: 20,
  lessonCompleted: 50,
  reviewCompleted: 30,
  streakBonus5: 50,
}

export const XP_PER_LEVEL = 500

// ---- Levels (configurable names at thresholds) ----
export interface LevelName {
  level: number
  name: string
}
export const LEVEL_NAMES: LevelName[] = [
  { level: 1, name: "Beginner" },
  { level: 5, name: "Traveler" },
  { level: 10, name: "Resident" },
  { level: 20, name: "Conversational" },
  { level: 30, name: "Spain Survivor" },
  { level: 45, name: "Native Killer" },
]

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}
export function levelName(level: number): string {
  let name = LEVEL_NAMES[0].name
  for (const l of LEVEL_NAMES) {
    if (level >= l.level) name = l.name
  }
  return name
}
export function xpForNextLevel(xp: number): { current: number; needed: number; remaining: number } {
  const intoLevel = xp % XP_PER_LEVEL
  return { current: intoLevel, needed: XP_PER_LEVEL, remaining: XP_PER_LEVEL - intoLevel }
}

// ---- Daily goal options ----
export const DAILY_GOALS = [10, 25, 50, 100] as const

// ---- Combo bonus (multiplier on correct-answer XP) ----
export function comboMultiplier(streak: number): number {
  if (streak >= 10) return 1.5
  if (streak >= 5) return 1.2
  if (streak >= 3) return 1.1
  return 1
}

// ---- Spaced repetition schedule (days) ----
export const SRS_INTERVALS = [1, 3, 7, 30, 90]

// ---- Spain Adaptation Map (the signature feature) ----
// Each stage unlocks after all its lessons are completed.
export interface AdaptationStage {
  id: string
  emoji: string
  title: string
  subtitle: string
  lessons: number[]
}
export const ADAPTATION_MAP: AdaptationStage[] = [
  { id: "flat", emoji: "🏠", title: "Заселился в квартиру", subtitle: "Первые фразы, дом и быт", lessons: [1, 2, 3, 4, 5] },
  { id: "coffee", emoji: "☕", title: "Заказал кофе", subtitle: "Команды и вежливость", lessons: [6, 7, 8, 9] },
  { id: "groceries", emoji: "🛒", title: "Купил продукты", subtitle: "Повседневные слова", lessons: [10, 11, 12, 13, 14] },
  { id: "bus", emoji: "🚌", title: "Доехал на автобусе", subtitle: "Транспорт и передвижение", lessons: [15, 16, 17, 18] },
  { id: "doctor", emoji: "🏥", title: "Посетил врача", subtitle: "Здоровье и просьбы", lessons: [19, 20, 21, 22] },
  { id: "bank", emoji: "🏦", title: "Открыл банковский счёт", subtitle: "Дела и уточнения", lessons: [23, 24, 25, 26] },
  { id: "docs", emoji: "📄", title: "Подал документы", subtitle: "Бумаги и учёба", lessons: [27, 28, 29, 30, 31] },
  { id: "job", emoji: "💼", title: "Прошёл собеседование", subtitle: "Работа и уверенность", lessons: [32, 33, 34, 35, 36] },
  { id: "friends", emoji: "🎉", title: "Завёл друзей", subtitle: "Живая речь и нюансы", lessons: [37, 38, 39, 40, 41] },
  { id: "home", emoji: "🇪🇸", title: "Чувствую себя как дома", subtitle: "Финал адаптации", lessons: [42, 43, 44, 45] },
]

// ---- Categories (for search / filtering) ----
export const CATEGORIES = [
  "Daily Life",
  "Transport",
  "Bank",
  "Doctor",
  "Social Worker",
  "Housing",
  "School",
  "Restaurant",
  "Shopping",
  "Work",
  "Police",
  "Government",
] as const

export const CATEGORY_LABELS_RU: Record<string, string> = {
  "Daily Life": "Повседневная жизнь",
  Transport: "Транспорт",
  Bank: "Банк",
  Doctor: "Врач",
  "Social Worker": "Соцработник",
  Housing: "Жильё",
  School: "Учёба",
  Restaurant: "Кафе и рестораны",
  Shopping: "Покупки",
  Work: "Работа",
  Police: "Полиция",
  Government: "Госорганы",
}

// ---- Achievements ----
export type AchievementCheck =
  | { kind: "lessonsCompleted"; count: number }
  | { kind: "specificLesson"; lesson: number }
  | { kind: "correctAnswers"; count: number }
  | { kind: "phrasesLearned"; count: number }
  | { kind: "streak"; days: number }
  | { kind: "perfectLesson" }
  | { kind: "noMistakesToday" }
  | { kind: "finalExam" }

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string // lucide icon name
  check: AchievementCheck
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-lesson", title: "Первый урок", description: "Заверши свой первый урок", icon: "Sparkles", check: { kind: "lessonsCompleted", count: 1 } },
  { id: "correct-10", title: "10 верных ответов", description: "Ответь правильно 10 раз", icon: "Check", check: { kind: "correctAnswers", count: 10 } },
  { id: "correct-100", title: "100 верных ответов", description: "Ответь правильно 100 раз", icon: "CheckCheck", check: { kind: "correctAnswers", count: 100 } },
  { id: "streak-7", title: "7 дней подряд", description: "Занимайся 7 дней подряд", icon: "Flame", check: { kind: "streak", days: 7 } },
  { id: "streak-30", title: "30 дней подряд", description: "Занимайся 30 дней подряд", icon: "Flame", check: { kind: "streak", days: 30 } },
  { id: "first-perfect", title: "Идеальный урок", description: "Пройди урок без ошибок", icon: "Star", check: { kind: "perfectLesson" } },
  { id: "phrases-100", title: "100 фраз", description: "Выучи 100 фраз", icon: "BookOpen", check: { kind: "phrasesLearned", count: 100 } },
  { id: "no-mistakes-today", title: "День без ошибок", description: "Ни одной ошибки за день", icon: "ShieldCheck", check: { kind: "noMistakesToday" } },
  { id: "lesson-10", title: "Урок 10", description: "Дойди до урока 10", icon: "Milestone", check: { kind: "specificLesson", lesson: 10 } },
  { id: "lesson-45", title: "Урок 45", description: "Заверши урок 45", icon: "Trophy", check: { kind: "specificLesson", lesson: 45 } },
  { id: "final-exam", title: "Финальный экзамен", description: "Сдай финальный экзамен", icon: "GraduationCap", check: { kind: "finalExam" } },
]

// ---- Motivation messages ----
export const MOTIVATION = [
  "¡Excelente!",
  "¡Muy bien!",
  "¡Sigue así!",
  "¡Casi lo tienes!",
  "¡Un poco más!",
  "¡Tu español mejora!",
  "¡Fantástico!",
]

export function isExamLesson(lesson: number): boolean {
  return lesson % 5 === 0
}
