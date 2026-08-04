import type { Metadata } from "next"
import { ReviewSession } from "@/components/app/review-session"

export const metadata: Metadata = {
  title: "Повторение",
  description: "Интервальное повторение выученных фраз, чтобы не забывать.",
}

export default function ReviewPage() {
  return <ReviewSession />
}
