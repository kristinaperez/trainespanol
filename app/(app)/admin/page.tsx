"use client"

import Link from "next/link"
import useSWR from "swr"
import { CreditCard, GraduationCap, ShieldCheck, Users } from "lucide-react"
import { useAccount } from "@/components/app/account-provider"
import { apiFetch } from "@/lib/api"
import type { AdminStudent } from "@/lib/account-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function date(value?: string | null) {
  return value ? new Date(value).toLocaleDateString("ru-RU") : "—"
}

export default function AdminPage() {
  const { session, isAdmin, loading } = useAccount()
  const { data, error, isLoading } = useSWR<{ students: AdminStudent[] }>(
    isAdmin ? "/api/admin/students" : null,
    apiFetch,
  )

  if (loading || isLoading) {
    return <div className="mx-auto mt-20 size-10 animate-spin rounded-full border-4 border-muted border-t-primary" aria-label="Загрузка списка учеников" />
  }

  if (!session || !isAdmin) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <ShieldCheck className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-black text-foreground">Закрытый раздел</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground">Доступ есть только у аккаунтов с ролью администратора.</p>
        {!session && <Link href="/auth/login/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-black text-primary-foreground">Войти по email</Link>}
      </div>
    )
  }

  if (error || !data) {
    return <p className="py-16 text-center text-destructive">Не удалось загрузить базу учеников.</p>
  }

  const paid = data.students.filter((student) => student.entitlement?.status === "active").length
  const active = data.students.filter((student) => student.progressUpdatedAt).length

  return (
    <div className="flex w-full flex-col gap-6">
      <header>
        <p className="font-bold text-primary">Администрирование</p>
        <h1 className="text-balance font-heading text-3xl font-extrabold text-foreground">Ученики курса</h1>
        <p className="mt-1 leading-relaxed text-muted-foreground">Email, учебный прогресс и статус полного доступа.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-5"><Users className="size-5 text-primary" /><div><p className="text-2xl font-black">{data.students.length}</p><p className="text-sm text-muted-foreground">аккаунтов</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><GraduationCap className="size-5 text-primary" /><div><p className="text-2xl font-black">{active}</p><p className="text-sm text-muted-foreground">учились</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><CreditCard className="size-5 text-primary" /><div><p className="text-2xl font-black">{paid}</p><p className="text-sm text-muted-foreground">оплатили</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>База учеников</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-y border-border bg-muted/50 text-muted-foreground">
              <tr><th className="px-5 py-3 font-bold">Email</th><th className="px-5 py-3 font-bold">XP</th><th className="px-5 py-3 font-bold">Уроки</th><th className="px-5 py-3 font-bold">Доступ</th><th className="px-5 py-3 font-bold">Последняя активность</th><th className="px-5 py-3 font-bold">Регистрация</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.students.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-4 font-bold text-foreground">{student.email ?? "Без email"}</td>
                  <td className="px-5 py-4">{student.xp}</td>
                  <td className="px-5 py-4">{student.completedLessons}</td>
                  <td className="px-5 py-4"><span className={student.entitlement?.status === "active" ? "font-bold text-secondary" : "text-muted-foreground"}>{student.entitlement?.status === "active" ? "Полный" : "Бесплатный"}</span></td>
                  <td className="px-5 py-4 text-muted-foreground">{date(student.progressUpdatedAt ?? student.lastSignInAt)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{date(student.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.students.length === 0 && <p className="p-8 text-center text-muted-foreground">Пока нет зарегистрированных учеников.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
