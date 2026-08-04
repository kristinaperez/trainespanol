"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Flame, Gem, Percent, Target, BookOpen, Trophy } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  useProgress,
  selectAccuracy,
  selectLevel,
  todayStr,
} from "@/lib/progress"
import { levelName, ACHIEVEMENTS } from "@/lib/config"

export function StatsView({ totalLessons }: { totalLessons: number }) {
  const s = useProgress()
  const level = selectLevel(s)
  const accuracy = selectAccuracy(s)

  // last 14 days activity from studyDays
  const days: { day: string; label: string; studied: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = todayStr(d)
    days.push({
      day: key,
      label: d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
      studied: s.studyDays.includes(key) ? 1 : 0,
    })
  }

  const metrics = [
    { icon: Gem, label: "Всего XP", value: s.xp, tone: "primary" as const },
    { icon: Flame, label: "Стрик / рекорд", value: `${s.streakCurrent} / ${s.streakLongest}`, tone: "gold" as const },
    { icon: Percent, label: "Точность", value: `${accuracy}%`, tone: "success" as const },
    { icon: BookOpen, label: "Уроков пройдено", value: `${s.completedLessons.length}/${totalLessons}`, tone: "muted" as const },
    { icon: Target, label: "Выучено фраз", value: s.learnedPhrases.length, tone: "primary" as const },
    { icon: Trophy, label: "Достижений", value: `${s.achievements.length}/${ACHIEVEMENTS.length}`, tone: "gold" as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground md:text-3xl">Статистика</h1>
        <p className="text-muted-foreground">
          Уровень {level} · {levelName(level)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.map((m) => {
          const tones = {
            primary: "text-primary",
            gold: "text-gold-foreground",
            success: "text-success",
            muted: "text-muted-foreground",
          }
          return (
            <div key={m.label} className="rounded-2xl border-2 border-border bg-card p-4">
              <m.icon className={`size-5 ${tones[m.tone]}`} />
              <p className="mt-2 text-2xl font-black text-foreground">{m.value}</p>
              <p className="text-xs font-bold text-muted-foreground">{m.label}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl border-2 border-border bg-card p-5">
        <h2 className="mb-4 font-black text-foreground">Активность за 14 дней</h2>
        <ChartContainer
          config={{ studied: { label: "Занимался", color: "var(--chart-1)" } }}
          className="h-48 w-full"
        >
          <BarChart data={days} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={1} fontSize={11} />
            <YAxis hide domain={[0, 1]} />
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="studied" fill="var(--color-studied)" radius={6} />
          </BarChart>
        </ChartContainer>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Каждый столбик — день занятий. Держи серию!
        </p>
      </div>
    </div>
  )
}
