"use client"

import Link from "next/link"
import { ArrowRight, Play, Repeat, Trophy } from "lucide-react"
import type { LessonMeta } from "@/lib/types"
import { AdaptationMap } from "./adaptation-map"
import { DailyRing } from "./daily-ring"
import { AchievementIcon } from "./achievement-icon"
import { useProgress, selectDueReviews } from "@/lib/progress"
import { ACHIEVEMENTS } from "@/lib/config"

export function DashboardView({ lessons }: { lessons: LessonMeta[] }) {
  const s = useProgress()
  const due = selectDueReviews(s).length

  // next lesson to continue = first not-completed lesson
  const next = lessons.find((l) => !s.completedLessons.includes(l.lesson)) ?? lessons[lessons.length - 1]
  const completedCount = s.completedLessons.length
  const overallPct = Math.round((completedCount / lessons.length) * 100)

  const unlocked = ACHIEVEMENTS.filter((a) => s.achievements.includes(a.id))

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 6) return "Доброй ночи"
    if (h < 12) return "Buenos días"
    if (h < 19) return "Buenas tardes"
    return "Buenas noches"
  })()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground md:text-3xl">
          {greeting}{s.studentName ? `, ${s.studentName}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Пройдено {completedCount} из {lessons.length} уроков · {overallPct}%
        </p>
      </div>

      {/* Continue + review */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/lessons/${next.lesson}`}
          className="group flex items-center gap-4 rounded-3xl border-2 border-primary bg-primary p-5 text-primary-foreground transition hover:brightness-105"
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/15">
            <Play className="size-6 fill-current" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary-foreground/80">
              {completedCount === 0 ? "Начать обучение" : "Продолжить"}
            </p>
            <p className="text-lg font-black">Урок {next.lesson}: {next.title}</p>
          </div>
          <ArrowRight className="size-5 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/review"
          className={`group flex items-center gap-4 rounded-3xl border-2 p-5 transition ${
            due > 0 ? "border-gold bg-gold/10 hover:bg-gold/20" : "border-border bg-card hover:bg-secondary"
          }`}
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-gold/20 text-gold-foreground">
            <Repeat className="size-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-muted-foreground">Интервальное повторение</p>
            <p className="text-lg font-black text-foreground">
              {due > 0 ? `${due} фраз к повторению` : "Всё повторено"}
            </p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1" />
        </Link>
      </div>

      <DailyRing />

      <AdaptationMap />

      {/* Achievements */}
      <div className="rounded-3xl border-2 border-border bg-card p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-black text-foreground">
            <Trophy className="size-5 text-gold-foreground" /> Достижения
          </h2>
          <span className="text-sm font-bold text-muted-foreground">
            {unlocked.length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {ACHIEVEMENTS.map((a) => {
            const has = s.achievements.includes(a.id)
            return (
              <div
                key={a.id}
                title={`${a.title} — ${a.description}`}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center ${
                  has ? "border-gold/50 bg-gold/10" : "border-border bg-secondary/40 opacity-60"
                }`}
              >
                <AchievementIcon
                  name={a.icon}
                  className={`size-6 ${has ? "text-gold-foreground" : "text-muted-foreground"}`}
                />
                <span className="text-[11px] font-bold leading-tight text-foreground">{a.title}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
