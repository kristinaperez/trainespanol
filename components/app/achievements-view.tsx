"use client"

import { useProgress, selectLevel } from "@/lib/progress"
import { ACHIEVEMENTS, LEVEL_NAMES, levelName, XP_PER_LEVEL } from "@/lib/config"
import { AchievementIcon } from "@/components/app/achievement-icon"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"

export function AchievementsView() {
  const s = useProgress()
  const level = selectLevel(s)
  const unlockedCount = s.achievements.length
  const intoLevel = s.xp % XP_PER_LEVEL

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-foreground">Достижения</h1>
        <p className="mt-1 text-muted-foreground">
          Открыто {unlockedCount} из {ACHIEVEMENTS.length}
        </p>
      </div>

      {/* Level card */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
                Уровень {level}
              </p>
              <p className="font-heading text-3xl font-extrabold">{levelName(level)}</p>
            </div>
            <p className="font-heading text-2xl font-extrabold">{s.xp} XP</p>
          </div>
          <div className="mt-4">
            <Progress
              value={(intoLevel / XP_PER_LEVEL) * 100}
              className="h-2 bg-primary-foreground/25 [&>div]:bg-accent"
            />
            <p className="mt-1.5 text-xs text-primary-foreground/70">
              {XP_PER_LEVEL - intoLevel} XP до уровня {level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rank ladder */}
      <div className="flex flex-wrap gap-2">
        {LEVEL_NAMES.map((l) => {
          const reached = level >= l.level
          return (
            <span
              key={l.level}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                reached ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
              }`}
            >
              Ур. {l.level} · {l.name}
            </span>
          )
        })}
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = s.achievements.includes(a.id)
          return (
            <Card
              key={a.id}
              className={`text-center transition-all ${
                unlocked ? "border-accent/40" : "opacity-70"
              }`}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    unlocked ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {unlocked ? (
                    <AchievementIcon name={a.icon} className="h-7 w-7" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>
                <p className="font-heading text-sm font-bold leading-tight text-foreground text-balance">
                  {a.title}
                </p>
                <p className="text-xs leading-snug text-muted-foreground text-pretty">
                  {a.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
