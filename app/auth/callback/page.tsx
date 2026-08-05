"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState(false)

  useEffect(() => {
    async function finishSignIn() {
      const supabase = createClient()
      const code = new URLSearchParams(window.location.search).get("code")
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError(true)
          return
        }
      }
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError(true)
        return
      }
      router.replace("/dashboard")
    }
    finishSignIn()
  }, [router])

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div>
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-muted border-t-primary" aria-hidden />
        <h1 className="mt-5 text-xl font-black text-foreground">{error ? "Ссылка не сработала" : "Входим в аккаунт…"}</h1>
        {error && <a href="/auth/login/" className="mt-4 inline-block font-bold text-primary">Запросить новую ссылку</a>}
      </div>
    </main>
  )
}
