"use client"

import { useEffect, useState } from "react"
import { Check, RotateCw, Volume2, X } from "lucide-react"
import type { Exercise } from "@/lib/types"
import { answersMatch, exerciseTypeLabel } from "@/lib/exercises"
import { speakSpanish } from "@/lib/speak"

export type AnswerOutcome = { correct: boolean }

/**
 * Renders a single exercise and reports the result via onResult.
 * Handles all 7 exercise types.
 */
export function ExerciseCard({
  exercise,
  onResult,
  onContinue,
}: {
  exercise: Exercise
  onResult: (o: AnswerOutcome) => void
  onContinue: () => void
}) {
  const [revealed, setRevealed] = useState(false) // flashcards
  const [flipped, setFlipped] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [textValue, setTextValue] = useState("")
  const [tokens, setTokens] = useState<string[]>([])
  const [checked, setChecked] = useState<null | boolean>(null)

  // reset per exercise
  useEffect(() => {
    setRevealed(false)
    setFlipped(false)
    setSelected(null)
    setTextValue("")
    setTokens([])
    setChecked(null)
  }, [exercise.id])

  const isFlashcard = exercise.type === "flashcard" || exercise.type === "reverse-flashcard"

  function finish(correct: boolean) {
    setChecked(correct)
    onResult({ correct })
  }

  // ---------- Flashcard ----------
  if (isFlashcard) {
    return (
      <div className="space-y-5">
        <Label>{exerciseTypeLabel(exercise.type)}</Label>
        <div className="flip-card">
          <button
            type="button"
            onClick={() => {
              setFlipped((f) => !f)
              setRevealed(true)
            }}
            className={`flip-card-inner ${flipped ? "flipped" : ""} block w-full text-left`}
            aria-label="Перевернуть карточку"
          >
            <div className="flip-face flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border bg-card p-6">
              <p className="text-balance text-center text-3xl font-black text-foreground">{exercise.prompt}</p>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <RotateCw className="size-4" /> Нажми, чтобы увидеть ответ
              </span>
            </div>
            <div className="flip-back flip-face flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-primary bg-primary p-6 text-primary-foreground">
              <p className="text-balance text-center text-2xl font-black">{exercise.answer}</p>
              {exercise.example && (
                <p className="text-pretty text-center text-sm text-primary-foreground/85">“{exercise.example}”</p>
              )}
            </div>
          </button>
        </div>

        <div className="flex justify-center">
          <SpeakButton text={exercise.type === "flashcard" ? exercise.prompt : exercise.answer} />
        </div>

        {exercise.notes && (
          <p className="rounded-2xl bg-secondary/60 p-3 text-sm text-secondary-foreground">{exercise.notes}</p>
        )}

        <button
          type="button"
          disabled={!revealed}
          onClick={() => {
            onResult({ correct: true })
            onContinue()
          }}
          className="w-full rounded-2xl bg-success py-3.5 font-black text-success-foreground transition hover:brightness-105 disabled:opacity-50"
        >
          Запомнил
        </button>
      </div>
    )
  }

  // ---------- Choice-based (MC / true-false) ----------
  if (exercise.type === "multiple-choice" || exercise.type === "true-false") {
    const options =
      exercise.type === "true-false"
        ? [
            { value: "true", label: "Верно" },
            { value: "false", label: "Неверно" },
          ]
        : (exercise.options ?? []).map((o) => ({ value: o, label: o }))

    return (
      <div className="space-y-5">
        <Label>{exerciseTypeLabel(exercise.type)}</Label>
        <Prompt speakText={exercise.type === "multiple-choice" ? exercise.spanish : undefined}>
          {exercise.type === "true-false" ? (
            <>Это верный перевод?<br /><span className="text-primary">{exercise.prompt}</span></>
          ) : (
            <>Переведи: <span className="text-primary">{exercise.prompt}</span></>
          )}
        </Prompt>

        <div className="grid gap-2.5">
          {options.map((o) => {
            const isSel = selected === o.value
            const showState = checked !== null
            const isCorrectOpt = answersMatch(o.value, exercise.answer)
            let cls = "border-border bg-card hover:border-primary"
            if (showState && isCorrectOpt) cls = "border-success bg-success/10 text-foreground"
            else if (showState && isSel && !isCorrectOpt) cls = "border-destructive bg-destructive/10"
            else if (isSel) cls = "border-primary bg-primary/5"
            return (
              <button
                key={o.value}
                type="button"
                disabled={checked !== null}
                onClick={() => setSelected(o.value)}
                className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left font-bold text-foreground transition ${cls}`}
              >
                {o.label}
                {showState && isCorrectOpt && <Check className="size-5 text-success" />}
                {showState && isSel && !isCorrectOpt && <X className="size-5 text-destructive" />}
              </button>
            )
          })}
        </div>

        <Actions
          checked={checked}
          canCheck={selected !== null}
          onCheck={() => finish(answersMatch(selected ?? "", exercise.answer))}
          onContinue={onContinue}
          correctAnswer={exercise.answer === "true" ? "Верно" : exercise.answer === "false" ? "Неверно" : exercise.answer}
        />
      </div>
    )
  }

  // ---------- Fill blank / translation ----------
  if (exercise.type === "fill-blank" || exercise.type === "translation") {
    return (
      <div className="space-y-5">
        <Label>{exerciseTypeLabel(exercise.type)}</Label>
        <Prompt>
          {exercise.type === "translation" ? (
            <>Переведи на испанский:<br /><span className="text-primary">{exercise.prompt}</span></>
          ) : (
            <span className="text-primary">{exercise.prompt}</span>
          )}
        </Prompt>
        <input
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              if (checked === null && textValue.trim()) finish(answersMatch(textValue, exercise.answer))
              else if (checked !== null) onContinue()
            }
          }}
          disabled={checked !== null}
          autoFocus
          placeholder="Твой ответ…"
          className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-lg font-bold text-foreground outline-none transition focus:border-primary disabled:opacity-70"
          aria-label="Введите ответ"
        />
        <Actions
          checked={checked}
          canCheck={textValue.trim().length > 0}
          onCheck={() => finish(answersMatch(textValue, exercise.answer))}
          onContinue={onContinue}
          correctAnswer={exercise.answer}
        />
      </div>
    )
  }

  // ---------- Build sentence ----------
  if (exercise.type === "build-sentence") {
    const bank = exercise.tokens ?? []
    const used = tokens
    const remaining = (() => {
      const copy = [...bank]
      for (const t of used) {
        const i = copy.indexOf(t)
        if (i >= 0) copy.splice(i, 1)
      }
      return copy
    })()

    return (
      <div className="space-y-5">
        <Label>{exerciseTypeLabel(exercise.type)}</Label>
        <Prompt>Собери фразу: <span className="text-primary">{exercise.prompt}</span></Prompt>

        <div className="min-h-16 rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-3">
          <div className="flex flex-wrap gap-2">
            {used.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                disabled={checked !== null}
                onClick={() => setTokens((prev) => prev.filter((_, idx) => idx !== i))}
                className="rounded-xl bg-primary px-3 py-2 font-bold text-primary-foreground"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {remaining.map((t, i) => (
            <button
              key={`${t}-${i}`}
              type="button"
              disabled={checked !== null}
              onClick={() => setTokens((prev) => [...prev, t])}
              className="rounded-xl border-2 border-border bg-card px-3 py-2 font-bold text-foreground transition hover:border-primary"
            >
              {t}
            </button>
          ))}
        </div>

        <Actions
          checked={checked}
          canCheck={used.length > 0}
          onCheck={() => finish(answersMatch(used.join(" "), exercise.answer))}
          onContinue={onContinue}
          correctAnswer={exercise.answer}
        />
      </div>
    )
  }

  return null
}

// ---------- helpers ----------
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-black uppercase tracking-wide text-muted-foreground">{children}</p>
}

function Prompt({ children, speakText }: { children: React.ReactNode; speakText?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <h2 className="text-balance text-2xl font-black leading-snug text-foreground">{children}</h2>
      {speakText && <SpeakButton text={speakText} />}
    </div>
  )
}

function SpeakButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => speakSpanish(text)}
      className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-border bg-card text-primary transition hover:border-primary"
      aria-label="Произнести по-испански"
    >
      <Volume2 className="size-5" />
    </button>
  )
}

function Actions({
  checked,
  canCheck,
  onCheck,
  onContinue,
  correctAnswer,
}: {
  checked: null | boolean
  canCheck: boolean
  onCheck: () => void
  onContinue: () => void
  correctAnswer: string
}) {
  if (checked === null) {
    return (
      <button
        type="button"
        disabled={!canCheck}
        onClick={onCheck}
        className="w-full rounded-2xl bg-primary py-3.5 font-black text-primary-foreground transition hover:brightness-105 disabled:opacity-50"
      >
        Проверить
      </button>
    )
  }
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        checked ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
      }`}
    >
      <p className={`flex items-center gap-2 font-black ${checked ? "text-success" : "text-destructive"}`}>
        {checked ? <Check className="size-5" /> : <X className="size-5" />}
        {checked ? "Верно!" : "Не совсем"}
      </p>
      {!checked && (
        <p className="mt-1 text-sm text-foreground">
          Правильный ответ: <span className="font-black">{correctAnswer}</span>
        </p>
      )}
      <button
        type="button"
        onClick={onContinue}
        autoFocus
        className={`mt-3 w-full rounded-2xl py-3 font-black text-primary-foreground transition hover:brightness-105 ${
          checked ? "bg-success text-success-foreground" : "bg-primary"
        }`}
      >
        Дальше
      </button>
    </div>
  )
}
