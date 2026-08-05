"use client"

import Link from "next/link"
import useSWR from "swr"
import { Lock } from "lucide-react"
import type { Lesson } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { LessonPlayer } from "./lesson-player"

interface LessonPayload {
  lesson: Lesson
  distractors: Lesson["phrases"]
  nextLessonId: number | null
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "")

async function loadLesson(id: number): Promise<LessonPayload> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  const response = await fetch(`${API_URL}/api/lessons/${id}`, {
    headers: data.session ? { Authorization: `Bearer ${data.session.access_token}` } : undefined,
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Урок не загрузился")
  return body as LessonPayload
}

export function LessonLoader({ lessonId }: { lessonId: number }) {
  const { data, error, isLoading } = useSWR(["lesson", lessonId], () => loadLesson(lessonId))

  if (isLoading) {
    return <div className="mx-auto mt-20 size-10 animate-spin rounded-full border-4 border-muted border-t-primary" aria-label="Загрузка урока" />
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-muted text-muted-foreground"><Lock className="size-8" /></div>
        <h1 className="mt-5 text-2xl font-black text-foreground">Урок пока закрыт</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground">{error?.message ?? "Не удалось загрузить урок"}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/settings" className="rounded-2xl bg-primary py-3.5 font-black text-primary-foreground">Открыть полный доступ</Link>
          <Link href="/lessons" className="rounded-2xl border-2 border-border py-3.5 font-black text-foreground">Назад к урокам</Link>
        </div>
      </div>
    )
  }

  return <LessonPlayer {...data} />
}
