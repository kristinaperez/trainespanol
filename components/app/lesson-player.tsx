"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import confetti from "canvas-confetti"
import { ArrowLeft, ArrowRight, BookOpen, Home, Lock, Trophy, X, Zap } from "lucide-react"
import type { Lesson, LessonMeta } from "@/lib/types"
import { buildLessonExercises } from "@/lib/exercises"
import { speakSpanish } from "@/lib/speak"
import { ExerciseCard } from "./exercise-card"
import { AchievementIcon } from "./achievement-icon"
import {
  useProgress,
  progressActions,
  evaluateAchievements,
  isLessonLocked,
} from "@/lib/progress"
import { XP, SITE, MOTIVATION, comboMultiplier, ACHIEVEMENTS, isExamLesson } from "@/lib/config"

type Stage = "intro" | "play" | "result"

export function LessonPlayer({
  lesson,
  distractors,
  nextLessonId,
}: {
  lesson: Lesson
  distractors: Lesson["phrases"]
  nextLessonId: number | null
}) {
  const router = useRouter()
  const s = useProgress()
  const [stage, setStage] = useState<Stage>("intro")
  const [index, setIndex] = useState(0)
  const [combo, setCombo] = useState(0)
  const [gainedXp, setGainedXp] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const outcomeLock = useRef(false)

  const exercises = useMemo(
    () => buildLessonExercises(lesson.phrases, distractors),
    [lesson, distractors],
  )
  const practiceTotal = exercises.filter((e) => e.type !== "flashcard").length

  const locked = isLessonLocked(s, lesson.lesson, SITE.trialLessons)

  useEffect(() => {
    if (stage === "play") progressActions.markStudiedToday()
  }, [stage])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 1200)
  }

  function handleResult({ correct }: { correct: boolean }) {
    if (outcomeLock.current) return
    outcomeLock.current = true
    const ex = exercises[index]

    if (ex.type === "flashcard") {
      progressActions.learnPhrase(ex.phraseId)
      progressActions.addXp(XP.flashcard)
      setGainedXp((x) => x + XP.flashcard)
      return
    }

    progressActions.recordAnswer(correct)
    setAnswered((a) => a + 1)

    if (correct) {
      const newCombo = combo + 1
      setCombo(newCombo)
      const base = XP.correct
      const mult = comboMultiplier(newCombo)
      const gain = Math.round(base * mult)
      progressActions.addXp(gain)
      setGainedXp((x) => x + gain)
      setCorrectCount((c) => c + 1)
      showToast(newCombo >= 3 ? `${MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]} x${newCombo}` : MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)])
      // schedule a light review for practiced phrase
      const phrase = lesson.phrases.find((p) => p.id === ex.phraseId)
      if (phrase) progressActions.scheduleReview(phrase, lesson.lesson)
    } else {
      setCombo(0)
      const phrase = lesson.phrases.find((p) => p.id === ex.phraseId)
      if (phrase) progressActions.scheduleReview(phrase, lesson.lesson)
    }
  }

  function next() {
    outcomeLock.current = false
    if (index + 1 >= exercises.length) {
      finishLesson()
    } else {
      setIndex((i) => i + 1)
    }
  }

  function finishLesson() {
    const perfect = practiceTotal > 0 && correctCount === practiceTotal
    progressActions.completeLesson(lesson.lesson, correctCount, practiceTotal, perfect)
    if (isExamLesson(lesson.lesson) && lesson.lesson === 45 && perfect) progressActions.passFinalExam()
    // achievements
    const freshState = { ...s }
    const unlocked = evaluateAchievements(freshState)
    if (unlocked.length) progressActions.unlockAchievements(unlocked)
    setStage("result")
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 }, colors: ["#d64545", "#e8b24a", "#4fa870"] })
    }, 150)
  }

  // ----- Locked screen -----
  if (locked) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-muted text-muted-foreground">
          <Lock className="size-8" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-foreground">Урок {lesson.lesson} закрыт</h1>
        <p className="mt-2 text-muted-foreground">
          Первые {SITE.trialLessons} уроков бесплатны. Открой полный доступ за {SITE.price}, чтобы продолжить.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/settings"
            className="rounded-2xl bg-primary py-3.5 font-black text-primary-foreground transition hover:brightness-105"
          >
            Открыть полный доступ
          </Link>
          <Link href="/lessons" className="rounded-2xl border-2 border-border py-3.5 font-black text-foreground">
            Назад к урокам
          </Link>
        </div>
      </div>
    )
  }

  // ----- Intro -----
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <Link href="/lessons" className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Все уроки
        </Link>
        <div className="rounded-3xl border-2 border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 font-black text-primary">
              {lesson.lesson}
            </span>
            <div>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                {lesson.difficulty} · {lesson.phrases.length} фраз
              </span>
              <h1 className="text-2xl font-black text-foreground">{lesson.title}</h1>
            </div>
          </div>

          {lesson.intro && <p className="mt-5 text-pretty leading-relaxed text-foreground">{lesson.intro}</p>}
          {lesson.authorComment && (
            <p className="mt-3 rounded-2xl bg-gold/10 p-4 text-sm text-gold-foreground">
              <span className="font-black">Комментарий автора: </span>
              {lesson.authorComment}
            </p>
          )}

          <div className="mt-6">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-muted-foreground">
              <BookOpen className="size-4" /> Фразы урока
            </h2>
            <ul className="divide-y divide-border rounded-2xl border-2 border-border">
              {lesson.phrases.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="font-black text-foreground">{p.spanish}</p>
                    <p className="truncate text-sm text-muted-foreground">{p.translation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakSpanish(p.spanish)}
                    className="shrink-0 text-sm font-bold text-primary"
                  >
                    ▶ Слушать
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setStage("play")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-black text-primary-foreground transition hover:brightness-105"
          >
            Начать урок <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    )
  }

  // ----- Result -----
  if (stage === "result") {
    const perfect = practiceTotal > 0 && correctCount === practiceTotal
    const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 100
    const justUnlocked = ACHIEVEMENTS.filter((a) => s.achievements.includes(a.id)).slice(-3)
    return (
      <div className="mx-auto max-w-md py-8 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-gold/20 text-4xl" aria-hidden>
          <Trophy className="size-10 text-gold-foreground" />
        </div>
        <h1 className="mt-5 text-3xl font-black text-foreground">
          {perfect ? "¡Perfecto!" : "¡Bien hecho!"}
        </h1>
        <p className="mt-1 text-muted-foreground">Урок {lesson.lesson} пройден</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat value={`+${gainedXp}`} label="XP" tone="primary" />
          <Stat value={`${accuracy}%`} label="Точность" tone="success" />
          <Stat value={`${correctCount}/${practiceTotal}`} label="Верно" tone="gold" />
        </div>

        {perfect && (
          <p className="mt-4 rounded-2xl bg-success/10 p-3 text-sm font-bold text-success">
            Идеально! Бонус +{XP.perfectLesson} XP
          </p>
        )}

        {justUnlocked.length > 0 && (
          <div className="mt-5 rounded-2xl border-2 border-gold/40 bg-gold/10 p-4">
            <p className="mb-2 text-sm font-black text-gold-foreground">Достижения</p>
            <div className="flex justify-center gap-4">
              {justUnlocked.map((a) => (
                <div key={a.id} className="flex flex-col items-center gap-1" title={a.description}>
                  <AchievementIcon name={a.icon} className="size-6 text-gold-foreground" />
                  <span className="text-[11px] font-bold text-foreground">{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3">
          {nextLessonId ? (
            <button
              type="button"
              onClick={() => router.push(`/lessons/${nextLessonId}`)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-black text-primary-foreground transition hover:brightness-105"
            >
              Следующий урок <ArrowRight className="size-5" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-2xl bg-primary py-3.5 font-black text-primary-foreground transition hover:brightness-105"
            >
              К финишу курса!
            </Link>
          )}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border py-3.5 font-black text-foreground"
          >
            <Home className="size-5" /> В кабинет
          </Link>
        </div>
      </div>
    )
  }

  // ----- Play -----
  const ex = exercises[index]
  const progress = Math.round(((index + 1) / exercises.length) * 100)

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header with progress + combo */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/lessons"
          className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-border text-muted-foreground transition hover:text-foreground"
          aria-label="Выйти из урока"
        >
          <X className="size-5" />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        {combo >= 2 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1 text-sm font-black text-gold-foreground">
            <Zap className="size-4" /> x{combo}
          </span>
        )}
      </div>

      <div className="relative rounded-3xl border-2 border-border bg-card p-5 md:p-7">
        <ExerciseCard exercise={ex} onResult={handleResult} onContinue={next} />
        {toast && (
          <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center">
            <span className="animate-bounce rounded-full bg-success px-4 py-1.5 text-sm font-black text-success-foreground shadow-lg">
              {toast}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ value, label, tone }: { value: string; label: string; tone: "primary" | "success" | "gold" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    gold: "bg-gold/15 text-gold-foreground",
  }
  return (
    <div className={`rounded-2xl p-3 ${tones[tone]}`}>
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs font-bold opacity-80">{label}</p>
    </div>
  )
}
