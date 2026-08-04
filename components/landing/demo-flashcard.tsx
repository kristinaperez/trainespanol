"use client"

import { useState } from "react"
import { RotateCw, Volume2, ArrowRight } from "lucide-react"

const DEMO = [
  { spanish: "Me cuentas", translation: "Расскажешь мне", note: "Испанцы ставят «мне» в начало фразы" },
  { spanish: "Ya está", translation: "Всё готово / порядок", note: "Слышишь на каждом шагу в Испании" },
  { spanish: "¿Me pones un café?", translation: "Сделаешь мне кофе?", note: "Так заказывают кофе в баре" },
  { spanish: "Vale", translation: "Ок / договорились", note: "Самое испанское слово" },
]

export function DemoFlashcard() {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = DEMO[i]

  function next() {
    setFlipped(false)
    setTimeout(() => setI((v) => (v + 1) % DEMO.length), 180)
  }

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(card.spanish)
    u.lang = "es-ES"
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="w-full">
      <div className="flip-card w-full">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={`flip-card-inner ${flipped ? "flipped" : ""} block w-full text-left`}
          aria-label="Перевернуть карточку"
        >
          <div className="flip-face flex min-h-52 flex-col justify-between rounded-3xl border-2 border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Español
              </span>
              <RotateCw className="size-4 text-muted-foreground" />
            </div>
            <p className="text-balance text-center text-3xl font-black text-foreground">{card.spanish}</p>
            <p className="text-center text-sm text-muted-foreground">Нажми, чтобы увидеть перевод</p>
          </div>

          <div className="flip-back flip-face flex min-h-52 flex-col justify-between rounded-3xl border-2 border-primary bg-primary p-6 text-primary-foreground shadow-lg">
            <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-bold w-fit">
              Перевод
            </span>
            <p className="text-balance text-center text-2xl font-black">{card.translation}</p>
            <p className="text-pretty text-center text-xs text-primary-foreground/80">{card.note}</p>
          </div>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={speak}
          className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
        >
          <Volume2 className="size-4" /> Произнести
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-foreground transition hover:brightness-105"
        >
          Следующая <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
