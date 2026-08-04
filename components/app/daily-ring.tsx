"use client"

import { useProgress, selectDailyXp } from "@/lib/progress"

export function DailyRing() {
  const s = useProgress()
  const daily = selectDailyXp(s)
  const goal = s.dailyGoal
  const pct = Math.min(100, Math.round((daily / goal) * 100))
  const r = 42
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  const done = daily >= goal

  return (
    <div className="flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-5">
      <div className="relative size-24 shrink-0">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={done ? "var(--success)" : "var(--primary)"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-lg font-black text-foreground">{pct}%</span>
        </div>
      </div>
      <div>
        <h3 className="font-black text-foreground">Дневная цель</h3>
        <p className="text-sm text-muted-foreground">
          {daily} / {goal} XP сегодня
        </p>
        <p className="mt-1 text-sm font-bold text-success">
          {done ? "Цель выполнена!" : "Ещё немного!"}
        </p>
      </div>
    </div>
  )
}
