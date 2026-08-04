"use client"

import { useState } from "react"
import {
  useProgress,
  progressActions,
  isPremium,
} from "@/lib/progress"
import { DAILY_GOALS } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sun, Moon, Monitor, Heart, Volume2, Crown, Trash2, KeyRound } from "lucide-react"

const THEMES = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
] as const

export function SettingsView() {
  const s = useProgress()
  const premium = isPremium(s)
  const [resetOpen, setResetOpen] = useState(false)
  const [keyInput, setKeyInput] = useState("")
  const [keyError, setKeyError] = useState(false)

  function applyKey() {
    const ok = progressActions.activatePremium(keyInput)
    setKeyError(!ok)
    if (ok) setKeyInput("")
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-foreground">Настройки</h1>
        <p className="mt-1 text-muted-foreground">Настройте тренажёр под себя</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ваше имя</Label>
            <Input
              id="name"
              placeholder="Как вас зовут?"
              value={s.studentName}
              onChange={(e) => progressActions.setStudentName(e.target.value)}
              maxLength={40}
            />
            <p className="text-xs text-muted-foreground">
              Будет вписано в ваш сертификат об окончании курса.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Оформление</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Тема</Label>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => {
              const Icon = t.icon
              const active = s.theme === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => progressActions.setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                  aria-pressed={active}
                >
                  <Icon className="h-5 w-5" />
                  {t.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Обучение</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Дневная цель (XP)</Label>
            <div className="grid grid-cols-4 gap-2">
              {DAILY_GOALS.map((g) => {
                const active = s.dailyGoal === g.xp
                return (
                  <button
                    key={g.xp}
                    onClick={() => progressActions.setDailyGoal(g.xp)}
                    className={`rounded-xl border-2 p-3 text-center transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="font-heading text-lg font-extrabold">{g.xp}</div>
                    <div className="text-xs">{g.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Heart className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="hearts" className="cursor-pointer">
                  Система жизней
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ошибки отнимают жизни — тренируйтесь внимательнее (как в игре).
                </p>
              </div>
            </div>
            <Switch
              id="hearts"
              checked={s.heartsEnabled}
              onCheckedChange={(v) => progressActions.setHeartsEnabled(v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Premium */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Crown className="h-5 w-5 text-accent" />
            Полный доступ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {premium ? (
            <div className="rounded-xl bg-secondary/10 p-4 text-secondary">
              <p className="font-semibold">Полный доступ активирован</p>
              <p className="text-sm text-secondary/80">Ключ: {s.premiumKey}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Введите ключ активации, чтобы открыть все 45 уроков. Формат: XXXX-XXXX-XXXX.
              </p>
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="key">Ключ активации</Label>
                  <Input
                    id="key"
                    placeholder="ABCD-1234-EFGH"
                    value={keyInput}
                    onChange={(e) => {
                      setKeyInput(e.target.value.toUpperCase())
                      setKeyError(false)
                    }}
                  />
                </div>
                <Button onClick={applyKey}>
                  <KeyRound className="mr-1.5 h-4 w-4" />
                  Активировать
                </Button>
              </div>
              {keyError && <p className="text-sm text-destructive">Неверный формат ключа.</p>}
              <p className="text-xs text-muted-foreground">
                Демо-ключ для проверки: <span className="font-mono">HOLA-2024-REAL</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-heading text-destructive">Сброс прогресса</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Удалить весь прогресс, XP, серию и достижения. Действие необратимо.
          </p>
          <Button variant="destructive" onClick={() => setResetOpen(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Сбросить
          </Button>
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сбросить весь прогресс?</DialogTitle>
            <DialogDescription>
              Вы потеряете {s.xp} XP, серию из {s.streakCurrent} дней и все достижения. Это действие
              нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                progressActions.reset()
                setResetOpen(false)
              }}
            >
              Да, сбросить всё
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="flex items-center justify-center gap-1.5 pb-4 text-center text-xs text-muted-foreground">
        <Volume2 className="h-3.5 w-3.5" />
        Озвучка использует встроенный синтезатор речи вашего браузера.
      </p>
    </div>
  )
}
