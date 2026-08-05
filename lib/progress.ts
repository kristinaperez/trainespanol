"use client"

import { useSyncExternalStore } from "react"
import type { Phrase } from "./types"
import {
  ACHIEVEMENTS,
  SRS_INTERVALS,
  XP,
  levelFromXp,
  isExamLesson,
} from "./config"

const STORAGE_KEY = "espanol-real:v1"

export interface ReviewItem {
  phrase: Phrase
  lesson: number
  intervalIndex: number
  due: string // ISO date (YYYY-MM-DD)
  addedAt: string
}

export interface ProgressState {
  xp: number
  correctAnswers: number
  wrongAnswers: number
  completedLessons: number[]
  lessonScores: Record<number, { best: number; total: number }>
  learnedPhrases: string[]
  reviewItems: Record<string, ReviewItem>
  // streak
  streakCurrent: number
  streakLongest: number
  lastStudyDate: string | null
  studyDays: string[]
  // daily goal
  dailyGoal: number
  dailyDate: string | null
  dailyXp: number
  mistakesToday: number
  // achievements
  achievements: string[]
  finalExamPassed: boolean
  // monetization
  trialStartDate: string | null
  premiumKey: string | null
  // settings
  heartsEnabled: boolean
  theme: "light" | "dark" | "system"
  hearts: number
  lastHeartLoss: string | null
  studentName: string
  completionDate: string | null
}

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  completedLessons: [],
  lessonScores: {},
  learnedPhrases: [],
  reviewItems: {},
  streakCurrent: 0,
  streakLongest: 0,
  lastStudyDate: null,
  studyDays: [],
  dailyGoal: 25,
  dailyDate: null,
  dailyXp: 0,
  mistakesToday: 0,
  achievements: [],
  finalExamPassed: false,
  trialStartDate: null,
  premiumKey: null,
  heartsEnabled: false,
  theme: "system",
  hearts: 5,
  lastHeartLoss: null,
  studentName: "",
  completionDate: null,
}

// ---------- date helpers ----------
export function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00")
  d.setDate(d.getDate() + days)
  return todayStr(d)
}
function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime()
  const db = new Date(b + "T00:00:00").getTime()
  return Math.round((da - db) / 86400000)
}

// ---------- store ----------
let state: ProgressState = DEFAULT_STATE
let loaded = false
const listeners = new Set<() => void>()

function load(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_STATE }
}

function persist() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    state = load()
    loaded = true
  }
}

function set(mutator: (s: ProgressState) => ProgressState) {
  ensureLoaded()
  state = mutator({ ...state })
  persist()
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  ensureLoaded()
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): ProgressState {
  ensureLoaded()
  return state
}

const SERVER_SNAPSHOT = DEFAULT_STATE
function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function getProgressState(): ProgressState {
  ensureLoaded()
  return { ...state }
}

export function getDefaultProgressState(): ProgressState {
  return { ...DEFAULT_STATE }
}

export function replaceProgressState(nextState: ProgressState) {
  ensureLoaded()
  state = { ...DEFAULT_STATE, ...nextState, premiumKey: null }
  persist()
  listeners.forEach((listener) => listener())
}

// ---------- derived selectors ----------
export function selectLevel(s: ProgressState) {
  return levelFromXp(s.xp)
}
export function selectDueReviews(s: ProgressState): ReviewItem[] {
  const today = todayStr()
  return Object.values(s.reviewItems).filter((r) => r.due <= today)
}
export function selectAccuracy(s: ProgressState): number {
  const total = s.correctAnswers + s.wrongAnswers
  return total === 0 ? 0 : Math.round((s.correctAnswers / total) * 100)
}
export function selectDailyXp(s: ProgressState): number {
  return s.dailyDate === todayStr() ? s.dailyXp : 0
}

