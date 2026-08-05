"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { ADAPTATION_MAP } from "@/lib/config"
import { useProgress } from "@/lib/progress"

export function AdaptationMap() {
  const s = useProgress()

  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-foreground md:text-xl">Карта адаптации в Испании</h2>
          <p className="text-sm text-muted-foreground">Каждый этап открывается, когда ты пройдёшь его уроки.</p>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {ADAPTATION_MAP.map((stage, idx) => {
          const done = stage.lessons.filter((l) => s.completedLessons.includes(l)).length
          const total = stage.lessons.length
          const complete = done === total
          const prevComplete =
            idx === 0 ||
            ADAPTATION_MAP[idx - 1].lessons.every((l) => s.completedLessons.includes(l))
          const active = !complete && prevComplete
          const nextLesson = stage.lessons.find((l) => !s.completedLessons.includes(l)) ?? stage.lessons[0]

          return (
            <li key={stage.id}>
              <Link
                href={`/lessons/${nextLesson}`}
                className={`flex items-center gap-4 rounded-2xl border-2 p-3.5 transition ${
                  complete
                    ? "border-success/40 bg-success/5"
                    : active
                      ? "border-primary bg-primary/5 hover:bg-primary/10"
                      : "border-border bg-secondary/40 hover:bg-secondary"
                }`}
              >
                <div
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl text-2xl ${
                    complete ? "bg-success/15" : active ? "bg-primary/10" : "bg-muted"
                  }`}
                  aria-hidden
                >
                  {complete ? <Check className="size-6 text-success" /> : stage.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-black text-foreground">{stage.title}</p>
                    {complete && (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                        Готово
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{stage.subtitle}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${complete ? "bg-success" : "bg-primary"}`}
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs font-bold text-muted-foreground">
                  {done}/{total}
                  <div className="mt-0.5 text-[11px]">
                    Уроки {stage.lessons[0]}–{stage.lessons[stage.lessons.length - 1]}
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
