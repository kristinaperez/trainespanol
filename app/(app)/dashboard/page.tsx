import type { Metadata } from "next"
import { DashboardView } from "@/components/app/dashboard-view"
import { getAllLessonMeta } from "@/lib/lessons"

export const metadata: Metadata = {
  title: "Кабинет",
  description: "Твой прогресс, карта адаптации и ежедневная цель.",
}

export default function DashboardPage() {
  const lessons = getAllLessonMeta()
  return <DashboardView lessons={lessons} />
}
