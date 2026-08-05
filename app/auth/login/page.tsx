"use client"

import Link from "next/link"
import { useState } from "react"
import { Mail, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setStatus("sending")
    const supabase = createClient()
    const redirectTo = process.env.NODE_ENV === "development"
      ? (process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback/`)
      : `${window.location.origin}/auth/callback/`
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    })
    setStatus(error ? "error" : "sent")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/dashboard" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Вернуться к курсу
          </Link>
          <CardTitle className="text-balance text-2xl font-black">Войти в Español Real</CardTitle>
          <p className="leading-relaxed text-muted-foreground">Пришлём безопасную ссылку для входа. Пароль не нужен.</p>
        </CardHeader>
        <CardContent>
          {status === "sent" ? (
            <div className="rounded-2xl bg-secondary/10 p-5 text-secondary">
              <Mail className="mb-3 size-6" />
              <p className="font-black">Проверьте почту</p>
              <p className="mt-1 text-sm leading-relaxed">Ссылка отправлена на {email}. Откройте её на этом устройстве.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
              </div>
              {status === "error" && <p className="text-sm text-destructive">Не удалось отправить ссылку. Проверьте email и попробуйте позже.</p>}
              <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Отправляем…" : "Получить ссылку для входа"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
