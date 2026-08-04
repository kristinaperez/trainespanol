import type { Metadata } from "next"
import { MistakesView } from "@/components/app/mistakes-view"

export const metadata: Metadata = {
  title: "Слабые фразы",
  description: "Фразы, которые ещё не закрепились — повтори их.",
}

export default function MistakesPage() {
  return <MistakesView />
}
