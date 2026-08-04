"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import confetti from "canvas-confetti"
import { Check, RotateCw, Volume2, X } from "lucide-react"
import { useProgress, progressActions, selectDueReviews } from "@/lib/progress"
import { speakSpanish } from "@/lib/speak"
import { XP } from "@/lib/config"

export function ReviewSession() {
  const s = useProgress()
  // snapshot the due queue once at mount of a session
  const [queue] = useState(() => selectDueReviews(s).map((r) => r.phrase.id))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  const items = useMemo(() => s.reviewItems, [s.reviewItems])
  const currentId = queue[pos]
  const current = currentId ? items[currentId] : undefined

  function grade(correct: boolean) {
    if (!currentId) return
    progressActions.reviewResult(currentId, correct)
    setReviewed((r) => r + 1)
    setFlipped(false)
    if (pos + 1 >= queue.length) {
      progressActions.completeReview()
      setDone(true)
      setTimeout(() => confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ["#d64545", "#e8b24a", "#4fa870"] }), 120)
    } else {
      setPos((p) => p + 1)
    }
  }

  if (queue.length === 0) {
    return (
      <Empty
        title="Пока нечего повторять"
        text="Проходи уроки — новые фразы попадут сюда по расписанию интервального повторения."
      />
    )
  }

  if (done || !current) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
          <Check className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-black text-foreground">Повторение завершено!</h1>
        <p className="mt-1 text-muted-foreground">Повторено фраз: {reviewed} · +{XP.reviewCompleted} XP</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/dashboard" className="rounded-2xl bg-primary py-3.5 font-black text-primary-foreground">
            В кабинет
          </Link>
          <Link href="/lessons" className="rounded-2xl border-2 border-border py-3.5 font-black text-foreground">
            К урокам
          </Link>
        </div>
      </div>
    )
  }

  const progress = Math.round((pos / queue.length) * 100)

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-muted-foreground">
          <span>Повторение</span>
          <span>{pos + 1} / {queue.length}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flip-card">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={`flip-card-inner ${flipped ? "flipped" : ""} block w-full text-left`}
          aria-label="Перевернуть карточку"
        >
          <div className="flip-face flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border bg-card p-6">
            <p className="text-balance text-center text-3xl font-black text-foreground">{current.phrase.spanish}</p>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <RotateCw className="size-4" /> Вспомни перевод и переверни
            </span>
          </div>
          <div className="flip-back flip-face flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-gold bg-gold p-6 text-gold-foreground">
            <p className="text-balance text-center text-2xl font-black">{current.phrase.translation}</p>
            {current.phrase.example && (
              <p className="text-pretty text-center text-sm opacity-85">“{current.phrase.example}”</p>
            )}
          </div>
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => speakSpanish(current.phrase.spanish)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold text-primary"
        >
          <Volume2 className="size-4" /> Произнести
        </button>
      </div>

      {flipped ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => grade(false)}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-destructive bg-destructive/10 py-3.5 font-black text-destructive"
          >
            <X className="size-5" /> Не помню
          </button>
          <button
            type="button"
            onClick={() => grade(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-success py-3.5 font-black text-success-foreground"
          >
            <Check className="size-5" /> Помню
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="mt-6 w-full rounded-2xl bg-primary py-3.5 font-black text-primary-foreground"
        >
          Показать перевод
        </button>
      )}
    </div>
  )
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-secondary text-muted-foreground">
        <RotateCw className="size-8" />
      </div>
      <h1 className="mt-4 text-2xl font-black text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <Link
        href="/lessons"
        className="mt-6 inline-block rounded-2xl bg-primary px-6 py-3.5 font-black text-primary-foreground"
      >
        К урокам
      </Link>
    </div>
  )
}