// ---------- actions ----------
export const progressActions = {
  ensureTrial() {
    set((s) => {
      if (!s.trialStartDate) s.trialStartDate = todayStr()
      return s
    })
  },

  markStudiedToday() {
    set((s) => {
      const today = todayStr()
      if (s.dailyDate !== today) {
        s.dailyDate = today
        s.dailyXp = 0
        s.mistakesToday = 0
      }
      if (s.lastStudyDate === today) return s
      if (s.lastStudyDate && diffDays(today, s.lastStudyDate) === 1) {
        s.streakCurrent += 1
      } else {
        s.streakCurrent = 1
      }
      s.lastStudyDate = today
      s.streakLongest = Math.max(s.streakLongest, s.streakCurrent)
      if (!s.studyDays.includes(today)) s.studyDays = [...s.studyDays, today]
      // 5-day streak bonus
      if (s.streakCurrent > 0 && s.streakCurrent % 5 === 0) {
        s.xp += XP.streakBonus5
      }
      return s
    })
  },

  addXp(amount: number) {
    set((s) => {
      const today = todayStr()
      if (s.dailyDate !== today) {
        s.dailyDate = today
        s.dailyXp = 0
        s.mistakesToday = 0
      }
      s.xp += amount
      s.dailyXp += amount
      return s
    })
  },

  recordAnswer(correct: boolean) {
    set((s) => {
      const today = todayStr()
      if (s.dailyDate !== today) {
        s.dailyDate = today
        s.dailyXp = 0
        s.mistakesToday = 0
      }
      if (correct) s.correctAnswers += 1
      else {
        s.wrongAnswers += 1
        s.mistakesToday += 1
      }
      return s
    })
  },

  learnPhrase(id: string) {
    set((s) => {
      if (!s.learnedPhrases.includes(id)) s.learnedPhrases = [...s.learnedPhrases, id]
      return s
    })
  },

  scheduleReview(phrase: Phrase, lesson: number) {
    set((s) => {
      const today = todayStr()
      s.reviewItems = {
        ...s.reviewItems,
        [phrase.id]: {
          phrase,
          lesson,
          intervalIndex: 0,
          due: addDays(today, SRS_INTERVALS[0]),
          addedAt: today,
        },
      }
      return s
    })
  },

  reviewResult(phraseId: string, correct: boolean) {
    set((s) => {
      const item = s.reviewItems[phraseId]
      if (!item) return s
      const today = todayStr()
      if (correct) {
        const next = item.intervalIndex + 1
        if (next >= SRS_INTERVALS.length) {
          // graduated — remove from queue
          const { [phraseId]: _, ...rest } = s.reviewItems
          s.reviewItems = rest
        } else {
          s.reviewItems = {
            ...s.reviewItems,
            [phraseId]: { ...item, intervalIndex: next, due: addDays(today, SRS_INTERVALS[next]) },
          }
        }
      } else {
        s.reviewItems = {
          ...s.reviewItems,
          [phraseId]: { ...item, intervalIndex: 0, due: addDays(today, SRS_INTERVALS[0]) },
        }
      }
      return s
    })
  },

  completeLesson(lesson: number, score: number, total: number, perfect: boolean) {
    set((s) => {
      if (!s.completedLessons.includes(lesson)) s.completedLessons = [...s.completedLessons, lesson]
      const prev = s.lessonScores[lesson]
      if (!prev || score > prev.best) s.lessonScores = { ...s.lessonScores, [lesson]: { best: score, total } }
      s.xp += XP.lessonCompleted
      if (perfect) s.xp += XP.perfectLesson
      if (isExamLesson(lesson) && lesson === 45 && perfect) s.finalExamPassed = true
      if (lesson === 45) s.completionDate = todayStr()
      return s
    })
  },

  passFinalExam() {
    set((s) => {
      s.finalExamPassed = true
      return s
    })
  },

  completeReview() {
    set((s) => {
      s.xp += XP.reviewCompleted
      const today = todayStr()
      if (s.dailyDate !== today) {
        s.dailyDate = today
        s.dailyXp = 0
      }
      s.dailyXp += XP.reviewCompleted
      return s
    })
  },

  setDailyGoal(goal: number) {
    set((s) => {
      s.dailyGoal = goal
      return s
    })
  },

  setTheme(theme: "light" | "dark" | "system") {
    set((s) => {
      s.theme = theme
      return s
    })
  },

  setHeartsEnabled(enabled: boolean) {
    set((s) => {
      s.heartsEnabled = enabled
      return s
    })
  },

  setStudentName(name: string) {
    set((s) => {
      s.studentName = name
      return s
    })
  },

  activatePremium(key: string): boolean {
    const valid = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key.trim().toUpperCase())
    if (valid) {
      set((s) => {
        s.premiumKey = key.trim().toUpperCase()
        return s
      })
    }
    return valid
  },

  unlockAchievements(ids: string[]) {
    if (!ids.length) return
    set((s) => {
      const add = ids.filter((id) => !s.achievements.includes(id))
      if (add.length) s.achievements = [...s.achievements, ...add]
      return s
    })
  },

  reset() {
    set(() => ({ ...DEFAULT_STATE }))
  },
}

// ---------- achievement evaluation ----------
export function evaluateAchievements(s: ProgressState): string[] {
  const unlocked: string[] = []
  for (const a of ACHIEVEMENTS) {
    if (s.achievements.includes(a.id)) continue
    const c = a.check
    let ok = false
    switch (c.kind) {
      case "lessonsCompleted":
        ok = s.completedLessons.length >= c.count
        break
      case "specificLesson":
        ok = s.completedLessons.includes(c.lesson)
        break
      case "correctAnswers":
        ok = s.correctAnswers >= c.count
        break
      case "phrasesLearned":
        ok = s.learnedPhrases.length >= c.count
        break
      case "streak":
        ok = s.streakCurrent >= c.days
        break
      case "perfectLesson":
        ok = Object.values(s.lessonScores).some((v) => v.best === v.total && v.total > 0)
        break
      case "noMistakesToday":
        ok = s.dailyDate === todayStr() && s.dailyXp > 0 && s.mistakesToday === 0
        break
      case "finalExam":
        ok = s.finalExamPassed
        break
    }
    if (ok) unlocked.push(a.id)
  }
  return unlocked
}

// ---------- premium / access ----------
export function isPremium(hasFullAccess: boolean): boolean {
  return hasFullAccess
}
export function isLessonLocked(lesson: number, trialLessons: number, hasFullAccess: boolean): boolean {
  return !hasFullAccess && lesson > trialLessons
}
