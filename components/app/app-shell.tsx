"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BarChart3,
  BookOpen,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Repeat,
  Settings,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react"
import { StatBar } from "./stat-bar"
import { useAccount } from "./account-provider"
import { useProgress, selectDueReviews } from "@/lib/progress"

const NAV = [
  { href: "/dashboard", label: "Главная", icon: Home },
  { href: "/lessons", label: "Уроки", icon: BookOpen },
  { href: "/review", label: "Повторение", icon: Repeat, badge: "reviews" as const },
  { href: "/mistakes", label: "Ошибки", icon: TriangleAlert },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
  { href: "/settings", label: "Настройки", icon: Settings },
  { href: "/about", label: "О проекте", icon: Info },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const s = useProgress()
  const { session, isAdmin, signOut } = useAccount()
  const dueCount = selectDueReviews(s).length

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge === "reviews" && dueCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-xs font-black text-gold-foreground">
                {dueCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-1 font-black text-sidebar-foreground">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">ñ</span>
          <span className="text-lg">Español Real</span>
        </Link>
        <NavLinks />
        <div className="mt-auto flex flex-col gap-2">
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent">
              <ShieldCheck className="size-4" /> Ученики
            </Link>
          )}
          {session ? (
            <button type="button" onClick={() => signOut()} className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="size-4" /> Выйти
            </button>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-black text-primary-foreground">
              <LogIn className="size-4" /> Войти по email
            </Link>
          )}
          <div className="rounded-2xl bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground">
            {session ? "Прогресс синхронизируется с аккаунтом." : "Гостевой прогресс хранится в этом браузере."}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-10 place-items-center rounded-xl border-2 border-border lg:hidden"
            aria-label="Открыть меню"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex-1 overflow-x-auto">
            <StatBar />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-sidebar p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 font-black text-sidebar-foreground"
              >
                <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">ñ</span>
                <span className="text-lg">Español Real</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-xl border-2 border-sidebar-border"
                aria-label="Закрыть меню"
              >
                <X className="size-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
