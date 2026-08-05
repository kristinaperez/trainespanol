"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { apiFetch } from "@/lib/api"
import type { AccountSnapshot } from "@/lib/account-types"
import {
  getDefaultProgressState,
  getProgressState,
  replaceProgressState,
  useProgress,
} from "@/lib/progress"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AccountContextValue {
  session: Session | null
  account: AccountSnapshot | null
  loading: boolean
  hasFullAccess: boolean
  isAdmin: boolean
  refreshAccount: () => Promise<AccountSnapshot | undefined>
  signOut: () => Promise<void>
}

const AccountContext = createContext<AccountContextValue | null>(null)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null)
  const [migrationOpen, setMigrationOpen] = useState(false)
  const progress = useProgress()
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthReady(true)
      if (!nextSession) setHydratedUserId(null)
    })
    return () => data.subscription.unsubscribe()
  }, [supabase])

  const { data: account, isLoading, mutate } = useSWR<AccountSnapshot>(
    session ? ["account", session.user.id] : null,
    () => apiFetch<AccountSnapshot>("/api/me"),
    { revalidateOnFocus: true },
  )

  useEffect(() => {
    if (!account || hydratedUserId === account.user.id) return
    if (account.progress?.state) {
      replaceProgressState(account.progress.state)
      setHydratedUserId(account.user.id)
    } else {
      setMigrationOpen(true)
    }
  }, [account, hydratedUserId])

  useEffect(() => {
    if (!session || hydratedUserId !== session.user.id) return
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      apiFetch("/api/progress", {
        method: "PUT",
        body: JSON.stringify({
          state: progress,
          migrationStatus: account?.progress?.migration_status === "fresh" ? "fresh" : "imported",
        }),
      }).catch(() => undefined)
    }, 800)
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [account?.progress?.migration_status, hydratedUserId, progress, session])

  async function chooseProgress(mode: "imported" | "fresh") {
    const state = mode === "imported" ? getProgressState() : getDefaultProgressState()
    if (mode === "fresh") replaceProgressState(state)
    await apiFetch("/api/progress", {
      method: "PUT",
      body: JSON.stringify({ state, migrationStatus: mode }),
    })
    setHydratedUserId(session!.user.id)
    setMigrationOpen(false)
    await mutate()
  }

  const value: AccountContextValue = {
    session,
    account: account ?? null,
    loading: !authReady || (Boolean(session) && isLoading),
    hasFullAccess: account?.hasFullAccess ?? false,
    isAdmin: account?.user.isAdmin ?? false,
    refreshAccount: async () => mutate(),
    signOut: async () => {
      await supabase.auth.signOut()
      replaceProgressState(getDefaultProgressState())
      setHydratedUserId(null)
      setSession(null)
    },
  }

  return (
    <AccountContext.Provider value={value}>
      {children}
      <Dialog open={migrationOpen} onOpenChange={() => undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Как начать синхронизацию?</DialogTitle>
            <DialogDescription>
              В этом браузере уже может быть прогресс. Выберите, перенести его в аккаунт или начать обучение заново.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => chooseProgress("fresh")}>Начать с нуля</Button>
            <Button onClick={() => chooseProgress("imported")}>Перенести мой прогресс</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) throw new Error("useAccount must be used inside AccountProvider")
  return context
}
