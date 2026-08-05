import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LessonLoader } from "@/components/app/lesson-loader"
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

  return <LessonLoader lessonId={lessonId} />
}
