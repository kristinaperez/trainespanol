"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Check, Lock, Search, Star } from "lucide-react"
import type { LessonMeta } from "@/lib/types"
import { useProgress, isLessonLocked } from "@/lib/progress"
import { useAccount } from "./account-provider"
import { SITE, CATEGORY_LABELS_RU } from "@/lib/config"

export function LessonsListView({ lessons }: { lessons: LessonMeta[] }) {
  const s = useProgress()
  const { hasFullAccess } = useAccount()
  const [query, setQuery] = useState("")
  const [difficulty, setDifficulty] = useState<string>("all")

  const categories = useMemo(() => {
    const set = new Set(lessons.map((l) => l.category))
    return ["all", ...Array.from(set)]
  }, [lessons])
  const [category, setCategory] = useState("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return lessons.filter((l) => {
      if (difficulty !== "all" && l.difficulty !== difficulty) return false
      if (category !== "all" && l.category !== category) return false
      if (!q) return true
      return (
        l.title.toLowerCase().includes(q) ||
        String(l.lesson).includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)) ||
        (l.intro ?? "").toLowerCase().includes(q)
      )
    })
  }, [lessons, query, difficulty, category])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground md:text-3xl">Все уроки</h1>
        <p className="text-muted-foreground">
          {lessons.length} уроков живых испанских фраз. Ищи по названию, теме или тегу.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: кофе, банк, vale…"
            className="w-full rounded-2xl border-2 border-border bg-card py-3 pl-12 pr-4 font-bold text-foreground outline-none transition focus:border-primary"
            aria-label="Поиск по урокам"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "A1", "A2", "B1"].map((d) => (
            <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
              {d === "all" ? "Все уровни" : d}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)} tone="muted">
              {c === "all" ? "Все темы" : CATEGORY_LABELS_RU[c] ?? c}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-border p-8 text-center text-muted-foreground">
          Ничего не найдено. Попробуй другой запрос.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((l) => {
            const locked = isLessonLocked(l.lesson, SITE.trialLessons, hasFullAccess)
            const done = s.completedLessons.includes(l.lesson)
            const score = s.lessonScores[l.lesson]
            return (
              <Link
                key={l.lesson}
                href={locked ? "/settings" : `/lessons/${l.lesson}`}
                className={`group relative flex gap-4 rounded-2xl border-2 p-4 transition ${
                  done
                    ? "border-success/40 bg-success/5"
                    : "border-border bg-card hover:border-primary"
                }`}
              >
                <div
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${
                    done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
                  }`}
                >
                  {done ? <Check className="size-5" /> : l.lesson}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate font-black text-foreground">{l.title}</p>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
                      {l.difficulty}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {CATEGORY_LABELS_RU[l.category] ?? l.category} · {l.phraseCount} фраз
                  </p>
                  {done && score && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-gold-foreground">
                      <Star className="size-3.5 fill-current" /> Лучший: {score.best}/{score.total}
                    </p>
                  )}
                </div>
                {locked && (
                  <div className="grid size-8 shrink-0 place-items-center self-center rounded-full bg-muted text-muted-foreground">
                    <Lock className="size-4" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
  tone = "primary",
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  tone?: "primary" | "muted"
}) {
  const activeCls = tone === "primary" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
        active ? activeCls : "border-2 border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
