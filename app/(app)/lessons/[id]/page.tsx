import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LessonLoader } from "@/components/app/lesson-loader"
import { SITE } from "@/lib/config"

export function generateStaticParams() {
  return Array.from({ length: SITE.lessonCount }, (_, index) => ({ id: String(index + 1) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const lessonId = Number(id)
  if (!Number.isInteger(lessonId) || lessonId < 1 || lessonId > SITE.lessonCount) {
    return { title: "Урок не найден" }
  }
  return {
    title: `Урок ${lessonId} — Español Real`,
    description: `Разговорный испанский: урок ${lessonId}.`,
  }
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lessonId = Number(id)
  if (!Number.isInteger(lessonId) || lessonId < 1 || lessonId > SITE.lessonCount) notFound()

  return <LessonLoader lessonId={lessonId} />
}
