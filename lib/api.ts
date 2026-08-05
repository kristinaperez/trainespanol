import { createClient } from "@/lib/supabase/client"

const API_URL = (
  process.env.NODE_ENV === "development"
    ? "/backend-api"
    : process.env.NEXT_PUBLIC_API_URL
).replace(/\/$/, "")

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const headers = new Headers(init?.headers)
  headers.set("Content-Type", "application/json")
  if (session) headers.set("Authorization", `Bearer ${session.access_token}`)

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "REQUEST_FAILED")
  return body as T
}
