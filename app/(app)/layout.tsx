"use client"

import { useEffect } from "react"
import { AppShell } from "@/components/app/app-shell"
import { progressActions } from "@/lib/progress"

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    progressActions.ensureTrial()
  }, [])

  return <AppShell>{children}</AppShell>
}
