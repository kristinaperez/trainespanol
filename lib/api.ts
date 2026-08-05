import { createClient } from "@/lib/supabase/client"

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "")

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("AUTH_REQUIRED")

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...init?.headers,
    },
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "REQUEST_FAILED")
  return body as T
}
