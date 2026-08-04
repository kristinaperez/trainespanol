import type { Metadata } from "next"
import { AchievementsView } from "@/components/app/achievements-view"

export const metadata: Metadata = {
  title: "Достижения",
  description: "Ваши уровни, звания и открытые достижения в изучении испанского.",
}

export default function AchievementsPage() {
  return <AchievementsView />
}
