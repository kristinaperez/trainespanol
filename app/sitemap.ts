import type { MetadataRoute } from "next"
import { getAllLessons } from "@/lib/lessons"

const BASE = "https://espanol-trainer.vercel.app"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/dashboard",
    "/lessons",
    "/review",
    "/mistakes",
    "/stats",
    "/settings",
    "/about",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }))

  const lessonPages = getAllLessons().map((l) => ({
    url: `${BASE}/lessons/${l.lesson}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...lessonPages]
}
