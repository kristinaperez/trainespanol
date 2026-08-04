"use client"

import { Flame, Gem, Heart, Star } from "lucide-react"
import { useProgress, selectLevel, selectDailyXp, isPremium } from "@/lib/progress"
import { levelName, xpForNextLevel } from "@/lib/config"

export function StatBar() {
  const s = useProgress()
  const level = selectLevel(s)
  const { current, needed } = xpForNextLevel(s.xp)
  const dailyXp = selectDailyXp(s)

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Stat icon={<Flame className="size-4" />} label={`${s.streakCurrent}`} tone="gold" title="Дней подряд" />
      <Stat icon={<Gem className="size-4" />} label={`${s.xp} XP`} tone="primary" title="Всего опыта" />
      <Stat
        icon={<Star className="size-4" />}
        label={`Ур. ${level} · ${levelName(level)}`}
        tone="muted"
        title={`${current}/${needed} XP до следующего уровня`}
      />
      {s.heartsEnabled && !isPremium(s) && (
        <Stat icon={<Heart className="size-4 fill-current" />} label={`${s.hearts}`} tone="destructive" title="Жизни" />
      )}
      {dailyXp > 0 && (
        <span className="hidden text-xs font-bold text-muted-foreground sm:inline">
          Сегодня: {dailyXp} / {s.dailyGoal} XP
        </span>
      )}
    </div>
  )
}

function Stat({
  icon,
  label,
  tone,
  title,
}: {
  icon: React.ReactNode
  label: string
  tone: "gold" | "primary" | "muted" | "destructive"
  title: string
}) {
  const tones: Record<string, string> = {
    gold: "bg-gold/15 text-gold-foreground",
    primary: "bg-primary/10 text-primary",
    muted: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive/10 text-destructive",
  }
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black ${tones[tone]}`}
    >
      {icon}
      {label}
    </span>
  )
}
