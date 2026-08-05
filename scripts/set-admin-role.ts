import { createClient } from "@supabase/supabase-js"

const [emailArg, roleArg = "admin"] = process.argv.slice(2)
const email = emailArg?.trim().toLowerCase()
const role = roleArg === "remove" ? null : roleArg

if (!email || (role !== "admin" && role !== null)) {
  throw new Error("Usage: pnpm admin:role <email> [admin|remove]")
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

let matchedUser: Awaited<ReturnType<typeof supabase.auth.admin.listUsers>>["data"]["users"][number] | undefined
for (let page = 1; page <= 100 && !matchedUser; page += 1) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 })
  if (error) throw error
  matchedUser = data.users.find((user) => user.email?.toLowerCase() === email)
  if (data.users.length < 100) break
}

if (!matchedUser) throw new Error(`User ${email} was not found. Sign in once before assigning the role.`)

const appMetadata = { ...matchedUser.app_metadata }
if (role) appMetadata.role = role
else delete appMetadata.role

const { error } = await supabase.auth.admin.updateUserById(matchedUser.id, {
  app_metadata: appMetadata,
})
if (error) throw error

console.log(role ? `Admin role assigned to ${email}` : `Admin role removed from ${email}`)
