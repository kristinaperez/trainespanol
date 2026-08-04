"use client"

import Link from "next/link"
import { TriangleAlert, Volume2 } from "lucide-react"
import { useProgress } from "@/lib/progress"
import { speakSpanish } from "@/lib/speak"
import { SRS_INTERVALS } from "@/lib/config"

export function MistakesView() {
  const s = useProgress()

  // "Weak" = phrases still early in the SRS schedule (index 0 or 1) = not yet mastered.
  const weak = Object.values(s.reviewItems)
    .filter((r) => r.intervalIndex <= 1)
    .sort((a, b) => a.intervalIndex - b.intervalIndex)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black text-foreground md:text-3xl">
          <TriangleAlert className="size-7 text-primary" /> Слабые фразы
        </h1>
        <p className="text-muted-foreground">
          Фразы, которые ещё не закрепились. Повтори их, чтобы перевести в долгую память.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat value={s.correctAnswers} label="Верных ответов" tone="success" />
        <Stat value={s.wrongAnswers} label="Ошибок всего" tone="destructive" />
        <Stat value={weak.length} label="В работе" tone="gold" />
      </div>

      {weak.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center">
          <p className="text-lg font-black text-foreground">Слабых фраз нет</p>
          <p className="mt-1 text-muted-foreground">Отличная работа! Проходи новые уроки.</p>
          <Link href="/lessons" className="mt-5 inline-block rounded-2xl bg-primary px-6 py-3 font-black text-primary-foreground">
            К урокам
          </Link>
        </div>
      ) : (
        <>
          <Link
            href="/review"
            className="flex items-center justify-center rounded-2xl bg-primary py-3.5 font-black text-primary-foreground transition hover:brightness-105"
          >
            Повторить слабые фразы
          </Link>
          <ul className="divide-y divide-border rounded-3xl border-2 border-border bg-card">
            {weak.map((r) => {
              const stage = Math.round(((r.intervalIndex + 1) / SRS_INTERVALS.length) * 100)
              return (
                <li key={r.phrase.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-black text-foreground">{r.phrase.spanish}</p>
                    <p className="truncate text-sm text-muted-foreground">{r.phrase.translation}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${stage}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        урок {r.lesson}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakSpanish(r.phrase.spanish)}
                    className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-border text-primary"
                    aria-label="Произнести"
                  >
                    <Volume2 className="size-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

function Stat({ value, label, tone }: { value: number; label: string; tone: "success" | "destructive" | "gold" }) {
  const tones = {
    success: "bg-success/10 text-success",
    destructive: "bg-destructive/10 text-destructive",
    gold: "bg-gold/15 text-gold-foreground",
  }
  return (
    <div className={`rounded-2xl p-4 text-center ${tones[tone]}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold opacity-80">{label}</p>
    </div>
  )
}
