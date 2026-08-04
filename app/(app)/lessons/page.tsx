import type { Metadata } from "next"
import { LessonsListView } from "@/components/app/lessons-list-view"
import { getAllLessonMeta } from "@/lib/lessons"

export const metadata: Metadata = {
  title: "Уроки",
  description: "Полный список уроков испанского с поиском и фильтрами по темам и уровню.",
}

export default function LessonsPage() {
  const lessons = getAllLessonMeta()
  return <LessonsListView lessons={lessons} />
}
