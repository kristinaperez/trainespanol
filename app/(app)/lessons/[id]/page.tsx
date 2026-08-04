import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LessonPlayer } from "@/components/app/lesson-player"
import { getAllLessons, getLesson } from "@/lib/lessons"

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ id: String(l.lesson) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const lesson = getLesson(Number(id))
  if (!lesson) return { title: "Урок не найден" }
  return {
    title: `Урок ${lesson.lesson}: ${lesson.title}`,
    description: lesson.intro ?? `Испанские фразы: ${lesson.title}`,
  }
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lessonId = Number(id)
  const lesson = getLesson(lessonId)
  if (!lesson) notFound()

  const all = getAllLessons()

  // Distractor pool: this lesson's phrases + neighbours, for plausible wrong options.
  const distractors = all
    .filter((l) => Math.abs(l.lesson - lessonId) <= 3)
    .flatMap((l) => l.phrases)

  const idx = all.findIndex((l) => l.lesson === lessonId)
  const nextLessonId = idx >= 0 && idx < all.length - 1 ? all[idx + 1].lesson : null

  return <LessonPlayer lesson={lesson} distractors={distractors} nextLessonId={nextLessonId} />
}
