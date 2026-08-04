import type { Metadata } from "next"
import { StatsView } from "@/components/app/stats-view"
import { getLessonCount } from "@/lib/lessons"

export const metadata: Metadata = {
  title: "Статистика",
  description: "Твой прогресс: XP, стрик, точность и активность.",
}

export default function StatsPage() {
  return <StatsView totalLessons={getLessonCount()} />
}
