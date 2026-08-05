import type { ProgressState } from "@/lib/progress"

export interface AccountSnapshot {
  user: { id: string; email?: string; isAdmin: boolean }
  progress: {
    state: ProgressState
    revision: number
    migration_status: "pending" | "imported" | "fresh"
    updated_at: string
  } | null
  hasFullAccess: boolean
  entitlement: { status: string; purchased_at: string | null } | null
}

export interface AdminStudent {
  id: string
  email?: string
  createdAt: string
  lastSignInAt?: string
  xp: number
  completedLessons: number
  progressUpdatedAt: string | null
  entitlement: { status: string; purchased_at: string | null } | null
}
